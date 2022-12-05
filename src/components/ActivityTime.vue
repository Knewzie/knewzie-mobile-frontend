<template>
  <section class="time-section">
    <div class="time">
      <img class="time-img" src="/img/bx-calendar-heart.png" />
    </div>
    <div class="time-info">
        <div>
          <span class="title" v-html="displayTime"></span>
          <abbr class="title" v-html="duration"></abbr>
        </div>
        <!-- <abbr>{{this.currentActivityDuration}} (新西兰时间)</abbr> -->
        
    </div>
  </section> 
</template>

<script>
import moment from 'moment';

export default {
  name: 'ActivityTime',
  components: {
  },
  props: {
    id: Number,
    activityTime: Number,
    activityDuration: Number
  },
  data() {
      return {
          currentActivityTime: this.activityTime,
          currentActivityDuration: this.activityDuration
      }
  },
  watch: {

  },
  computed: {
    displayTime() {
      if (this.activityTime == 0) {
        return "加载中...";
      }
      let t = this.activityTime*1000;
      let day = moment(t).day();
      let date = moment(t).date();
      let month = moment(t).month() + 1;
      let week = this.getWeek(day);
      let year =  moment(t).year();
      return week + "，" + month + '月' + date + '日，' + year;     
    },
    duration() {
      if (this.activityTime == 0) {
        return "";
      }
      let begin = moment(this.activityTime*1000);
      // let end = moment(this.activityDuration*1000);
      let _startAt = begin.format("YYYY-MM-DD HH:mm:ss");      
      // let _endAt = end.format("YYYY-MM-DD HH:mm:ss");
      let _startTime = _startAt.substring(10,16);
      // console.log(_startTime,'_startTime');    
      // console.log(_startAt,'_startAt');    
      // console.log(_endAt,'_endAt');
      return _startTime;
    }
  },
  methods: {
    getWeek(day){
      if(day === null || day === ''){
        return;
      }
      switch (day) {
        case 1:
          return '星期一'
        case 2:
          return '星期二'
        case 3:
          return '星期三'
        case 4:
          return '星期四'
        case 5:
          return '星期五'
        case 6:
          return '星期六'
        case 0:
          return '星期日'
      }      
    } 
      
  }
}
</script>

<style scope>
.time-section {
  display: flex;
  background: white;
  margin-top: 10px;
  align-items: center;
  padding: 5px 0;
}
.time {
  display: flex;
}
.time-img {
  width: 18px;
  margin-right: 0px;
  
}

.time-info {
  display: inline-block;
  flex-direction: column;
  margin-left: 6px;
  color: black;
}

.title {
  font-size: 14px;
  font-weight: 400;
  color: #616575;
}

.title2 {
  font-size: 14px;
  font-weight:normal;
  opacity: 0.5;
}

</style>