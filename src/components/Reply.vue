<!-- 回答列表 item，包含多级回复 -->
<template>
  <div class="body">
    <div class="avatar-box">
      <div class="avatar">
        <Avatar :avatar="this.avatar" :role="role" :id="id" />
      </div>
      <div class="info">
        <h4>{{ nickname }}</h4>
        <abbr>{{ duration }} · 评论了回答</abbr>
      </div>
    </div>
    <article class="content" v-html="content" v-on:click="replyTo" />
    <section class="actions">
      <a class="action-item" style="margin-right: 32px" v-on:click="like">
        <img :src="likeIcon" /><span>{{ currentLikes }}</span>
      </a>
      <div class="action-item"><img src="/img/btn_share.png" /><span>分享</span></div>
      <div class="space" />
      <div>{{ replies }} 个评论</div>
    </section>
    <div class="reply-container" v-if="replyList.length > 0">
      <ReplyCollapseItem
          v-for="reply in replyList"
          :key="reply.id"
          :id="reply.id"
          :topicId="topicId"
          :nickname="reply.replier.nickname"
          :content="reply.content"
          :likes="reply.likes"
          :isLike="reply.isLike"
          :receiver="reply.receiver"
          :repliedAt="reply.repliedAt"
      />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import ReplyCollapseItem from "./ReplyCollapseItem";

export default {
  name: 'Reply',
  components: {
    ReplyCollapseItem
  },
  props: {
    topicId: Number,
    id: Number,
    nickname: String,
    authorId: Number,
    intro: String,
    avatar: String,
    content: String,
    replies: Number,
    likes: Number,
    isLike: Boolean,
    replyList: Array,
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
    like() {
      const isLike = this.currentIsLike
      axios.post(`/user/topic/like`, {
        topicId: this.topicId,
        replyId: this.id
      })
      .then(() => {
          this.currentIsLike = !isLike;
          const count = isLike? -1 : 1;
          this.currentLikes += count;
      });
    },
    replyTo() {
      const { Page } = window;
      if (!Page) return;
      Page.postMessage(JSON.stringify(
          {"event": "replyTo", data : { topicId: parseInt(this.topicId), replyId: parseInt(this.id), author: this.nickname }}
      ));
    }
  }
}
</script>

<style scoped>

.reply-container {
  font-size: 14px;
  margin: 10px 32px;
  padding: 12px;
  background-color: rgb(246, 246, 246);
}

.reply-box {
  display: flex;
  align-items: flex-start;
}

.reply-box .action-item {
  padding: 0;
  margin-left: 2px;
}

.reply-content-container {
  flex: 1;
}

.reply-box .author {
  color: black;
  font-weight: bold;
}

.reply-box .reply-content {
  color: rgb(115, 115, 115);
}

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
  width: 40px;
  height: 40px;
  margin-right: 16px;
}

.avatar img {
  object-fit: cover; /* Do not scale the image */
  width: 40px;
  height: 40px;
  background-color: gray;
  border-radius: 20px;
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
