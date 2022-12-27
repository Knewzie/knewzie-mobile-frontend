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
            <div class="multi-price-item" v-else><span class="price-main-name">常规售价: </span><span class="price-main-price">${{(cost / 100).toFixed(2)}} NZD</span></div>
            <!-- 早鸟票 -->
            <div  v-if="cost > 0">
              <div class="multi-price-item" v-for="item,index in priceEarlyBird" :key="index">
                <div class="price-main-info">
                  <span class="price-main-name">{{item.name}}: </span>
                  <span class="price-main-price">${{discountPrice(item.discount)}} NZD </span>
                  <span class="price-main-discount"> -{{item.discount}}%</span>
                </div>
                <div class="price-sub-info">
                  {{displayTime(item.startAt)}} - {{displayTime(item.endAt)}}
                </div>
              </div>
            </div>
            <!-- 家庭组合票 -->
            <div  v-if="cost > 0">
              <div class="multi-price-item" v-for="item,index in priceFamily" :key="index">
                <div class="price-main-info">
                  <span class="price-main-name">{{item.name}}: </span>
                  <span class="price-main-price">${{discountPrice(item.discount)}} NZD </span>
                  <span class="price-main-discount"> -{{item.discount}}%</span>
                </div>
                <div class="price-sub-info">
                  成人 {{item.auditStock}} (16+) + 儿童 {{item.childStock}} (15岁以下)
                </div>
              </div>
            </div>
            
            <!-- VIP票 -->
            <div  v-if="cost > 0">
              <div class="multi-price-item" v-for="item,index in priceVIP" :key="index">
                <div class="price-main-info">
                  <span class="price-main-name">{{item.name}}: </span>
                  <span class="price-main-price">${{(item.price / 100).toFixed(2)}} NZD </span>
                </div>
                <div class="price-sub-info-vip">
                  查看VIP包含产品/服务
                </div>
              </div>
            </div>
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
import moment from 'moment';

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
    minAge: Number,///年龄限制
    priceEarlyBird: Array, //早鸟票
    priceFamily: Array,    //家庭票
    priceVIP: Array,       //VIP票
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
    discountPrice(discount) {
      return (Math.ceil(this.cost * (100 - discount) / 100) / 100).toFixed(2);
    },

    displayTime(time) {
      if (time == 0) {
        return "";
      }
      let begin = moment(time*1000);

      let _startAt = begin.format("YYYY年MM月DD日 HH:mm");      
      
      return _startAt;
    }
  }
}
</script>

<style>
.type-section {
  display: flex;
  background: white;
  margin-top: 10px;
  align-items: flex-start;
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
  font-weight: 400;
  font-size: 14px;
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
.multi-price-item{
  margin-bottom: 6px;
}
.price-main-info {
  padding: 4px 0;
}
.price-main-name{
  font-size: 13px;
  font-weight: 600;
  color: #6A7292;
}
.price-main-price{
  font-weight: 400;
  font-size: 14px;
  color: #6A7292;
}
.price-main-discount{
  color: #228400;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  background: rgba(91, 213, 49, 0.2);
  border-radius: 8px;
}
.price-sub-info{
  color: #228400;
  font-size: 11px;
  font-weight: 500;
}
.price-sub-info-vip{
  font-weight: 400;
  font-size: 13px;
  color: #0764DF;
  text-decoration-line: underline;
}
</style>