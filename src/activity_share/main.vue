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
        :src="this.article.imageList && this.article.imageList.length > 0?this.article.imageList[0]:''"
        style="width: 100%; height: 250px" 
      />
      <div class="article-content">
        <EventTags 
          :id="article && article.creator?article.creator.uid:-1"
          :weight="article && article.weight?article.weight:0"
          :pv="article && article.pv?article.pv:0"
          :endAt="article && article.endAt?article.endAt:0"
          :planNumber="article && article.planNumber?article.planNumber:0"
          :applyNumber="article && article.applyNumber?article.applyNumber:0"
        ></EventTags>
        <ActivityTitle
          :id="article && article.creator?article.creator.uid:-1"
          :name="article && article.creator?article.creator.nickname:''"
          :avatar="article && article.creator?article.creator.avatar:''"
          :intro="article && article.creator?article.creator.intro:''"
          :role="article && article.creator?article.creator.role:0"
          :relationship="article && article.creator?article.creator.relationship:0"
          :title="article?article.title:''"
          :showFollow="true"        
          :topicId="article?article.topicId:-1"
          :showReport="false"
        />
        <EventAuthor
          :id="article && article.creator?article.creator.uid:-1"
          :name="article && article.creator?article.creator.nickname:''"
          :avatar="article && article.creator?article.creator.avatar:''"
          :showFollow="true"
          :role="article && article.creator?article.creator.role:0"
          :relationship="article && article.creator?article.creator.relationship:0"
          @onClickCall="oia"
        ></EventAuthor>
        <article>
          <div class="section-title">基础资料</div>
          <div class="line-box">
            <ActivityTime
              :activityTime="article.startAt"
              :activityDuration="article.endAt"
            />
          </div>
          <div class="line-box">
            <ActivityType
              :isOnline="article.addressType === 1 ? true : false"
              :isFree="article.cost && article.cost !== 0? false : true"
              :isSignup="article.isApply"
              :activityLocation='article.addressDetail'
            />
          </div>

          <!-- <Collapse>
            <CollapseItem title="展开详细"> -->
          <div class="section-title">活动详情</div>
          <WaveMultiImage @onClickCall="oia" class="multi-image-wrapper" :mediaList="article.imageList"></WaveMultiImage>
          <div class="content event-detail" v-html="article.content"></div>
          <!-- </CollapseItem>
          </Collapse> -->
          <div class="section-title">活动组织者</div>
          <EventAuthorDetail
            :id="article && article.creator?article.creator.uid:-1"
            :name="article && article.creator?article.creator.nickname:''"
            :avatar="article && article.creator?article.creator.avatar:''"
            :followersCount="article && article.creator?article.creator.followersCount: 0"
            @onClickCall="oia"
          ></EventAuthorDetail>
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
          <button class="view-in-app"><img class="logo-app-open" src="https://h5.knewzie.com/img/logo.png" /><span>App内打开</span></button>
        </script>
      </wx-open-launch-app>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      center
      :show-close="false"
      custom-class="dialog-class"
      >
      <div slot="header" style="padding: 0px;"></div>
      <span>是否打开去浪APP？</span>
      <span  class="dialog-button-group">
        <!-- <el-button-group> -->
        <el-button style="color: gray;" type="text" @click="dialogVisible = false">取 消</el-button>
        <el-button type="text" @click="dialogVisible = false">确 定</el-button>
        <!-- </el-button-group> -->
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ActivityTitle from "../components/ActivityTitle.vue";
// import ActivityAuthor from "../components/ActivityAuthor.vue";
// import ActivityParticipant from '../components/ActivityParticipant.vue'
// import ActivityCategory from "../components/ActivityCategory.vue";
import ActivityTime from "../components/ActivityTime.vue";
import ActivityType from "../components/ActivityType.vue";
import EventTags from "../components/EventTags.vue"
import EventAuthor from "../components/EventAuthor.vue";
import EventAuthorDetail from "../components/EventAuthorDetail.vue";
import WaveMultiImage from "../components/WaveMultiImage.vue";
import moment from "moment";
import axios from "axios";
// import Avatar from '../components/Avatar.vue'
// import { Collapse, CollapseItem } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default {
  name: "App",
  components: {
    // eslint-disable-next-line
    ActivityTitle,
    // ActivityAuthor,
    // ActivityCategory,
    ActivityTime,
    ActivityType,
    // ActivityParticipant,
    EventTags,
    EventAuthor,
    EventAuthorDetail,
    WaveMultiImage
    // Collapse,
    // CollapseItem,
    // Answer, AgreePerson,
    // Avatar
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
        followersCount: 0
      },
      imageList: [],
      isApply: false,
      applyList: [],
    },
    dialogVisible: false
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
    avatarArr(){
      if(this.article && !this.article.applyList){
        return [];
      }
      //获取到applyList
      const {applyList} = this.article
      //准备二维数组
      const arr = [];
      let minArr = [];
      //遍历applyList
      applyList.forEach(avatar => {
        //如果小数组满了，创建一个新的小数组（所以上面创建minArr不用const而是用let）
        if(minArr.length === 6){
            minArr = [];
        }
        //如果minArr是空的,将小数组保存到大数组中
        if(minArr.length === 0){
            arr.push(minArr)
        }
        //将当前分类数据保存到小数组中
        minArr.push(avatar)
      });
      return arr;
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
    // let list = [];
    // let list = [{uid:11498,role:1,relationship: 0,nickname:"小抄1",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:21498,role:1,relationship: 0,nickname:"小抄2",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:31498,role:1,relationship: 0,nickname:"小抄3",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:41498,role:1,relationship: 0,nickname:"小抄4",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:51498,role:1,relationship: 0,nickname:"小抄5",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:61498,role:1,relationship: 0,nickname:"小抄6",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:71498,role:1,relationship: 0,nickname:"小抄7",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:81498,role:1,relationship: 0,nickname:"小抄8",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:91498,role:1,relationship: 0,nickname:"小抄9",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"},
    //   {uid:101498,role:1,relationship: 0,nickname:"小抄10",avatar:"https://img.knewzie.com/image/admin/352b89d6-010b-41f7-b288-ef1991547482.gif"}];    

    // axios.post(`/activity/applyList`,{ "activityId": id , "page":1 })
    // .then((response)=>{
    //     list = response.data.data.list;
    //     this.article = response.data.data;        
    //     return  axios.post(`/v2/activity/detail`,{ "id": id });
    //   })
      
    axios.post(`/v2/activity/detail`,{ "id": id }).then((response)=>{
        this.article = response.data.data;
        if (response.data.data.creator.followersCount == null) {
          this.article.creator.followersCount = 0;
        }
        // this.article.applyList = list;
        // this.article.applyNumber = list.length;
        // console.log(this.article,'article-2');
      }) .then(() => {
        let params = {
          appId,
          noncestr: nonceStr,
          timestamp: timestamp,
          url: window.location.href,
        };
        // alert(JSON.stringify(params));
        return axios.post(`/config/mp/signature`, params)
      })
      .then((response) => {
        const { data: sign } = response.data;
        // alert(sign);
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
      })

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
};
</script>

<style>
.topBar {
  background-color: #6599FF;
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
  color: #59A1FF;
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

.participant-section{
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
}

.article-content{
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  top: -30px;
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
  color: #051A37;
  font-weight: 600;
  font-size: 16px;
  margin-top: 25px;
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
.el-dialog__header{
  padding: 0px !important;
}
.dialog-button-group{
  display: flex;
  justify-content: space-around;
}

</style>
