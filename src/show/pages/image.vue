<template>
  <div id="app">
    <div class="topBarImage">
      <div class="topLogoImage"><img class="logo" src="/img/logo.png" /></div>
      <div class="topBtnImage">
        <a v-on:click="download"><span class="topBtnTextImage">打开App</span></a>
      </div>
    </div>
    <div class="article">
      <article>
        <Author
          :id="article.creator.uid"
          :name="article.creator.nickname"
          :avatar="article.creator.avatar"
          :intro="article.creator.intro"
          :role="article.creator.role"
          :title="article.creator.title"
          :showFollow="false"
          :dialog="true"
          :relationship="article.creator.relationship"
        />
        <!--  -->
        <Carousel
          height="416px"
          indicatorPosition="outside"
          :autoplay="false"
          arrow="always"
        >
          <CarouselItem v-for="image in article.imageList" :key="image">
            <el-image
              className="image"
              style="height: 100%"
              :src="image"
              fit="cover"
            ></el-image>
          </CarouselItem>
        </Carousel>
        <el-row class="companies">
          <el-col :span="12"
            ><div style="visibility: hidden">隐藏</div>
          </el-col>
          <el-col :span="12">
            <div class="fIcon">
              <div class="fIcon_item">
                <img src="../../images/bx-eye-show.png" />11k
              </div>
              <div class="fIcon_item">
                <img src="../../images/bx-heart2.png" />2k
              </div>
              <div class="fIcon_item">
                <img src="../../images/bx-comment.png" />123
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="address">
          <img src="../../images/bx-map.png" />
          <span>Spaceship, Hastings, Gisborne</span>
        </div>
        <span class="imageTitle">{{ article.title }}</span>
        <div class="abbr-box tags" v-if="article.categories.length > 0">
          <span v-for="category in article.categories" :key="category.id">
            {{ category.name }}
          </span>
        </div>
        <div class="contenthtml">{{ article.content }}</div>
        <Waterfall
          :id="article.creator.uid"
          :name="article.creator.nickname"
          :avatar="article.creator.avatar"
          :intro="article.creator.intro"
          :role="article.creator.role"
          :title="article.creator.title"
          :showFollow="false"
          :dialog="true"
          :relationship="article.creator.relationship"
        />
      </article>
    </div>

    <section class="actions">
      <a
        class="action-item"
        v-bind:class="{ active: type === 0 }"
        style="margin-right: 32px"
        v-on:click="switchToLike"
      >
        <img class="btn-prefix" src="/img/btn_love_highlighted.png" />
        <span>{{ article.likes }}</span>
      </a>
      <div class="space" />
      <a
        class="action-item"
        v-on:click="switchToAnswer"
        v-bind:class="{ active: type === 1 }"
        >{{ article.replies }} 评论</a
      >
    </section>

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
      <div class="answer-item" v-if="article.replyList.length > 0">
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
          <button class="view-in-app"><img class="logo-app-open" src="https://h5.knewzie.com/img/logo.png" /><span>App内打开</span></button>
        </script>
      </wx-open-launch-app>
    </div>
  </div>
</template>

<script>
import Waterfall from "../../components/Waterfall.vue";
import Author from "../../components/ShowImageAuthor.vue";
import Answer from "../../components/Answer.vue";
// import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import "swiper/css/bundle";
import axios from "axios";
import moment from "moment";

import { Carousel, CarouselItem } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default {
  name: "ShowImage",
  components: {
    // Swiper,
    // SwiperSlide,
    Waterfall,
    Author,
    Answer,
    Carousel,
    CarouselItem,
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
      imageList: [],
      videoList: [],
      replyList: [],
    },
    type: 1,
    likers: [],
  }),

  computed: {
    launchAppUrl() {
      const { id } = this.$router.currentRoute.params;
      return `/show/image/${id}`;
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
      if (this.article.imageList && this.article.imageList.length > 0) {
        imgUrlThis = this.article.imageList[0];
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
        console.log(JSON.stringify(data));
        var obj = {
          id: 13919,
          type: 4,
          title: "Federal Delicatessen又获奖啦！奥克兰必尝的鸡肉三明治🥪",
          content:
            "Federal Delicatessen今年再次当选奥克兰标志性菜肴提名Auckland Iconic Eats👉🏻必尝的鸡肉三明治你一定不能错过！快来探索Federal的美味佳肴吧🤩",
          contentStruct: null,
          imageList: [
            "https://img.knewzie.com/image/11708/1670383817090.png",
            "https://img.knewzie.com/image/11708/1670383817090.png",
          ],
          videoList: [],
          extend: {
            videoThumbnail: null,
            activityStartAt: null,
            activityAddress: null,
            activityApplyPrice: null,
            activityApplyTotal: null,
            activityCover: null,
            assetDataVO: { imageWidth: 1080, imageHigh: 1080 },
            officialGuideUserList: null,
          },
          categories: [],
          issues: [
            {
              id: 395,
              name: "获奖",
              icon: "https://img.knewzie.com/image/917/79b1520b-2d4a-4a1e-8aac-0fc0cb5a9cec.png",
              desc: "暂时没有简介",
              categories: [],
              creator: null,
              createdAt: 1670378066,
              replyCount: null,
              pvCount: null,
            },
            {
              id: 301,
              name: "探店",
              icon: "https://img.knewzie.com/image/917/79b1520b-2d4a-4a1e-8aac-0fc0cb5a9cec.png",
              desc: "暂时没有简介",
              categories: [],
              creator: null,
              createdAt: 1669687031,
              replyCount: null,
              pvCount: null,
            },
            {
              id: 67,
              name: "美食",
              icon: "https://img.knewzie.com/image/917/79b1520b-2d4a-4a1e-8aac-0fc0cb5a9cec.png",
              desc: "暂时没有简介",
              categories: [],
              creator: null,
              createdAt: 1646033225,
              replyCount: null,
              pvCount: null,
            },
            {
              id: 32,
              name: "奥克兰",
              icon: "https://img.knewzie.com/image/917/79b1520b-2d4a-4a1e-8aac-0fc0cb5a9cec.png",
              desc: "暂时没有简介",
              categories: [],
              creator: null,
              createdAt: 1644998418,
              replyCount: null,
              pvCount: null,
            },
          ],
          likes: 0,
          replies: 0,
          creator: {
            uid: 11708,
            role: 2,
            relationship: 0,
            name: "",
            nickname: "SkyCity天空城",
            title: "天空城娱乐集团",
            avatar:
              "https://knewzie.s3.ap-southeast-2.amazonaws.com/image/11708/1669770919973.png",
            intro: "",
            level: 1,
            experience: 80,
            integral: 10,
            medals: [
              {
                id: 12,
                name: "金色浪花",
                nameEn: null,
                icon: "https://img.knewzie.com/image/899/a1c5d343-7400-44a2-a90d-6a7f4a346b0e.png",
                condition: null,
                description:
                  "“金色浪花”，不只是一个特别设计的徽章，更是去浪App平台上首批用户身份的象征。其中灌注着平台创立初期的辛劳与汗水，同时融聚了小浪花们的信任与支持。拥有它即代表拥有了无上的特权：从参与平台抽奖到享受品牌优惠，从线上优先推送到线下抢先入场，没有“享”不到。该徽章限量发行，过后不补。",
                descriptionEn: null,
                createdAt: 1670459876,
                userHad: false,
              },
              {
                id: 4,
                name: "深度认可",
                nameEn: null,
                icon: "https://img.knewzie.com/image/899/072fc409-6468-4246-9576-c98ff39d76de.png",
                condition: null,
                description: "深度认可其他用户",
                descriptionEn: null,
                createdAt: 1670294082,
                userHad: true,
              },
              {
                id: 8,
                name: "声名大噪",
                nameEn: null,
                icon: "https://img.knewzie.com/image/899/c9ae63b6-aad4-4efc-8d6d-a0c6b5518be3.png",
                condition: null,
                description: "你远近驰名啊！",
                descriptionEn: null,
                createdAt: 1670200415,
                userHad: false,
              },
              {
                id: 9,
                name: "享有盛誉",
                nameEn: null,
                icon: "https://img.knewzie.com/image/899/15d048f0-48a4-4119-9127-63f9860d861f.png",
                condition: null,
                description: "你的名声真好！感谢你的付出",
                descriptionEn: null,
                createdAt: 1670200415,
                userHad: false,
              },
            ],
            birthday: "",
            ageRange: "",
            gender: 0,
            followersCount: 45,
            followingCount: 1,
            topicCount: null,
            likedCategories: [],
            platforms: null,
            location: "",
            email: "",
            createdAt: 1652155310,
            updatedAt: 1669770939,
            deletedAt: 0,
          },
          createdAt: 1670383955,
          replyList: [],
          isLike: false,
          isCollect: false,
          pv: 460,
          latitude: "-36.848917258903384",
          longitude: "174.76255958899856",
          locationName:
            "86 Federal Street, Auckland City, Auckland 1010, New Zealand",
          anonymous: null,
          officialGuideUserList: null,
          startedAt: 0,
          expiredAt: 4070908800,
        };
        this.article = obj;
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
body {
  margin: 0;
  -webkit-touch-callout: none;
  padding-bottom: env(safe-area-inset-bottom);
  background: #f6f6f6;
}

.view-in-app {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>

<style scoped>
.topBarImage {
  background-color: #6599FF;
  height: 60px;
  width: 100%;
  position: fixed;
  z-index: 10;
}

.topLogoImage {
  top: 6px;
  left: 17px;
  position: absolute;
}

.logoImage {
  width: 100px;
  object-fit: cover;
  pointer-events: visible;
}

.topBtnImage {
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
  color: #59A1FF;
}
/* 以上为头部 */
.article {
  background: white;
  top: 60px;
  position: relative;
}

.body {
  background: white;
  padding: 16px 0;
}

.slider {
  height: 400px;
}

.slider img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}

article {
  color: black;
  padding: 14px 18px;
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
.abbr-box {
  display: flex;
}

.actions {
  display: flex;
  background: white;
  margin: 10px 0;
  padding: 0px 28px;
  align-items: center;
}

.space {
  flex: 1;
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

.space {
  flex: 1;
}

.actions > * {
  color: #3c3c3e;
  font-size: 14px;
  font-weight: bold;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-carousel__item img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
.contenthtml {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #6a7292;
}
.imageTitle {
  margin-top: 8px;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  color: #051a37;
}
/* 走马灯改样式 */
::v-deep .el-carousel__container {
  overflow: hidden;
  border-radius: 20px;
}
::v-deep .el-carousel__button {
  background: #adbbce;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

::v-deep .el-carousel__indicators--horizontal {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 5px;
  left: -1px;
}
::v-deep .el-carousel__indicators--outside .is-active .el-carousel__button {
  background: #5d9ff8;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
/* 一键三连 */
.companies {
  margin-top: -25px;
}
.fIcon {
  display: flex;
  justify-content: space-between;
}
.fIcon_item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fIcon img {
  width: 20px;
  height: 20px;
}
/* 地址 */
.address {
  margin: 9px 1px;
  display: flex;
  align-items: center;
  justify-items: center;
}
.address img {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}
.address span {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #6a7292;
}
</style>
