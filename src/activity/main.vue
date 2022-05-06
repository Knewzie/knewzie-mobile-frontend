<template>
  <div id="app">
    <div class="article">
      <img :src="this.article.imageList[0]" class="image" style="width: 100%; height: 150px">
      
      <ActivityTitle
          :id="article.creator.uid"
          :name="article.creator.nickname"
          :avatar="article.creator.avatar"
          :intro="article.creator.intro"
          :role="article.creator.role"
          :title="article.title"
          :showFollow="true"
          :relationship="article.creator.relationship"
          :duration="duration" />
      <article>
        <!-- <h3>{{ article.title }}</h3> -->
        <!-- <div class="abbr-box tags"  v-if="article.categories.length > 0">
          <span v-for="category in article.categories" :key="category.id">
            {{ category.name }}
          </span>
        </div> -->
        <!-- <div class="abbr-box time-box">
          <time> {{ duration }}</time>
          <span style="flex: 1"></span>
          <a v-on:click="report"><i class="btn-report" /></a>
        </div>         -->
        <div>
          <ActivityTime activityTime="2022-05-06 10:00:00" activityDuration="10:00-15:00"/>
          <ActivityType :isOnline="true" activityLocation="abc"/>
          <Collapse> 
            <CollapseItem title="展开详细">
              <div class="content" v-html="article.content"> </div>
            </CollapseItem>
          </Collapse>
        </div>
        <!-- <div class="content" v-html="article.content"> -->
        <!-- </div> -->
        <!-- <div class="abbr-box time-box">
          <time>发布于 {{ duration }}</time>
          <span style="flex: 1"></span>
          <a v-on:click="report"><i class="btn-report" /></a>
        </div> -->
      </article>
    </div>

    <ActivityCategory :isFree="false" :isSignup="false" :price="21.00" :id="article.id"/>
 
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
          :duration="duration"/>
      <!-- <div>
        <span class="sponsor">发起人</span>              
      </div>
      <div>
        <Avatar :avatar="avatar" :role="role" :id="id" />
      </div> -->
    </section>
    <section class="sponsor-section">
       <ActivityAuthor
        :id="article.creator.uid"
          :name="article.creator.nickname"
          :avatar="article.creator.avatar"
          :intro="article.creator.intro"
          :role="article.creator.role"
          title="参与人"
          :showFollow="true"
          :relationship="article.creator.relationship"
          :duration="duration"/>
      <!-- <div>
        <span class="sponsor">参与人</span>              
      </div>
      <div>
        <Avatar :avatar="avatar" :role="role" :id="id" />
      </div> -->
    </section>    
  

    <!-- <section class="answer-actions">
      <a class="action-item" v-on:click="invite">
        <img class="btn-prefix" src="/img/btn_answer.png" /><span>邀请回答</span>
      </a>
      <a class="action-item"
         v-on:click="answer">
        <img class="btn-prefix" src="/img/btn_answer.png" /><span>我要回答</span>
      </a>
    </section> 
    <section class="actions">
      <a class="action-item"
         v-bind:class="{ active: type === 0 }"
         style="margin-right: 32px"
         v-on:click="like">
        <img class="btn-prefix" :src="likeIcon" />
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
        v-bind:class="{ active: type == 1 }"
        >{{ article.replies }} 个回答</a>
    </section>-->

    <div v-if="type === 0">
      <AgreePerson
        v-for="user in likers"
        :key="user.id"
        :role="user.role"
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
        :replier="reply.replier.uid"
        :avatar="reply.replier.avatar"
        :role="reply.replier.role"
        :replies="reply.replies"
        :likes="reply.likes"
        :repliedAt="reply.repliedAt"
        :isLike="reply.isLike"
        :nickname="reply.replier.nickname" />
    </div>
    </div>
  </div>
</template>

<script>
import ActivityTitle from '../components/ActivityTitle.vue'
import ActivityAuthor from '../components/ActivityAuthor.vue'
import ActivityCategory from '../components/ActivityCategory.vue'
import ActivityTime from '../components/ActivityTime.vue'
import ActivityType from '../components/ActivityType.vue'
// import AgreePerson from '../components/AgreePerson.vue'
import moment from 'moment'
import axios from 'axios'
// import Avatar from '../components/Avatar.vue'
import {Collapse,CollapseItem } from  'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line
    ActivityTitle,  ActivityAuthor, ActivityCategory, ActivityTime, ActivityType, Collapse, CollapseItem
    // Answer, AgreePerson,
    // Avatar
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
      replyList: [],
      imageList: []
    },
    type: 1,
    likers: [],
    activeNames: ['1']
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
     axios.defaults.baseURL = "https://api.knewzie.com";
    const { id } = this.$router.currentRoute.params;
    const { Page } = window;
    axios.post(`/topic/details`,{ id })
        .then((response) => {
          const { data } = response.data
          this.article = data;
          Page && Page.postMessage(
            JSON.stringify(
              {"event": "topicLoaded", data}
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
    handleChange(val) {
        console.log(val);
      },
    switchToAnswer() {
      this.type = 1;
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
 color: #B3B3B3;
 font-size: 12px;
}

.time-section {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: center;
}

.time-info {
  display: inline-block;
  flex-direction: column;
  margin-left: 6px;
  color: black;
}

.time_title {
  font-size: 16px;
  font-weight: bold;
}

.sponsor-section {
  display: flex;
  flex-direction: column;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: left;
}

.sponsor{  
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

.price_title{
  color: #8DCF44;
  font-size: 18px;
  font-weight: bold;
}

.signup-action{
  display: flex;
  right: 30px;
  position:absolute;
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

</style>
