<template>
  <div id="app">
    <div class="article">
      <div class="topic-title">{{ article.title }}</div>
      <Author
          :id="article.replier.uid"
          :name="article.replier.nickname"
          :avatar="article.replier.avatar"
          :intro="article.replier.intro"
          :role="article.replier.role"
          :title="article.replier.title"
          :showFollow="true"
          :relationship="article.replier.relationship" />
      <article v-on:click="replyTo">
        <div class="content" v-html="article.content" >
        </div>
        <div class="abbr-box time-box">
          <time>回答于 {{ duration }}</time>
          <span style="flex: 1"></span>
          <a v-on:click="report"><i class="btn-report" /></a>
        </div>
      </article>
    </div>

    <section class="actions">
      <a class="action-item"
         v-bind:class="{ active: type === 0 }"
         style="margin-right: 32px"
         v-on:click="like">
        <img class="btn-prefix" src="/img/btn_love_highlighted.png" />
        <span>{{ article.likes }}</span>
      </a>
      <a class="action-item"
         v-on:click="share">
        <img class="btn-prefix" src="/img/btn_share.png" />
        <span>分享</span>
      </a>
      <div class="space" />
      <a class="action-item"
        v-on:click="switchToAnswer"
        v-bind:class="{ active: type === 1 }"
        >{{ article.replies }} 评论</a>
    </section>

    <div v-if="type === 0">
      <AgreePerson
        v-for="user in likers"
        :key="user.id"
        :avatar="user.avatar"
        :name="user.nickname"
        :likedAt="user.likedAt" />
    </div>
    <div v-else>
      <div v-if="article.replyList.length > 0">
        <Reply class="answer-item"
          v-for="reply in article.replyList"
          :topicId="topicId"
          :id="reply.id"
          :key="reply.id"
          :content="reply.content"
          :avatar="reply.replier.avatar"
          :role="reply.replier.role"
          :authorId="reply.replier.uid"
          :nickname="reply.replier.nickname"
          :replies="reply.replies"
          :likes="reply.likes"
          :isLike="reply.isLike"
          :repliedAt="reply.repliedAt"
          :replyList="reply.replyList" />
      </div>
    </div>
  </div>
</template>

<script>
import Author from '../components/Author.vue'
import Reply from '../components/Reply.vue'
import AgreePerson from '../components/AgreePerson.vue'
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'AnswerDetail',
  components: {
    // eslint-disable-next-line
    Author, Reply, AgreePerson
  },
  data: () => ({
    article: {
      id: -1,
      title: "加载中...",
      content: "加载中...",
      categories: [],
      likes: 0,
      replies: 0,
      isLike: false,
      repliedAt: 0,
      replier: {
        name: "加载中...",
        nickname: null,
        title: "",
        avatar: "",
        intro: "",
        relationship: 0,
      },
      replyList: []
    },
    type: 1,
    likers: []
  }),
  computed: {
    topicId() {
      const { topicId } = this.$router.currentRoute.params;
      return parseInt(topicId);
    },
    duration() {
      if (!this.article.repliedAt) {
        return "加载中..."
      }

      let now = moment();
      let createdAt = moment(this.article.repliedAt * 1000);
      let diff = moment.duration(now.diff(createdAt));
      if (diff.asDays() > 10) {
        return createdAt.format('YYYY-MM-DD')
      } else if (diff.asHours() >= 24) {
        return `${Math.floor(diff.asDays())} 天前`
      } else if (Math.floor(diff.asMinutes()) >= 60) {
        return `${Math.floor(diff.asHours())} 小时前`
      } else if (diff.asSeconds() >= 60) {
        return `${Math.floor(diff.asMinutes())} 分钟前`
      } else if (diff.asSeconds() > 0) {
        return `${Math.floor(diff.asSeconds())} 秒前`
      } else {
        return "刚刚";
      }
    }
  },
  created() {
    const { topicId, replyId } = this.$router.currentRoute.params;
    const { Page } = window;
    axios.post(`/reply/details`, { topicId, replyId })
        .then((response) => {
          const { data } = response.data
          this.article = data;
          Page && Page.postMessage(
            JSON.stringify(
              {"event": "loaded", data}
            )
          )
        }).finally(() => {
          Page && Page.postMessage(
            JSON.stringify(
              {"event": "pageMounted"}
            )
          );
        })
  },
  methods: {
    report() {
      const { topicId, replyId } = this.$router.currentRoute.params;
      const { Page } = window;
      Page && Page.postMessage(
          JSON.stringify({
            "event": "report", data: { topicId: parseInt(topicId), replyId: parseInt(replyId) }
          })
      );
    },
    replyTo() {
      const { topicId, replyId } = this.$router.currentRoute.params;
      const { Page } = window;
      if (!Page) return;
      Page.postMessage(JSON.stringify(
          {"event": "replyTo", data : { topicId: parseInt(topicId), replyId: parseInt(replyId), author: this.article.replier.nickname }}
      ));
    },
    like() {
      const { Page } = window;
      const { topicId, replyId } = this.$router.currentRoute.params;

      Page && Page.postMessage(
        JSON.stringify({
          "event": "showProgress"
        })
      )

      axios.post(`/user/topic/likedUser`, { topicId, replyId, page: 1})
        .then((response) => {
          const { data } = response.data
          const { list } = data;
          this.likers = list;
          this.type = 0;
        }).finally(() => {
          Page && Page.postMessage(
            JSON.stringify({
              "event": "dismissProgress"
            })
          )
        })
    },
    share() {
      const { Page } = window;
      const { topicId, replyId } = this.$router.currentRoute.params;
      Page && Page.postMessage(
          JSON.stringify({
            "event": "doShare",
            "data": {
              topicId, replyId
            }
          })
      );
    },
    switchToAnswer() {
      this.type = 1;
    }
  }
}
</script>
<style>
body {
  margin: 0;
  -webkit-touch-callout: none;
  padding-bottom: env(safe-area-inset-bottom);
  background: #F6F6F6;
}

.content img {
  width: 100%;
}
.content video {
  width: 100%;
}

.content .ql-video {
  width: 100%;
}

.content a {
  color: #8DCE44FF;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

a {
  text-decoration: none;
  -webkit-tap-highlight-color:rgba(255,255,255,0.6);
}

</style>

<style scoped>

.btn-report {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url("@/images/ic_report.png");
  background-size: contain;
}

h3 {
  margin: 0;
}

.topic-title {
  padding: 16px;
  font-weight: bold;
  color: black;
  font-size: 20px;
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
  padding: 0 28px;
  align-items: center;
}

.actions .action-item {
  border-bottom: 2px solid transparent;
}

.actions .action-item.active {
  border-bottom: 2px solid #8DCE44FF;
}

.action-item {
  padding: 7px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-prefix {
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
  font-size: 12px;
  color: rgba(0,0,0, 60%);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
