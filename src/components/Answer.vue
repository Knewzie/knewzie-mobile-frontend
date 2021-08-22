<template>
<div class="body">
    <div class="avatar-box">
        <div class="avatar">
            <img :src="avatar"/>
        </div>
        <div class="info">
            <h4>{{ nickname }}</h4>
            <abbr>5分钟前 · 回答了问题</abbr>
        </div>
    </div>
    <article class="content" v-html="content" />
    <section class="actions">
      <a class="action-item" style="margin-right: 32px" v-on:click="like">
        <img :src="likeIcon" /><span>{{ currentLikes }}</span>
      </a>
      <div class="action-item"><img src="/images/btn_share.png" /><span>分享</span></div>
      <div class="space" />
      <div>{{ replies }} 个评论</div>
    </section>
</div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Answer',
  props: {
    articleId: Number,
    id: Number,
    nickname: String,
    intro: String,
    avatar: String,
    content: String,
    replies: Number,
    likes: Number,
    isLike: Boolean
  },
  data () {
    return {
      currentIsLike: this.isLike,
      currentLikes: this.likes
    }
  },
  computed: {
    likeIcon() {
      return this.currentIsLike ? "/images/btn_love_highlighted.png" : "/images/btn_love_tick.png"
    }
  },
  methods: {
    like() {
        const isLike = this.currentIsLike
        axios.post(`/api/article/${this.articleId}/answer/${this.id}/like`)
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
    flex: 1;
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