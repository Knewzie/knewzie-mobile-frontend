<template>
  <div id="app">
    <div class="topBar">
      <div class="topLogo"><img class="logo" src="/img/logo.png" /></div>
      <div class="topBtn">
        <a v-on:click="download"><span class="topBtnText">下载App</span></a>
      </div>
    </div>
    <div class="article">
      <img
        :src="this.article.imageList[0]"
        class="image"
        style="width: 100%; height: 150px"
      />

      <ActivityTitle
        :id="article.creator.uid"
        :name="article.creator.nickname"
        :avatar="article.creator.avatar"
        :intro="article.creator.intro"
        :role="article.creator.role"
        :title="article.title"
        :showFollow="true"
        :relationship="article.creator.relationship"
        :duration="duration"
      />
      <article>
        <div class="line-box">
          <ActivityTime
            :activityTime="article.startAt"
            :activityDuration="article.endAt"
          />
        </div>
        <div class="line-box">
          <ActivityType
            :isOnline="article.addressType === 1 ? true : false"
            :activityLocation='article.addressDetail'
          />
        </div>

        <!-- <Collapse>
          <CollapseItem title="展开详细"> -->
        <div class="content" v-html="article.content"></div>
        <!-- </CollapseItem>
        </Collapse> -->
      </article>
    </div>
    <section class="sponsor-section">
      <ActivityAuthor
        :id="article.creator.uid"
        :name="article.creator.nickname"
        :avatar="article.creator.avatar"
        :intro="article.creator.intro"
        :role="article.creator.role"
        title="发起人"
        :showFollow="true"
        :relationship="article.creator.relationship"
        :duration="duration"
      />
    </section>
    <section class="sponsor-section">
      <div>
        <span class="sponsor">参与人</span>              
      </div>
      <div>
        <span v-for="user in article.applyList" :key="user.uid">
          <Avatar   :avatar="user.avatar" :role="user.role" :id="user.uid" />
          <div><span class="certificate-info">{{ user.nickname }}</span></div>
        </span>
     </div>
    </section>
    <div id="mask">
      <wx-open-launch-app
        class="view-in-app"
        v-on:launch="launchApp"
        v-on:error="launchError"
        appid="wx4e61c8e6b7007cc8"
        :extinfo="launchAppUrl"
      >
        <script type="text/wxtag-template">
          <style>
            .view-in-app {
              border-radius: 100px;
              padding: 8px 16px;
              background-color: #3EB871;
              color: white;
              border: none;
              font-size: 14px;
            }
          </style>
          <button class="view-in-app">App内查看</button>
        </script>
      </wx-open-launch-app>
    </div>
    <div id="activityCategory-section" class="activityCategory-section">
      <!-- <ActivityCategory
        :isFree="article.cost && article.cost !== 0? false : true"
        :isSignup="article.isApply"
        :price="article.cost?article.cost:0"
        :id="article.id"
      /> -->
    </div>
  </div>
</template>

<script>
import ActivityTitle from "../components/ActivityTitle.vue";
import ActivityAuthor from "../components/ActivityAuthor.vue";
// import ActivityCategory from "../components/ActivityCategory.vue";
import ActivityTime from "../components/ActivityTime.vue";
import ActivityType from "../components/ActivityType.vue";
// import AgreePerson from '../components/AgreePerson.vue'
import moment from "moment";
import axios from "axios";
import Avatar from '../components/Avatar.vue'
// import { Collapse, CollapseItem } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default {
  name: "App",
  components: {
    // eslint-disable-next-line
    ActivityTitle,
    ActivityAuthor,
    // ActivityCategory,
    ActivityTime,
    ActivityType,
    // Collapse,
    // CollapseItem,
    // Answer, AgreePerson,
    Avatar
  },
  data: () => ({
    article: {
      id: -1,
      topicId: -1,
      title: "加载中...",
      content: "加载中...",
      startAt: 0,
      endAt: 0,
      applyStartAt: 0,
      applyEndAt: 0,
      planNumber: 0,
      applyNumber: 0,
      cost: 0,
      addressType: 0,
      addressDetail: "加载中...",
      extend: null,
      creator: {
        uid: -1,
        name: "加载中...",
        nickname: "加载中...",
        title: "",
        avatar: "",
        intro: "",
        role: 1,
        relationship: 0,
      },
      imageList: [],
      isApply: false,
      applyList: [],
    },
    // type: 1,
    // likers: [],
    // activeNames: ['1']
  }),
  computed: {
    launchAppUrl() {
      const { id } = this.$router.currentRoute.params;
      return `/activity/${id}`;
    },
    likeIcon() {
      return "/img/btn_love_highlighted.png";
    },
    duration() {
      if (!this.article.createdAt) {
        return "加载中...";
      }

      let now = moment();
      let createdAt = moment(this.article.createdAt * 1000);
      let diff = moment.duration(now.diff(createdAt));
      if (diff.asDays() > 10) {
        return createdAt.format("YYYY-MM-DD");
      } else if (diff.asHours() >= 24) {
        return `${Math.floor(diff.asDays())} 天前`;
      } else if (diff.asMinutes() >= 60) {
        return `${Math.floor(diff.asHours())} 小时前`;
      } else if (diff.asSeconds() >= 60) {
        return `${Math.floor(diff.asMinutes())} 分钟前`;
      } else if (diff.asSeconds() > 0) {
        return `${Math.floor(diff.asSeconds())} 秒前`;
      } else {
        return "刚刚";
      }
    },
    activityTime(){
      if (!this.article.startAt) {
        return "加载中...";
      }     
      let _startAt = moment(this.article.startAt * 1000);
      _startAt = _startAt.format("YYYY-MM-DD HH:mm:ss");      
      console.log(_startAt,'time');     
      return _startAt;
    }
  },
  created() {
    axios.defaults.baseURL = "https://api.knewzie.com";
    const { id } = this.$router.currentRoute.params;
    const { Page } = window;
    let list =[];
    // axios
    //   .post(`/activity/detail`, { id })
    axios.post(`/activity/applyList`,{ "activityId": id , "page":1 })
    .then((response) => {
      list = response.data.data.list;
      axios.post(`/activity/detail`,{ "id": id })
      .then( (response)=>{
        this.article = response.data.data;
        this.article.applyList = list;
        const { data } = this.article;
        Page &&
          Page.postMessage(JSON.stringify({ event: "activityLoaded", data }))
      })
      .finally(() => {
        Page && Page.postMessage(JSON.stringify({ event: "pageMounted" }));
      });
    });
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    switchToAnswer() {
      this.type = 1;
    },
    oia() {
      const { id } = this.$router.currentRoute.params;
      if (/MicroMessenger/i.test(window.navigator.userAgent)) {
        alert("请在浏览器里打开");
      } else {
        window.location.assign(`zhixin:///activity/${id}`);
      }
    },
    launchApp() {},
    launchError() {
      // alert(err.detail.errMsg);
      this.oia();
    },
    like() {
      const { Page } = window;
      const { id } = this.$router.currentRoute.params;

      Page &&
        Page.postMessage(
          JSON.stringify({
            event: "showProgress",
          })
        );

      axios
        .post(`/user/topic/likedUser`, { topicId: id, page: 1 })
        .then((response) => {
          const { data } = response.data;
          const { list } = data;
          this.likers = list;
          this.type = 0;
        })
        .finally(() => {
          Page &&
            Page.postMessage(
              JSON.stringify({
                event: "dismissProgress",
              })
            );
        });
    },
    // share() {
    //   const { Page } = window;
    //    Page && Page.postMessage(
    //     JSON.stringify(
    //       {"event": "doShare", data: this.article}
    //     )
    //   )
    // },
    // report() {
    //   const { Page } = window;
    //   Page && Page.postMessage(
    //     JSON.stringify({
    //       "event": "report", data: { id: this.article.id }
    //     })
    //   );
    // },
    invite() {
      const { Page } = window;
      if (!Page) {
        return;
      }
      Page.postMessage(JSON.stringify({ event: "inviteUser" }));
    },
    answer() {
      const { Page } = window;
      if (!Page) {
        return;
      }
      Page.postMessage(JSON.stringify({ event: "doAnswer" }));
    },
    // sign_up_now() {
    //   alert('sign_up_now goto doSignUpNow')
    //   const { Page } = window;
    //   if (!Page) { return; }
    //   Page.postMessage(
    //     JSON.stringify(
    //       {"event": "doSignUpNow", data: { id: this.article.id }}
    //     )
    //   );
    // }
    handleScroll() {
      //定义handleScroll事件函数
      let section = document.getElementById("activityCategory-section");
      //let wholeScrollHeight = document.documentElement.scrollHeight; // 能够滚动的总高度
      //let visiableHeight = document.documentElement.clientHeight; // 可视区域高度
      let currentOffset = document.documentElement.scrollTop; // 滚动的距离
      if (currentOffset === null || currentOffset === "undefined") {
        currentOffset = document.body.scrollTop;
      }

      if (currentOffset > 10 && currentOffset < 1500) {
        section.classList.add("activityCategory-section2");
      } else if (currentOffset > 1500) {
        section.classList.add("activityCategory-section2");
      } else {
        section.classList.remove("activityCategory-section2");
      }
    },
  },
};
</script>

<style>
.topBar {
  background-image: url("@/images/bg.png");
  background-size: cover;
  height: 60px;
  width: 100%;
  position: fixed;
  z-index: 10;
}
.topLogo {
  top: 10px;
  left: 30px;
  position: absolute;
}

.logo {
  width: 100px;
  object-fit: cover;
  pointer-events: visible;
}

.topBtn {
  border-radius: 100px;
  padding: 4px 8px;
  background-color: white;
  position: absolute;
  top: 12px;
  right: 20px;
}

.topBtnText {
  font-family: SourceHan Sans CN-Medium;
  font-size: 14px;
  font-weight: 500;
  color: #8dce44;
}

body {
  margin: 0;
  -webkit-touch-callout: none;
  padding-bottom: env(safe-area-inset-bottom);
  background: #f6f6f6;
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
  border-bottom: 2px solid #8dce44ff;
}

.content .ql-video {
  width: 100%;
}

.content a {
  color: #8dce44ff;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

a {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0.6);
}
</style>

<style scoped>
/* .btn-report {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url("@/images/ic_report.png");
  background-size: contain;
} */

h3 {
  margin: 0;
}

.sort {
  padding: 12px 28px;
  color: #b3b3b3;
  font-size: 12px;
}

.activityCategory-section {
  height: 60px;
  width: 100%;
  position: absolute;
  bottom: 10px;
  z-index: 10;
}

.activityCategory-section2 {
  height: 60px;
  width: 100%;
  position: fixed;
  margin-top: 10px;
  bottom: 0px;
  z-index: 10;
}

.sponsor-section {
  display: flex;
  flex-direction: column;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: left;
}

.sponsor {
  font-size: 16px;
  font-weight: bold;
}

.signup-section {
  display: flex;
  height: 40px;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: left;
}

.price_title {
  color: #8dcf44;
  font-size: 18px;
  font-weight: bold;
}

.signup-action {
  display: flex;
  right: 30px;
  position: absolute;
}

/* .share{
  object-fit: cover; 
  width: 30px;
  height: 30px;
} */

/* .sign_up_now{
  object-fit: cover; 
  width: 100%;
  height: 30px;
} */

.answer-actions {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: center;
}

.answer-actions > * {
  flex: 1;
  color: #3c3c3e;
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
  flex: 1;
}

.actions > * {
  color: #3c3c3e;
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
  background: #d0d0d0;
  padding: 1px 8px;
  border-radius: 10px;
  margin-left: 5px;
  font-size: 10px;
  color: #8d8d8e;
}

.tags span:first-child {
  margin: 0px;
}

.time-box {
  margin: 7px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 60%);
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

.line-box {
  /* padding: 16px 18px; */
  display: flex;
  flex-direction: column;
  align-items: left;
  border-bottom: 1px solid #e6e6e7;
}
</style>
