<template>
  <div id="app">
    <div class="topBar">
      <div class="topLogo"><img class="logo" src="/img/logo.png" /></div>
      <div class="topBtn">
        <a v-on:click="download"><span class="topBtnText">下载App</span></a>
      </div>
    </div>
    <div class="video_content">
      <div class="video-container">
        <img
          src="../../images/play-on.png"
          class="video-control-btn"
          id="play_icon"
          @mouseover="playOver"
          @click="playIcon"
        />
        <img
          src="../../images/play-off.png"
          id="pause_icon"
          @mouseover="pauseOver"
          @click="pauseIcon"
        />
        <video
          class="video"
          id="myVideo"
          @mouseover="videoOver"
          @mouseout="videoOut"
          @click="myVideo"
          :src="article.videoList[0]"
          playsinline
        />
        <!-- autoplay="autoplay" -->
      </div>

      <Article
        :avatar="article.creator.avatar"
        :nickname="article.creator.nickname"
        :pv="article.pv"
        :likes="article.likes"
        :title="article.title"
        :replies="article.replies"
        @onClickCall="download"
      />
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
          <button class="view-in-app"><img class="logo-app-open" src="https://h5.knewzie.com/img/logo.png" /><span>App内打开</span></button>
        </script>
      </wx-open-launch-app>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Article from "../../components/ShowVideo.vue";
// import Avatar from "../../components/Avatar.vue";
export default {
  name: "ShowImage",
  components: { Article },

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
      // imageList: [],
      videoList: [],
      extend: {
        videoThumbnail: "",
      },
      replyList: [],
    },
    type: 1,
    likers: [],
  }),

  computed: {
    launchAppUrl() {
      const { id } = this.$router.currentRoute.params;
      return `/show/video/${id}`;
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
  methods: {
    switchToAnswer() {
      this.type = 1;
    },

    switchToLike() {
      const { Page } = window;
      const { id } = this.$router.currentRoute.params;
      this.type = 0;

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
    oia() {
      const { id } = this.$router.currentRoute.params;
      if (/MicroMessenger/i.test(window.navigator.userAgent)) {
        alert("请在浏览器里打开");
      } else {
        window.location.assign(`zhixin:///topic/${id}`);
      }
    },
    launchApp() {},
    launchError() {
      // alert(err.detail.errMsg);
      this.oia();
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
      setTimeout(() => {
        window.location.href = url; //没有页面链接，2秒后跳转ios下载链接
      }, 2000);
    },
    video() {
      var playIcon = document.getElementById("play_icon");
      var pauseIcon = document.getElementById("pause_icon");
      console.log(pauseIcon.style.display);
      if (pauseIcon.style.display == "none" || pauseIcon.style.display == "") {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        // pauseIcon.style.opacity = 1;
      } else {
        pauseIcon.style.display = "none";
        playIcon.style.display = "block";
      }
    },
    playIcon() {
      document.getElementById("myVideo").play();
      var playIcon = document.getElementById("play_icon");
      var pauseIcon = document.getElementById("pause_icon");
      pauseIcon.style.display = "block";
      playIcon.style.display = "none";
    },
    myVideo() {
      document.getElementById("myVideo").pause();
      var playIcon = document.getElementById("play_icon");
      // var pauseIcon = document.getElementById("pause_icon");
      // pauseIcon.style.display = "none";
      playIcon.style.display = "block";
    },
    pauseIcon() {
      document.getElementById("myVideo").pause();
      var playIcon = document.getElementById("play_icon");
      var pauseIcon = document.getElementById("pause_icon");
      pauseIcon.style.display = "none";
      playIcon.style.display = "block";
    },
    videoOver() {
      // var myVideo = document.getElementById("myVideo");
      // myVideo.controls = "controls";
      var playIcon = document.getElementById("play_icon");
      var pauseIcon = document.getElementById("pause_icon");
      if (pauseIcon.style.display == "block") {
        // pauseIcon.style.opacity = 1;
      }
      if (playIcon.style.display == "block") {
        // playIcon.style.opacity = 1;
      }
    },
    pauseOver() {
      // var myVideo = document.getElementById("myVideo");
      // myVideo.controls = "controls";
      var pauseIcon = document.getElementById("pause_icon");
      if (pauseIcon.style.display == "block") {
        // pauseIcon.style.opacity = 1;
      }
    },
    videoOut() {
      // var myVideo = document.getElementById("myVideo");
      // myVideo.controls = false;
      var playIcon = document.getElementById("play_icon");
      var pauseIcon = document.getElementById("pause_icon");
      if (pauseIcon.style.display == "block") {
        // pauseIcon.style.opacity = 0;
      }
      if (playIcon.style.display == "block") {
        // playIcon.style.opacity = 0;
      }
    },
    playOver() {
      // var myVideo = document.getElementById("myVideo");
      // myVideo.controls = "controls";
      var playIcon = document.getElementById("play_icon");
      if (playIcon.style.display == "block") {
        // playIcon.style.opacity = 1;
      }
    },
    gotoDownload() {
      this.$emit("onClickCall");
      this.dialogVisible = false;
    },
  },

  created() {
    axios.defaults.baseURL = "https://api.knewzie.com";

    const { wx } = window;

    wx.error(function (res) {
      alert(JSON.stringify(res));
    });

    wx.ready(() => {
      this.wxReady = true;

      let imgUrlThis = "https://h5.knewzie.com/img/icon.jpeg";
      if (this.article.extend && this.article.extend.videoThumbnail) {
        imgUrlThis = this.article.extend.videoThumbnail;
      }

      wx.onMenuShareAppMessage({
        title: this.article.title,
        desc: `${this.article.replies} 人回答, ${this.article.pv} 人查看`,
        link: window.location.href,
        // imgUrl: "https://h5.knewzie.com/img/icon.jpeg",
        imgUrl: imgUrlThis,
        success: function () {},
      });

      wx.onMenuShareTimeline({
        title: this.article.title,
        link: window.location.href,
        // imgUrl: "https://h5.knewzie.com/img/icon.jpeg",
        imgUrl: imgUrlThis,
        success: function () {},
      });
    });

    const timestamp = moment().unix();
    const appId = "wxd6fe3b0d4e0030ac";
    const nonceStr = "knewzie";
    const { id } = this.$router.currentRoute.params;

    axios
      .post(`/topic/details`, { id })
      .then((response) => {
        const { data } = response.data;
        this.article = data;
      })
      .then(() =>
        axios.post(`/config/mp/signature`, {
          appId,
          noncestr: nonceStr,
          timestamp: timestamp,
          url: window.location.href,
        })
      )
      .then((response) => {
        const { data: sign } = response.data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
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
      });
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

.topBtnTextImage {
  font-family: SourceHan Sans CN-Medium;
  font-size: 14px;
  font-weight: 400;
  color: #59a1ff;
}
/* 以上为头部 */
</style>

<style scoped>
.article {
  background: white;
  top: 60px;
  position: relative;
}

article {
  color: black;
  padding: 14px 18px;
}
.video-container {
  position: relative;
  text-align: center;
  background: black;
}
.video-control-btn {
  object-fit: cover;
}
.video {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 100%;
}

/* 播放图标 */
#play_icon {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10vw;
  margin-left: -10vw;
  width: 20vw;
  height: 20vw;
  z-index: 3;
  border-radius: 50%;
  opacity: 0.8;
}
#play_icon:hover {
  cursor: pointer;
  -webkit-filter: drop-shadow(0px 0px 10px white);
}
/* 暂停图标 */
#pause_icon {
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  /* top: 285px;
  left: 160px;
  width: 60px;
  height: 58px; */
  z-index: 3;
  border-radius: 50%;
  opacity: 0;
}
#pause_icon:hover {
  cursor: pointer;
  -webkit-filter: drop-shadow(0px 0px 5px white);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* // 播放按钮 */
video::-webkit-media-controls-play-button {
  display: none !important;
}
/* // 当前播放时间 */
video::-webkit-media-controls-current-time-display {
  display: none !important;
}
/* // 剩余时间 */
video::-webkit-media-controls-time-remaining-display {
  display: none !important;
}
/* // 音量按钮 */
video::-webkit-media-controls-volume-control-container {
  display: none !important;
}
/* // 全屏 */
video::-webkit-media-controls-fullscreen-button {
  display: none !important;
}
/* // 时间轴 */
video::-webkit-media-controls-timeline {
  display: none !important;
}
/* // 更多选项 */
#myVideo::-internal-media-controls-overflow-menu-list {
  display: none !important;
}

#myVideo::-internal-media-controls-button-panel {
  display: none !important;
}
#myVideo::-internal-media-controls-overflow-button {
  display: none !important;
}

.view-in-app {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
