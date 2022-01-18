<!-- 回答列表 item，包含多级回复 -->
<template>
<div class="body">
    <div class="avatar-box">
        <div class="avatar">
          <Avatar :avatar="this.avatar" :role="role" :id="replier" />
        </div>
        <div class="info">
            <h4>{{ nickname }}</h4>
            <abbr>{{ duration }} · 回答了问题</abbr>
        </div>
    </div>
    <article class="content" v-html="content" v-on:click="goToDetail" />
    <section class="actions">
      <a class="action-item" style="margin-right: 32px" v-on:click="like">
        <img :src="likeIcon" /><span>{{ currentLikes }}</span>
      </a>
      <div class="action-item"><img src="/img/btn_share.png" /><span>分享</span></div>
      <div class="space" />
      <div>{{ replies }} 个评论</div>
    </section>
</div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Avatar from "./Avatar";

export default {
  name: 'Answer',
  components: { Avatar },
  props: {
    articleId: Number,
    id: Number,
    nickname: String,
    intro: String,
    replier: Number,
    avatar: String,
    content: String,
    replies: Number,
    likes: Number,
    isLike: Boolean,
    replyList: Array,
    role: Number,
    repliedAt: Number,
  },
  data () {
    return {
      currentIsLike: this.isLike,
      currentLikes: this.likes
    }
  },
  computed: {
    likeIcon() {
      return this.currentIsLike ? "/img/btn_love_highlighted.png" : "/img/btn_love_tick.png"
    },
    duration() {
      if (!this.repliedAt) {
        return "加载中..."
      }

      let now = moment();
      let createdAt = moment(this.repliedAt * 1000);
      let diff = moment.duration(now.diff(createdAt));
      if (diff.asDays() > 10) {
        return createdAt.format('YYYY-MM-DD')
      } else if (diff.asHours() >= 24) {
        return `${parseInt(diff.asDays())} 天前`
      } else if (diff.asMinutes() >= 60) {
        return `${parseInt(diff.asHours())} 小时前`
      } else if (diff.asSeconds() >= 60) {
        return `${parseInt(diff.asMinutes())} 分钟前`
      } else if (diff.asSeconds() > 0) {
        return `${parseInt(diff.asSeconds())} 秒前`
      } else {
        return "刚刚";
      }
    }
  },
  methods: {
    goToDetail() {
      const { Page } = window;
      Page && Page.postMessage(
        JSON.stringify({
          "event": "showAnswerDetail",
          "data": {
            "topicId": this.articleId,
            "replyId": this.id
          }
        })
      )
      if (!Page) {
        window.location.href = `/reply/${this.id}/topic/${this.articleId}`;
      }
    },
    like() {
        const isLike = this.currentIsLike
        axios.post(`/user/topic/like`, {
          topicId: this.articleId,
          replyId: this.id
        })
        .then(() => {
          this.currentIsLike = !isLike;
          const count = isLike? -1 : 1;
          this.currentLikes += count;
        });
    }
  }
}
</script>

<style scoped>
.body {
    background: white;
    padding: 16px 0;
}

.avatar-box {
    padding: 0 18px 16px;
    display: flex;
    align-items: center;
}

.info {
  color: black;
  flex: 1;
}

.info abbr {
  display: block;
  font-size: 12px;
  color: rgba(0, 0, 0, 60%)
}

.avatar {
}

article {
    padding: 0px 18px;
}

h4 {
    margin: 0;
}

.actions {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 0px 28px;
  align-items: center;
}

.space {
  flex:1
}

.action-item {
  padding: 7px 0;
  display: flex;
  align-items: center;

}

.action-item > img {
  width: 18px;
  margin-right: 5px;
}

.action-item > span {
  line-height: normal;
}

</style>
