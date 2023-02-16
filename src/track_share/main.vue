<template>
  <div id="app">
    <div class="topBar">
      <div class="topLogo"><img class="logo" src="/img/logo.png" /></div>
      <div class="topBtn">
        <a v-on:click="download"><span class="topBtnText">打开App</span></a>
      </div>
    </div>
    <!-- 封面图、标题、详情内容 -->
    <div class="article">
      <img
        :src="this.article.logo"
        style="width: 100%; height: auto"
      />
      <div class="article-content">
        <TrackTags
          :id="article && article.creator ? article.creator.uid : -1"
          :weight="article && article.weight ? article.weight : 0"
          :difficulty="article && article.difficulty ? article.difficulty : ''"
          :dog="article && article.dog ? article.dog : 1"
        ></TrackTags>
        <TrackTitle
          :title="article ? article.name : ''"
        />
        <article>
          <div class="section-title">基础信息</div>
          <div class="line-box">
            <div class="line-item-box" >
              <img class="line-item-box-img" src="/img/bx-map-alt.svg" />
              单程 {{article.length}}
            </div>

            <div class="line-item-box" >
              <img class="line-item-box-img" src="/img/bx-time-five.svg" />
             {{timeTitle}}
            </div>
            
            <div class="line-item-box" >
              <img class="line-item-box-img" src="/img/bx-line-chart.svg" />
             {{difficultyTitle}}
            </div>

            <div class="line-item-box" >
              <img class="line-item-box-img" src="/img/bxs-dog.svg" />
             {{dogTitle}}
            </div>

            <div class="line-item-box" >
              <img class="line-item-box-img" src="/img/ic_map.svg" />
             {{article.place}}
            </div>
          </div>
          <div class="section-title">步道详情</div>  
          
          <WaveMultiImage
            @onClickCall="dialogVisible = true"
            class="multi-image-wrapper"
            :mediaList="article.imageList"
          ></WaveMultiImage>
          <!-- <Collapse>
            <CollapseItem title="展开详细"> -->
          <WaveCollapse :text="article.content" :textNumber="120" >
            <template v-slot:default="{ clickToggle, expanded }">
              <button @click="clickToggle" class="btn">
                {{ expanded ? "收起" : "展开" }}
              </button>
            </template>
          </WaveCollapse>  
          <!-- <div class="content event-detail" v-html="article.content"></div> -->
            <!-- </CollapseItem>
          </Collapse> -->
          
        </article>
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
import TrackTitle from "../components/TrackTitle.vue";
// import ActivityAuthor from "../components/ActivityAuthor.vue";
// import ActivityParticipant from '../components/ActivityParticipant.vue'
// import ActivityCategory from "../components/ActivityCategory.vue";
import TrackTags from "../components/TrackTags.vue";
import WaveMultiImage from "../components/WaveMultiImage.vue";
import WaveCollapse from "../components/WaveCollapse.vue";
import moment from "moment";
import axios from "axios";
import ToDialog from "../components/ToDialog.vue";
// import { Collapse, CollapseItem } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import HtmlFilter from 'html-filter';

export default {
  name: "App",
  components: {
    // eslint-disable-next-line
    TrackTitle,
    // ActivityAuthor,
    // ActivityCategory,
    // ActivityParticipant,
    TrackTags,
    WaveMultiImage,
    ToDialog,
    WaveCollapse
    // Collapse,
    // CollapseItem,
    // Answer, AgreePerson,
    // Avatar
  },
  data: () => ({
      article: {
        "id": 15424854,
        "type": "tracks",
        "name": "Auckland Domain",
        "status": "OPEN",
        "region": "Auckland",
        "assetId": "WALLtracks20230211083827162",
        "latitude": "-36.85876783914864",
        "longitude": "174.77549655362964",
        "place": "20 Park Road, Grafton",
        "logo": "https://img.knewzie.com/image/899/2f029de5-8308-445d-a7f6-3058df77ef27.jpeg",
        "length": "500 m ",
        "timeCost": "0_1",
        "difficulty": "advanced",
        "weight": 20,
        "dog": 1,
        "imageList": [
            "https://img.knewzie.com/image/899/4662784c-0ca9-4939-a39a-f59e2779129c.jpeg",
            "https://img.knewzie.com/image/899/07b4c8fc-347a-404d-b693-a817f14409a9.jpg",
            "https://img.knewzie.com/image/899/128301d8-95c7-4317-94ae-bbd2bf8f2814.jpeg",
            "https://img.knewzie.com/image/899/6622666c-9b02-4de3-bc58-43c7fb89c5fe.jpeg",
            "https://img.knewzie.com/image/899/1d97b653-be16-45c4-a015-b3a691c3d072.jpeg"
        ],
        "content": "<p class=\"p1\"><span class=\"s1\">Auckland Domain</span>是我们Auckland最古老的公园，也是最大的公园之一。它是在一座死火山, 当时火山活动产生并形成一个天然的圆形剧场。这里可以放风筝、喂鸭子、遛娃遛狗、走过原生森林或沿着户外雕塑的小路走，奥克兰博物馆也在里面，还有很大的玻璃房植物园。累了还有cafe。</p>",
        "route": "<p class=\"p1\">从Park Road, Grafton Road and Titoki St 多个入口可进入，或者地图搜索：<span class=\"s1\">Auckland Domain/ Auckland Museum.</span></p>",
        "memo": "<ul class=\"ul1\">\n<li class=\"li1\">Smokefree</li>\n<li class=\"li2\">使用提供的垃圾桶来处理你的垃圾。如果没有垃圾箱，离开时请带走所有垃圾和回收物。</li>\n<li class=\"li2\">行人通道 - 24小时</li>\n<li class=\"li2\">机动车停车场 - 本区有10个机动车停车场。三个在冬季花园外，两个在The Crescent的尽头，一个在Kiosk路的尽头，四个在博物馆前面。</li>\n</ul>",
        "categories": [
            {
                "id": 107,
                "name": "AKL周边最Top步道",
                "nameEn": null,
                "icon": "",
                "sort": 1,
                "isFollow": null
            },
            {
                "id": 108,
                "name": "遛狗步道",
                "nameEn": null,
                "icon": "",
                "sort": 5,
                "isFollow": null
            },
            {
                "id": 109,
                "name": "遛娃步道",
                "nameEn": null,
                "icon": "",
                "sort": 2,
                "isFollow": null
            }
        ],
        "issueList": [
            {
                "id": 853,
                "name": "auckland_museum",
                "icon": "https://img.knewzie.com/image/899/ba75c72c-923a-4349-87df-b888e839ed34.png",
                "desc": "暂时还没有简介",
                "categories": null,
                "creator": null,
                "createdAt": 1676104737,
                "replyCount": null,
                "pvCount": null,
                "userCount": null
            },
            {
                "id": 852,
                "name": "auckland_domain",
                "icon": "https://img.knewzie.com/image/899/ba75c72c-923a-4349-87df-b888e839ed34.png",
                "desc": "暂时还没有简介",
                "categories": null,
                "creator": null,
                "createdAt": 1676104727,
                "replyCount": null,
                "pvCount": null,
                "userCount": null
            }
        ],
        "isLike": false,
        "isCheckin": false
      },
    // article: {
    //   id: -1,
    //   topicId: -1,
    //   title: "加载中...",
    //   content: "加载中...",
    //   startAt: 0,
    //   endAt: 0,
    //   applyStartAt: 0,
    //   applyEndAt: 0,
    //   planNumber: 0,
    //   applyNumber: 0,
    //   cost: 0,
    //   addressType: 0,
    //   addressDetail: "加载中...",
    //   extend: null,
    //   creator: {
    //     uid: -1,
    //     name: "加载中...",
    //     nickname: "加载中...",
    //     title: "",
    //     avatar: "",
    //     intro: "",
    //     role: 1,
    //     relationship: 0,
    //     followersCount: 0,
    //   },
    //   imageList: [],
    //   isApply: false,
    //   applyList: [],
    // },
    dialogVisible: false,
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
    
    avatarArr() {
      if (this.article && !this.article.applyList) {
        return [];
      }
      //获取到applyList
      const { applyList } = this.article;
      //准备二维数组
      const arr = [];
      let minArr = [];
      //遍历applyList
      applyList.forEach((avatar) => {
        //如果小数组满了，创建一个新的小数组（所以上面创建minArr不用const而是用let）
        if (minArr.length === 6) {
          minArr = [];
        }
        //如果minArr是空的,将小数组保存到大数组中
        if (minArr.length === 0) {
          arr.push(minArr);
        }
        //将当前分类数据保存到小数组中
        minArr.push(avatar);
      });
      return arr;
    },
    timeTitle() {
      if (this.article.timeCost == "0_1") {
          return "一小时以下";
      }else if (this.article.timeCost == "1_4") {
          return "1-4小时";
      }else if (this.article.timeCost == "4_24") {
          return "4小时以上";
      }else if (this.article.timeCost == "24") {
          return "白天徒步";
      }else if (this.article.timeCost == "24s") {
          return "几天";
      }
      return "";
    },

    difficultyTitle() {
      if (this.article.difficulty == "easy") {
          return "简单";
      }else if (this.article.difficulty == "intermediate") {
          return "一般";
      }else if (this.article.difficulty == "advanced") {
          return "有挑战性";
      }else if (this.article.difficulty == "expert") {
          return "专家";
      }
      return "";
    },
    dogTitle() {
      if (this.article.dog == 1) {
          return "允许带狗";
      }
      return "不允许带狗";
    }
  },
  created() {
    axios.defaults.baseURL = "https://api.knewzie.com";
    const { id } = this.$router.currentRoute.params;
    // const { Page } = window;
    const { wx } = window;
    const timestamp = moment().unix();
    const appId = "wxd6fe3b0d4e0030ac";
    const nonceStr = "knewzie";

    axios
      .post(`/v2/activity/detail`, { id: id })
      .then(() => {
        // this.article = response.data.data;
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

        let imgUrlThis = "https://h5.knewzie.com/img/icon.jpeg";
        if (this.article.logo) {
          imgUrlThis = this.article.logo;
        }        

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

        wx.ready(() => {
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
      console.log("oia ....." + id);
      if (/MicroMessenger/i.test(window.navigator.userAgent)) {
        alert("请在浏览器里打开");
      } else {
        window.location.assign(`waving:///activity/${id}`);
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
      // setTimeout(() => {
      //   window.location.href = url; //没有页面链接，2秒后跳转ios下载链接
      // }, 2000);
    },
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
  margin-top: 10px;
  bottom: 1px;
  z-index: 10;
}

.activityCategory-section2 {
  height: 60px;
  width: 100%;
  position: fixed;
  margin-top: 10px;
  /* bottom: 10px; */
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

.participant-section {
  display: flex;
  flex-direction: column;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: left;
}

.participant {
  font-size: 16px;
  font-weight: bold;
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
  padding-top: 60px;
}

.article-content {
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  top: -24px;
  position: relative;
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
  padding: 0px 20px 10px 20px;
}

.answer-item {
  margin-top: 16px;
}

.answer-item:first-child {
  margin: 0;
}

.section-title {
  color: #051a37;
  font-weight: 600;
  font-size: 16px;
  margin-top: 20px;
}

.line-box {
  /* padding: 16px 18px; */
  display: flex;
  flex-direction: column;
  align-items: left;
  /* border-bottom: 1px solid #e6e6e7; */
}
.multi-image-wrapper {
  margin-top: 10px;
}
.event-detail {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #616575;
  white-space: pre-wrap;
}

.dialog-class {
  border-radius: 10px;
}
.el-dialog__header {
  padding: 0px !important;
}
.dialog-button-group {
  display: flex;
  justify-content: space-around;
}

.line-item-box {
  padding: 5px 0px;
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
  background: white;
  margin-top: 10px;
  align-items: flex-start;
  font-weight: 400;
  font-size: 14px;
  color: #616575;
}

.line-item-box-img {
  width: 14px;
  margin-right: 5px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
