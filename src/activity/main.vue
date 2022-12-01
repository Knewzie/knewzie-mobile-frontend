<template>
  <div id="app">
    <div class="article">
      <img
        :src="this.article.imageList[0]"      
       style="width: 100%; height: 250px" 
      />
      <ActivityTitle
        :id="article && article.creator?article.creator.uid:-1"
        :name="article && article.creator?article.creator.nickname:''"
        :avatar="article && article.creator?article.creator.avatar:''"
        :intro="article && article.creator?article.creator.intro:''"
        :role="article && article.creator?article.creator.role:0"
        :relationship="article && article.creator?article.creator.relationship:0"
        :title="article?article.title:''"
        :showFollow="true"        
        :duration="duration"
        :topicId="article?article.topicId:-1"
        :showReport="true"
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
            :isFree="article.cost && article.cost !== 0? false : true"
            :isSignup="article.isApply"            
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
        :id="article && article.creator?article.creator.uid:-1"
        :name="article && article.creator?article.creator.nickname:''"
        :avatar="article && article.creator?article.creator.avatar:''"
        :intro="article && article.creator?article.creator.intro:''"
        :role="article && article.creator?article.creator.role:0"
        :relationship="article && article.creator?article.creator.relationship:0"
        title="发起人"
        :showFollow="true"        
        :duration="duration"
      />
    </section>
    <section id="sponsor-section2" class="sponsor-section2">
      <ActivityParticipant
        title="参与人"        
        :avatarArr="avatarArr" 
        :avatarNum="article?article.applyNumber:0"
      />
    </section>
    <div id="activityCategory-section" class="activityCategory-section">
      <ActivityCategory
        :isFree="article.cost && article.cost !== 0? false : true"
        :isSignup="article.isApply"
        :price="article.cost?article.cost:0"
        :id="article.id"
        :imageUrl="this.article.imageList[0]"
        :title="article.title"
        :article="article"
      />
    </div>
  </div>
</template>

<script>
import ActivityTitle from "../components/ActivityTitle.vue";
import ActivityAuthor from "../components/ActivityAuthor.vue";
import ActivityParticipant from '../components/ActivityParticipant.vue'
import ActivityCategory from "../components/ActivityCategory.vue";
import ActivityTime from "../components/ActivityTime.vue";
import ActivityType from "../components/ActivityType.vue";
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
    ActivityAuthor,
    ActivityCategory,
    ActivityTime,
    ActivityType,
    ActivityParticipant,
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
    //  axios.defaults.baseURL = "https://api.knewzie.com";
    const { id } = this.$router.currentRoute.params;
    console.log("ID====" + id);
    const { Page } = window;
    let list = [];
    axios.post(`/activity/applyList`,{ "activityId": id , "page":1 })
    .then((response) => {
      list = response.data.data.list;
      axios.post(`/activity/detail`,{ "id": id })
      .then( (response)=>{
        this.article = response.data.data;
        this.article.applyList = list;
        this.article.applyNumber = list.length;
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
  height: 50px;
  width: 100%;
  position: absolute;
  margin-top: 10px;
  bottom: 10px;
  z-index: 10;
}

.activityCategory-section2 {
  height: 50px;
  width: 100%;
  position: fixed;
  margin-top: 10px;
  bottom: 10px;
  z-index: 10;
}


.sponsor-section {
  display: flex;
  flex-direction: column;
  background: white;
  margin-top: 10px;
  /* margin-bottom: 10px; */
  padding: 7px 28px;
  align-items: left;
}

.sponsor-section2 {
  display: flex;
  flex-direction: column;
  background: white;
  margin-top: 10px;
  margin-bottom: 50px;
  padding: 7px 28px;
  align-items: left;
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
  padding:  0px 20px 10px 20px;
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
