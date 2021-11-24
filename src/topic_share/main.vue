<template>
  <div id="app">
    <div class="article">
      <Author
          :id="article.creator.uid"
          :name="article.creator.nickname"
          :avatar="article.creator.avatar"
          :intro="article.creator.intro"
          :role="article.creator.role"
          :title="article.creator.title"
          :showFollow="false"
          :relationship="article.creator.relationship" />
      <article>
        <h3>{{ article.title }}</h3>
        <div class="abbr-box tags"  v-if="article.categories.length > 0">
          <span v-for="category in article.categories" :key="category.id">
            {{ category.name }}
          </span>
        </div>
        <div class="content" v-html="article.content">
        </div>
        <div class="abbr-box time-box">
          <time>发布于 {{ duration }}</time>
        </div>
      </article>
    </div>

    <div v-if="type === 0">
      <AgreePerson
          v-for="user in likers"
          :key="user.id"
          :avatar="user.avatar"
          :name="user.nickname"
          :likedAt="user.likedAt" />
    </div>
    <div v-else>
      <section class="sort" v-if="article.replyList.length > 0">
        按热度
      </section>
      <div v-if="article.replyList.length > 0">
        <Answer class="answer-item"
                v-for="reply in article.replyList"
                :articleId="article.id"
                :id="reply.id"
                :key="reply.id"
                :content="reply.content"
                :avatar="reply.replier.avatar"
                :replies="reply.replies"
                :likes="reply.likes"
                :repliedAt="reply.repliedAt"
                :isLike="reply.isLike"
                :nickname="reply.replier.nickname" />
      </div>
    </div>
    <div id="mask" >
      <wx-open-launch-app appid="wx4e61c8e6b7007cc8">
        <script type="text/wxtag-template">
          <style>.view-in-app {   margin: 0 auto;
            border-radius: 100px;
            padding: 8px 16px;
            background-color: #3EB871FF;
            color: white;
            display: inline-block;
            position: fixed;
            left: 50%;
            transform: translate(-50%, 0);
            bottom: 20px; }</style>
          <button class="view-in-app">在 App 里打开</button>
        </script>
      </wx-open-launch-app>
    </div>
  </div>
</template>

<script>
import Author from '../components/Author.vue'
import Answer from '../components/Answer.vue'
import AgreePerson from '../components/AgreePerson.vue'
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line
    Author, Answer, AgreePerson
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
      createdAt: 0,
      creator: {
        name: "加载中...",
        nickname: "加载中...",
        title: "",
        avatar: "",
        intro: "",
        role: 1,
        relationship: 0,
      },
      replyList: []
    },
    type: 1,
    likers: []
  }),
  computed: {
    likeIcon() {
      return "/img/btn_love_highlighted.png";
    },
    duration() {
      if (!this.article.createdAt) {
        return "加载中..."
      }

      let now = moment();
      let createdAt = moment(this.article.createdAt * 1000);
      let diff = moment.duration(now.diff(createdAt));
      if (diff.asDays() > 10) {
        return createdAt.format('YYYY-MM-DD')
      } else if (diff.asHours() >= 24) {
        return `${Math.floor(diff.asDays())} 天前`
      } else if (diff.asMinutes() >= 60) {
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
    axios.defaults.baseURL = "//api.knewzie.com"
    const { id } = this.$router.currentRoute.params;
    axios.post(`/topic/details`, { id })
        .then((response) => {
          const { data } = response.data
          this.article = data;
    })

    window.wx.ready(() => {
      console.log("wx ready");
    })
    window.wx.error((res) => {
      console.log("wx error");
      console.dir(res);
    })

    const timestamp = +moment();
    const appId = "wx4e61c8e6b7007cc8";
    const nonceStr = "knewzie";
    axios.post(`/config/mp/signature`,
{
        appId,
        "noncestr": nonceStr,
        "timestamp": timestamp,
        url: window.location.href
      }
    ).then((response) => {
      const { data: sign } = response.data;
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: sign,// 必填，签名
        jsApiList: ['wx-open-launch-app'], // 必填，需要使用的JS接口列表
        openTagList: ['wx-open-launch-app'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
      });

    });

  },
  methods: {
    switchToAnswer() {
      this.type = 1;
    },
    oia() {
      const { id } = this.$router.currentRoute.params;
      if(/MicroMessenger/i.test(window.navigator.userAgent)){
        alert("请在浏览器里打开")
      } else {
        window.location.assign(`zhixin:///topic/${id}`);
      }
    },
    like () {
      const { Page } = window;
      const { id } = this.$router.currentRoute.params;

      Page && Page.postMessage(
          JSON.stringify({
            "event": "showProgress"
          })
      )

      axios.post(`/user/topic/likedUser`, {topicId: id, page: 1})
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
      Page && Page.postMessage(
          JSON.stringify(
              {"event": "doShare", data: this.article}
          )
      )
    },
    report() {
      const { Page } = window;
      Page && Page.postMessage(
          JSON.stringify({
            "event": "report", data: { topicId: this.article.id }
          })
      );
    },
    invite() {
      const { Page } = window;
      if (!Page) { return; }
      Page.postMessage(
          JSON.stringify(
              {"event": "inviteUser"}
          )
      );
    },
    answer() {
      const { Page } = window;
      if (!Page) { return; }
      Page.postMessage(
          JSON.stringify(
              {"event": "doAnswer"}
          )
      );
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

article {
  color: black;
}

.content img {
  width: 100%;
}
.content video {
  width: 100%;
}

.actions .action-item {
  border-bottom: 2px solid transparent;
}

.actions .action-item.active {
  border-bottom: 2px solid #8DCE44FF;
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
  padding: 0 28px;
  align-items: center;
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

#mask .view-in-app {
  margin: 0 auto;
  border-radius: 100px;
  padding: 8px 16px;
  background-color: #3EB871FF;
  color: white;
  display: inline-block;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 20px;
}

</style>
