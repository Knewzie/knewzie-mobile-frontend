<template>
  <div id="app">
    <div class="article"> 
      <Author 
          :name="article.creator.nickname" 
          :avatar="article.creator.avatar" 
          :intro="article.creator.intro" />
      <article>
        <h3>{{ article.title }}</h3>
        <div class="abbr-box time-box">
          <time>2分钟前</time>
        </div>
        <div class="abbr-box tags"  v-if="article.categories.length > 0">
          <span v-for="category in article.categories" :key="category.id">
            {{ category.name }}
          </span>
        </div>
        <div class="content" v-html="article.content">
        </div>
      </article>
    </div>
    <section class="answer-actions">
      <div><div style="">邀请回答</div></div>
      <div>我要回答</div>
      <div>视频回答</div>
    </section>
    <section class="actions">
      <div class="action-item" style="margin-right: 32px">
        <img src="/images/btn_love_tick.png" /><span>{{ article.likes }}</span>
      </div>
      <div class="action-item"><img src="/images/btn_share.png" /><span>分享</span></div>
      <div class="space" />
      <div>{{ article.replies }} 个回答</div>
    </section>
    <section class="sort" v-if="article.replyList.length > 0">
      按热度
    </section>
    <div v-if="article.replyList.length > 0">
      <Answer class="answer-item" 
        v-for="reply in article.replyList" 
        :key="reply.id"
        :content="reply.content"
        :avatar="reply.replier.avatar"
        :nickname="reply.replier.nickname" />
    </div>
  </div>
</template>

<script>
import Author from './components/Author.vue'
import Answer from './components/Answer.vue'
// import url from 'url'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Author, Answer
  },
  data: () => ({
    article: {
      title: "加载中...",
      content: "加载中...",
      categories: [],
      likes: 0,
      replies: 0,
      creator: {
        name: "加载中...",
        nickname: "加载中...",
        title: "",
        avatar: "",
        intro: "",
      },
      replyList: []
    }
  }),
  created() {
    const { id } = this.$router.currentRoute.query;
    axios.get(`/api/detail/${id}`)
        .then((response) => {
          const { data } = response.data
          this.article = data;
        }).finally(() => {
            const { Page } = window;
            if (!Page) { return; }
            Page.postMessage(
              JSON.stringify(
                {"event": "pageMounted"}  
              )
            );
        })
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>

<style scoped>

h3 {
  margin: 0;
}

.sort {
 padding: 12px 28px;
 color: #B3B3B3;
 font-size: 12px;
}

.answer-actions {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: center;
}

.answer-actions > * {
  flex: 1;
  color: #3C3C3E;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.actions {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: center;
}

.action-item {
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

.space {
  flex:1
}

.actions > * {
  color: #3C3C3E;
  font-size: 14px;
  font-weight: bold;
}

.article {
  background: white;
}

.tags {
  margin: 10px 0;
}

.tags span {
  background: #D0D0D0;
  padding: 1px 8px;
  border-radius: 10px;
  margin-left: 5px;
  font-size: 10px;
  color: #8D8D8E;
}

.tags span:first-child {
  margin: 0px;
}

.time-box {
  margin: 7px 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #F6F6F6;
}

.abbr-box {
  display: flex;
}

article {
  padding: 14px 18px;
}

.answer-item {
  margin-top: 16px;
}

.answer-item:first-child {
  margin: 0;
}

</style>
