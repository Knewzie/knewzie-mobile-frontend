<template>
     <div :class="isSignup?'signup-section2':'signup-section'">
        <div class="signup_title" v-if="isSignup">           
           <span :class="isSignup?'price_title2':'price_title'">已经报名</span>
        </div>
        <div class="signup_title" v-else>           
           <div v-if="isFree"><span :class="isFree?'price_title':'price_title2'">免费活动</span></div>
           <div v-else><span class="price_title">报名费用</span><br/>
           <span class="price_title">${{this.price}}</span></div>
        </div>
        <div class="signup-action">
          <div class="action-item" v-if="isSignup"> 
            <div class="shareBtn">
              <a v-on:click="share">
                <span class="shareBtnText">立即分享</span>
              </a>
            </div>   
          </div>
          <div class="action-item" v-else>
            <a v-on:click="share">
              <img class="share" src="/img/share.png" /> 
            </a> 
            <a v-on:click="sign_up_now">
              <img class="sign_up_now" src="/img/sign_up_now.png" />
            </a>
          </div>           
        </div>      
    </div>
</template>

<script>

export default {
  name: 'ActivityCategory',
  components: {
  },
  props: {
    id: Number,
    isSignup: Boolean,
    isFree: Boolean,
    price: Number,
    imageUrl: String,
    title: String,
    article: Object,
  },
  data() {
      return {
          currentIsSignup: this.isSignup,
          currentIsFree: this.isFree,
      }
  },
  watch: {
      
  },
  computed: {
    displayTitle() {
      if (this.IsSignup) {
        if(this.IsFree){
          return `<span class="price_title">免费活动</span>`
        }else{
          return `<span class="price_title2">已经报名</span>`
        }        
      } else {
        if(this.IsFree){
          return `<span class="price_title">免费活动</span>`
        }else{
          return `<span class="price_title">报名费用</span></br><span class="price_title">$${this.price}</span>`
        }   
      }
    },
    displayAction(){
      if (this.IsSignup) {
          return `<div class="shareBtn"><a v-on:click="share">
                   <span class="shareBtnText"/>立即分享</span>
                </a></div>`           
      } else {
          return `<a v-on:click="sign_up_now">
                   <img class="sign_up_now" src="/img/sign_up_now.png" />
                </a>`        
      }      
    }

  },
  methods: {
    share() {
      const { Page } = window;
       Page && Page.postMessage(
        JSON.stringify(
          {"event": "doShare", data: this.article}
        )
      )
    },
    sign_up_now() {
      // alert('sign_up_now goto doSignUpNow id:'+this.id)
      const { Page } = window;
      if (!Page) { return; }
      Page.postMessage(
        JSON.stringify(
          {"event": "doSignUpNow", data: { id: this.id ,imageUrl:this.imageUrl,title: this.title}}
        )
      );
    },
    //   report() {
    //   const { Page } = window;
    //   Page && Page.postMessage(
    //     JSON.stringify({
    //       "event": "report", data: { topicId: this.article.id }
    //     })
    //   );
    // },
  }
}
</script>

<style>
.signup-section {
  display: flex;
  width: 100%;
  height: 40px;
  background: white;
  padding: 5px 10px;
  align-items: left;
  margin-bottom: 10px;
}

.signup-section2 {
  width: 100%;
  display: flex;
  height: 40px;
  background: #8DCF44;
  padding: 5px 10px;
  align-items: left;
  margin-bottom: 10px;
}

.signup_title{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.price_title{
  color: #8DCF44;
  font-size: 18px;
  font-weight: bold;
}

.price_title2{
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.signup-action{
  display: flex;
  justify-content: center;
  align-items: center;
  right: 30px;
  position:absolute;
}

.share{
  object-fit: cover; 
  width: 30px;
  height: 30px;
}

.action-item {
  padding: 5px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign_up_now{
  object-fit: cover; 
  width: 100%;
  height: 30px;
}

.share_now{
  object-fit: cover; 
  width: 100%;
  height: 30px;
}

.shareBtn {
  border-radius: 100px;
  padding: 4px 8px;
  background-color: white;
  /* position: absolute;
  top: 12px;
  right: 20px; */
}

.shareBtnText {
  font-family: SourceHan Sans CN-Medium;
  font-size: 16px;
  font-weight: 500;
  color: #8dce44;
}
</style>