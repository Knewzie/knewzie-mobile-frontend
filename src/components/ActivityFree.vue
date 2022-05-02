<template>
    <div class="signup-section">
        <div>
           <span class="price_title">免费活动</span>
        </div>
        <div class="signup-action">
           <div><img class="share" src="/img/share.png" /></div>&nbsp;
           <div>
               <a class="action-item" v-on:click="sign_up_now">
                   <img class="sign_up_now" src="/img/sign_up_now.png" />
                </a>
            </div>
        </div>      
    </div>
</template>

<script>

export default {
  name: 'ActivityFree',
   components: {
  },
  props: {
    id: Number,
    name: String,
    avatar: String,
    intro: String,
    showFollow: Boolean,
    role: Number,
    title: String,
    relationship: Number,
    duration: String,
  },
  data() {
      return {
          currentRelationship: this.relationship,
          loading: false,
      }
  },
  watch: {
      relationship(newV) {
          this.currentRelationship = newV;
      }
  },
  computed: {

  },
  methods: {
      sign_up_now() {
      const { Page } = window;
      if (!Page) { return; }
      Page.postMessage(
        JSON.stringify(
          {"event": "doSignUpNow",data: { activityId: this.article.id }}
        )
      );
    },
      report() {
      const { Page } = window;
      Page && Page.postMessage(
        JSON.stringify({
          "event": "report", data: { topicId: this.article.id }
        })
      );
    },
  }
}
</script>

<style>
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

.share{
  object-fit: cover; 
  width: 30px;
  height: 30px;
}

.action-item {
  padding: 7px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign_up_now{
  object-fit: cover; 
  width: 100%;
  height: 30px;
}
</style>