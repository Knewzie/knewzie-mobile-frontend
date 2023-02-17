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

          <WaveCollapse :text="article.content" :textNumber="120" ></WaveCollapse>  

          <div class="section-title">到达指引</div>  
          <WaveCollapse :text="article.route" :textNumber="120" ></WaveCollapse>  

          <div class="section-title">注意事项</div>
          <WaveCollapse :text="article.memo" :textNumber="120" ></WaveCollapse> 

          <div class="issue-tag-box">
            <div class="issue-tag-item" v-for="(item,index) in article.issueList" :key="index">
              {{item.name.replaceAll("#","")}}
            </div>
          </div>

          <!-- 天气 -->
          <div class="section-title">天气</div>
          <Tabs v-model="weaherTabName" :stretch="true" :before-leave="weaherTabBeforeClick">
            <TabPane label="下面24个小时" name="first">
              <WaveWeather :weathers24h="weather.weathers24h"></WaveWeather>
            </TabPane>
            <TabPane label="5日天气预报" name="second" ></TabPane>
          </Tabs>

          <!-- 步道提示信息 -->
          <div v-if="alertList.length > 0" class="alert-box">
            <div style="display: flex;align-items: center;"> 
              <img src="/img/bxs-error.svg" style="width: 15px;height: 15px"/>
              <span style="color: #E63761;font-size: 13px;font-weight: 600">Seasonal restrictions</span>
            </div>
            <div v-for="(item,index) in alertList" :key="index">
              <span style="color: #051A37" v-html="item.description"></span>
            </div>
          </div>
          
          <!-- 与TA相关 -->
          <div style="margin-top: 20px;"></div>
          <Tabs v-model="otherTabName" :stretch="true" :before-leave="otherTabBeforeClick">
            <TabPane label="与TA相关" name="first">
              <OtherTrackShowWaterfall
                :list="otherTopics"
              />
              <!-- <WaveWeather :weathers24h="weather.weathers24h"></WaveWeather> -->
            </TabPane>
            <TabPane label="类似步道" name="second" ></TabPane>
          </Tabs>
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
import {Tabs,TabPane} from "element-ui";
import WaveWeather from "../components/WaveWeather.vue";
import OtherTrackShowWaterfall from "../components/OtherTrackShowWaterfall.vue";

export default {
  name: "App",
  components: {
    // eslint-disable-next-line
    TrackTitle,
    OtherTrackShowWaterfall,
    TrackTags,
    WaveMultiImage,
    ToDialog,
    WaveCollapse,
    Tabs,
    TabPane,
    WaveWeather
    // Collapse,
    // CollapseItem,
    // Answer, AgreePerson,
    // Avatar
  },
  data: () => ({
    article: {
      "id": -1,
      "type": "",
      "name": "",
      "status": "",
      "region": "",
      "assetId": "",
      "latitude": "",
      "longitude": "",
      "place": "",
      "logo": "",
      "length": "",
      "timeCost": "",
      "difficulty": "",
      "weight": 0,
      "dog": 0,
      "imageList": [
      ],
      "content": "",
      "route": "",
      "memo": "",
      "categories": [
      ],
      "issueList": [
      ],
      "isLike": false,
      "isCheckin": false
    },
    weather: {
      temp : "",
      icon : "",
      weatherImageAssets : "",
      weathers24h:[]
    },
    alertList:[],
    otherTopics: [],
    weaherTabName: 'first',
    otherTabName: "first",
    dialogVisible: false,
    
  }),
  computed: {
    launchAppUrl() {
      const { id } = this.$router.currentRoute.params;
      return `/activity/${id}`;
    },
    likeIcon() {
      return "/img/btn_love_highlighted.png";
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
      .post(`/doc/detail`, {type: "tracks", assetId: id })
      .then((response) => {
        this.article = response.data.data;
        this.loadWeatherData();
        this.loadAlertData();
        this.loadOtherTracksData();
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
    weaherTabBeforeClick(tabName) {
      if (tabName == "second") {
        this.dialogVisible = true;
        return false;
      }
      return true;
    },
    otherTabBeforeClick(tabName) {
      if (tabName == "second") {
        this.dialogVisible = true;
        return false;
      }
      return true;
    },
    /// 加载天气数据
    async loadWeatherData() {
      const QWEARHER_KEY = "72f83bc9b1954073a17afd78a711dd01";
      const location = this.article.longitude + "," + this.article.latitude
      let response = await axios.get(`https://devapi.qweather.com/v7/weather/now?key=${QWEARHER_KEY}&location=${location}&lang=zh-hans`);

      var data = response.data;
      var now = data["now"];
      
      this.weather.temp = now["temp"] + "°";
      this.weather.icon = now["icon"] ;
      
      
      this.weather.weatherImageAssets = this.getIconByCode(this.weather.icon);

      this.weather.weathers24h.push({
        temp:this.weather.temp,
        tempMax:'',
        tempMin: '',
        icon: this.weather.weatherImageAssets
      });
      
      var response24h = await axios.get(`https://devapi.qweather.com/v7/weather/24h?key=${QWEARHER_KEY}&location=${location}&lang=zh-hans`);
      var hourly = response24h.data['hourly'];
      for(var n = 0; n < hourly.length; n++){
        var iconH = this.getIconByCode(hourly[n]["icon"]);
        var tempH = hourly[n]['temp'] + "°";
        this.weather.weathers24h.push({
          temp: tempH,
          tempMax:'',
          tempMin: '',
          icon: iconH
        });
      }
      
    },

    /// 加载提示信息
    async loadAlertData()  {
      var dataJson = {
        "page": 1,
        "type": "tracks",
        "assetId": this.article.assetId
      };

      try {
        
        var response = await axios.post(`/doc/alert`, dataJson);
        this.alertList = response.data.data.list;
        
      // eslint-disable-next-line no-empty
      } catch (e) {
        
      } 
    },

    /// 加载Other步道
    async loadOtherTracksData()  {
      let names = this.article.issueList.map(item => (item.name));
      var dataJson = {
        "page": 1,
        "type": 4,
        "names": names
      };

      try {
        
        var response = await axios.post(`/issue/topic`, dataJson);
        this.otherTopics = response.data.data.list;
        this.otherTopics.push(this.otherTopics[0]);
      // eslint-disable-next-line no-empty
      } catch (e) {
        
      } 
    },

    toAmPmTime(value){
      var arr = value.split(":");
      try{
        var hour = parseInt(arr[0]);
        var res = "";
        if (hour > 12) {
          res = (hour - 12).toString() + ":" + arr[1] + " PM";
        } else {
          res = hour.toString() + ":" + arr[1] + " AM";
        }
        return res;
      }catch (e){
        return "00:00 AM";
      }
    },
    getIconByCode(icon) {
      if (icon.startsWith("4")) return "/img/ic_snowy.png";
      if (icon.startsWith("5")) return "/img/ic_windy.png";

      var res = "";
      switch (icon) {
        case '100': //晴
        case '150': //晴-夜
          res = "/img/ic_sunny.png";
          break;
        case '101': //多云
        case '104': //阴
        case '151': //多云-夜
          res = "/img/ic_cloudy.png";
          break;
        case '102': //	少云
        case '103': //晴间多云
        case '152': //少云-夜
        case '153': //晴间多云-夜
          res = "/img/ic_partly_cloudy.png";
          break;
        case '300': //阵雨
        case '301': //强阵雨
        case '305': //小雨
        case '306': //中雨
        case '307': //大雨
        case '308': //极端降雨
        case '309': //细雨
        case '310': //暴雨
        case '311': //大暴雨
        case '312': //特大暴雨
        case '313': //冻雨
        case '314': //小到中雨
        case '315': //中到大雨
        case '316': //大到暴雨
        case '317': //暴雨到大暴雨
        case '318': //大暴雨到特大暴雨
        case '350': //阵雨
        case '351': //强阵雨
        case '399': //雨
          res = "/img/ic_rainny.png";
          break;
        case '302': //雷阵雨
        case '303': //强雷阵雨
        case '304': //雷阵雨伴有冰雹
          res = "/img/ic_thunder.png";
          break;
        default:
          res = "/img/ic_cloudy.png";
          break;
      }
      return res;
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
.issue-tag-box{
  display: flex;
  margin-top: 10px;
}
.issue-tag-item {
  color: #ADBBCE;
  border: 1px solid #ADBBCE;
  padding: 5px 10px;
  border-radius: 20px;
  margin-right: 5px;
}

.alert-box{
  margin-top: 20px;
  padding: 10px 20px;
  background: rgba(229, 55, 97, 0.1);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}
</style>
