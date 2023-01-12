<template>
  <div id="app">
    <div class="topBar">
      <div class="topLogo"><img class="logo" src="/img/logo.png" /></div>
      <div class="topBtn">
        <a v-on:click="oia"><span class="topBtnText">打开App</span></a>
      </div>
    </div>
    <div class="article">
      <!-- <Author
        :id="article.creator.uid"
        :name="article.creator.nickname"
        :avatar="article.creator.avatar"
        :intro="article.creator.intro"
        :role="article.creator.role"
        :title="article.creator.title"
        :showFollow="false"
        :relationship="article.creator.relationship"
      /> -->
      <article>
        <div class="article-title">{{ article.title }}</div>

        <EventAuthor
          :id="article && article.creator ? article.creator.uid : -1"
          :name="article && article.creator ? article.creator.nickname : ''"
          :avatar="article && article.creator ? article.creator.avatar : ''"
          :showFollow="true"
          :role="article && article.creator ? article.creator.role : 0"
          :relationship="
            article && article.creator ? article.creator.relationship : 0
          "
          @onClickCall="oia"
        ></EventAuthor>
        <!-- <el-image
          v-for="(img, index) in article.imageList"
          :src="img"
          :key="img + index"
          fit="fit"
        ></el-image> -->
        <div class="content article-content" v-html="article.content"></div>
        <div class="likesDiv">
          <div class="likesItem">
            <img src="../images/bx-eye-show.png" alt="" /> {{ article.pv }}
          </div>
          <div class="likesItem">
            <img src="../images/bx-heart2.png" alt="" /> {{ article.likes }}
          </div>
          <div class="likesTime">{{ formatDate(article.createdAt) }}</div>
        </div>
        <div v-if="article.officialGuideUserList" class="suggestion">
          <div class="suggestionTitle">推荐</div>
          <div
            class="suggestionContent"
            v-for="(item, index) in article.officialGuideUserList"
            :key="item + index"
          >
            <div class="sCleft">
              <img class="sCTimg" :src="item.avatar" alt="" srcset="" />
              <div>
                <div class="sCname">
                  {{ item.nickname }}
                  <img
                    class="sCimg"
                    v-if="item.role == 1 || item.role == 2"
                    src="../images/sign.png"
                    alt=""
                    srcset=""
                  />
                  <img
                    class="sCimg"
                    v-if="item.role == 4"
                    src="../images/sign4.png"
                    alt=""
                    srcset=""
                  />
                  <img
                    class="sCimg"
                    v-if="item.role == 5"
                    src="../images/sign5.png"
                    alt=""
                    srcset=""
                  />
                  <img
                    class="sCimg"
                    v-if="item.role == 6"
                    src="../images/sign6.png"
                    alt=""
                    srcset=""
                  />
                </div>
                <div class="sCtitle">
                  {{ item.topicCount ? item.topicCount : "暂无简介" }}
                </div>
              </div>
            </div>

            <div v-on:click="dialogVisible = true">
              <button type="submit" class="sCButton">私信</button>
            </div>
          </div>
        </div>
      </article>
    </div>
    <div class="article-intro"></div>

    <div v-if="type === 0">
      <AgreePerson
        v-for="user in likers"
        :key="user.id"
        :avatar="user.avatar"
        :name="user.nickname"
        :likedAt="user.likedAt"
      />
    </div>
    <div v-else>
      <section class="sort" v-if="article.replyList.length > 0">按热度</section>
      <div v-if="article.replyList.length > 0">
        <Answer
          class="answer-item"
          v-for="reply in article.replyList"
          :articleId="article.id"
          :id="reply.id"
          :key="reply.id"
          :content="reply.content"
          :replier="reply.replier.uid"
          :avatar="reply.replier.avatar"
          :role="reply.replier.role"
          :replies="reply.replies"
          :likes="reply.likes"
          :repliedAt="reply.repliedAt"
          :isLike="reply.isLike"
          :nickname="reply.replier.nickname"
        />
      </div>
    </div>
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
                background-color: #6599FF;
                color: white;
                border: none;
                font-size: 14px;
                width: 180px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .logo-app-open {
              width: 70px;
            }
          </style>
          <button class="view-in-app"><img class="logo-app-open" src="https://h5.thewavingapp.com/img/logo.png" /><span>App内打开</span></button>
        </script>
      </wx-open-launch-app>
    </div>
    <ToDialog :show="dialogVisible" @submit="gotoDownload" />
  </div>
</template>

<script>
import ToDialog from "../components/ToDialog.vue";
import EventAuthor from "../components/EventAuthor.vue";
import Author from "../components/Author.vue";
import Answer from "../components/Answer.vue";
import AgreePerson from "../components/AgreePerson.vue";
import moment from "moment";
import axios from "axios";
import HtmlFilter from 'html-filter';

export default {
  name: "App",
  components: {
    // eslint-disable-next-line
    Author,
    Answer,
    AgreePerson,
    EventAuthor,
    ToDialog,
  },
  data: () => ({
    article: {
      id: -1,
      title: "加载中...",
      content: "加载中...",
      categories: [],
      likes: 0,
      replies: 0,
      pv: 0,
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
      imageList: [],
      replyList: [],
    },
    type: 1,
    wxReady: false,
    likers: [],
    dialogVisible: false,
  }),
  computed: {
    launchAppUrl() {
      const { id } = this.$router.currentRoute.params;
      return `/topic/${id}`;
    },
    topicId() {
      const { id } = this.$router.currentRoute.params;
      return id;
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
  },
  created() {
    // axios.defaults.baseURL = "//api.knewzie.com";
    axios.defaults.baseURL = "https://api.knewzie.com";

    const { wx } = window;

    const timestamp = moment().unix();
    const appId = "wxd6fe3b0d4e0030ac";
    const nonceStr = "knewzie";
    const { id } = this.$router.currentRoute.params;

    axios
      .post(`/topic/details`, { id })
      .then((response) => {
        const { data } = response.data;
        this.article = data;
        setTimeout(function () {
          let image = document.querySelector("img");
          console.log(image);
        }, 100);
      })
      .then(() => {
        let params = {
          appId,
          noncestr: nonceStr,
          timestamp: timestamp,
          url: window.location.href,
        };
        // alert(JSON.stringify(params));
        return axios.post(`/config/mp/signature`, params);
      })
      .then((response) => {
        const { data: sign } = response.data;
        const htmlFilter = new HtmlFilter();
        var filterContent = htmlFilter.filter(this.article.content);
        // alert(sign);
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: sign, // 必填，签名
          jsApiList: [
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareQZone",
          ], // 必填，需要使用的JS接口列表
          openTagList: ["wx-open-launch-app"], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
        });

        wx.error(function (res) {
          alert(JSON.stringify(res));
        });

        wx.ready(() => {
          this.wxReady = true;
          let imgUrlThis = "https://h5.knewzie.com/img/icon.jpeg";
          if (this.article.imageList && this.article.imageList.length > 0) {
            imgUrlThis = this.article.imageList[0];
          }

          //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
          wx.updateTimelineShareData({
            title: this.article.title,
            desc: filterContent, // 分享描述
            link: window.location.href,
            // imgUrl: "https://h5.knewzie.com/img/icon.jpeg",
            imgUrl: imgUrlThis,
            success: function () {},
          });

          //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
          wx.updateAppMessageShareData({
            title: this.article.title, // 分享标题
            desc: filterContent, // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrlThis, // 分享图标
            success: () => {
            }
          });
          
        });
      });
  },
  methods: {
    formatDate(time, format = "YY-MM-DD hh:mm:ss") {
      var date = new Date(time * 1000);
      var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
      var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return "0" + index;
      });
      // 开个长度为10的数组 格式为 00 01 02 03

      var newTime = format
        .replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

      return newTime;
    },
    switchToAnswer() {
      this.type = 1;
    },
    oia() {
      const { id } = this.$router.currentRoute.params;
      if (/MicroMessenger/i.test(window.navigator.userAgent)) {
        alert("请在浏览器里打开");
      } else {
        window.location.assign(`zhixin:///topic/${id}`);
      }
    },
    launchApp() {},
    launchError(err) {
      alert(JSON.stringify(err.detail));
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
    share() {
      const { Page } = window;
      Page &&
        Page.postMessage(
          JSON.stringify({ event: "doShare", data: this.article })
        );
    },
    report() {
      const { Page } = window;
      Page &&
        Page.postMessage(
          JSON.stringify({
            event: "report",
            data: { topicId: this.article.id },
          })
        );
    },
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
    gotoDownload(e) {
      if (e) {
        this.$emit("onClickCall");
        this.download();
      }
      this.dialogVisible = false;
    },
    download() {
      var ua = navigator.userAgent;
      //  var appVer = navigator.appVersion;
      // console.log('appver='+appVer);
      var url = `https://play.google.com/store/apps/details?id=com.dazhixinany.know`;
      var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isIOS) {
        url = `https://apps.apple.com/nz/app/%E7%AD%94%E7%9F%A5%E6%96%B0/id1551768968`;
      }
      var isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1;
      if (isAndroid) {
        var isHuawei = ua.toLowerCase().match(/huawei/i) == "huawei";
        if (isHuawei) {
          url = `https://appgallery.cloud.huawei.com/ag/n/app/C104495637?locale=zh_CN&source=appshare&subsource=C104495637&shareTo=com.android.bluetooth&shareFrom=appmarket`;
        }
      }
      window.location.href = url;
    },

    filterStr(str) {
      var re = /<[^>]+>/gi;
      str = str.replace(re, '');
      return str;
    }
  },
};
</script>

<style>
.topBar {
  background-color: #6599ff;
  height: 60px;
  width: 100%;
  position: fixed;
  z-index: 10;
}

.topLogo {
  top: 6px;
  left: 17px;
  position: absolute;
}

.logo {
  width: 100px;
  object-fit: cover;
  pointer-events: visible;
}

.topBtn {
  border-radius: 100px;
  padding: 4px 12px;
  background-color: white;
  position: absolute;
  top: 15px;
  right: 28px;
}

.topBtnText {
  font-family: SourceHan Sans CN-Medium;
  font-size: 14px;
  font-weight: 400;
  color: #59a1ff;
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
  max-width: 100%;
  height: auto;
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

.view-in-app {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

<style scoped>
h3 {
  margin: 0;
}

.sort {
  padding: 12px 28px;
  color: #b3b3b3;
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
  top: 60px;
  position: relative;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.answer-item {
  margin-top: 16px;
}

.answer-item:first-child {
  margin: 0;
}
/* new clas */
.article-title {
  padding: 30px 18px 10px 18px;
  color: #051a37;
  font-size: 20px;
  font-weight: 600;
}

.logo-app-open {
  width: 70px;
}
/* lin */
.article-content {
  margin-top: 10px;
  padding: 0px 18px 10px 18px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #6a7292;
}
.el-image {
  display: flex;
  justify-content: center;
  width: 90%;
  height: 90%;
  margin: 15px auto;
  border-radius: 20px;
}
.likesDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 90%;
  margin: 15px auto;
  padding-bottom: 15px;
}
.likesItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.likesItem img {
  width: 20px;
  height: 20px;
}
.likesTime {
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.05em;
  text-align: right;
  font-size: 11px;
  color: #6a7292;
}
.suggestion {
  width: 90%;
  height: 90%;
  margin: 20px auto;
}
.suggestionTitle {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
}
.suggestionContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 15px;
}
.sCleft {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.sCTimg {
  border-radius: 50%;
  margin-right: 12px;
  width: 40px;
  height: 40px;
}
.sCButton {
  border-radius: 8px;
  padding: 4px 8px 4px 8px;
  border: 1px solid rgba(7, 100, 223, 1);
  background-color: #ffffff;
  color: #0764df;
}
.sCname {
  height: 19px;
  margin-bottom: 5px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 400;
  color: #051a37;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sCimg {
  width: 40px;
  height: 40px;
  margin: 0px;
  padding: 0px;
}
.sCtitle {
  font-size: 13px;
  font-weight: 400;
  color: #6a7292;
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 1;
  overflow: hidden;
}
img {
  object-fit: cover;
}
</style>
