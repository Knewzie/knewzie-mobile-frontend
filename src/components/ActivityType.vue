<template>
    <section >
      <!-- 金额 -->
      <div class="type-section">
        <div class="type">
          <img class="type-img" :src="'/img/bx-money-withdraw.png'" />
        </div>
        <div class="type-info">
            <abbr v-if="cost == 0">
              免费
            </abbr>          
            <abbr v-else>常规售价：${{(cost / 100).toFixed(2)}} NZD</abbr>
        </div>
      </div>

      <!-- 剩余位置 -->
      <div class="type-section" v-if="!haveLimitNumber">
        <div class="type">
          <img class="type-img" :src="'/img/bx-user.png'" />
        </div>
        <div class="type-info leave-number">    
            <abbr>剩余 {{leaveNumber}} 个位置</abbr>
        </div>
      </div>

      <!-- 年龄限制 -->
      <div class="type-section" v-if="minAge > 0">
        <div class="type">
          <img class="type-img" :src="'/img/bx-minus-circle.png'" />
        </div>
        <div class="type-info">    
            <abbr>{{leaveNumber}}周岁或者以上才能报名</abbr>
        </div>
      </div>
      
      
      <!-- 地址或者链接 -->
      <div class="type-section">
        <div class="type">
          <img class="type-img" :src="'/img/bx-map.png'" />
        </div>
        <div class="type-info">
            <abbr v-if="isOnline == false">
              {{activityLocation}}
            </abbr>          
            <abbr v-else>报名获取活动链接</abbr>
        </div>
      </div>
      
    </section>
</template>

<script>

export default {
  name: 'ActivityType',
  components: {
  },
  props: {
    id: Number,
    isOnline: Boolean,
    isFree: Boolean,
    cost: Number,
    isSignup: Boolean,
    activityLocation: String,
    planNumber: Number, //可报名人数
    applyNumber: Number, //已报名人数
    minAge: Number///年龄限制
  },
  data() {
      return {
          currentIsOnline: this.isOnline,
          currentLocation: this.activityLocation
      }
  },
  watch: {

  },
  computed: {
    displayTitle() {
      if (this.currentIsOnline) {
        return `<span class="title2">参与活动即可获得活动链接</span>`                
      } else {
        return `<span class="title2">{{currentLocation}}</span>`
      }
    },
    // 是否有限制人数
    haveLimitNumber() {
      if (this.planNumber == 999999) {
        return true;
      }
      return false;
    },
    leaveNumber() {
      if (this.planNumber != 999999) {
        return this.planNumber - this.applyNumber
      }
      return 0;
    }
  },
  methods: {
      
  }
}
</script>

<style>
.type-section {
  display: flex;
  background: white;
  margin-top: 10px;
  align-items: center;
  /* padding: 5px 0; */
}

.type {
  display: flex;
}
.type-img {
  width: 18px;
  margin-right: 0px;
}

.type-info {
  display: inline-block;
  flex-direction: column;
  margin-left: 6px;
  color: #616575;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.title2 {
  font-size: 14px;
  font-weight:normal;
  opacity: 0.5;
}
.leave-number{
  color: #F08A40;
}
</style>