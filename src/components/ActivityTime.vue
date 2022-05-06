<template>
  <section class="time-section">
    <div>
      <img class="time-img" src="/img/activity_time.png" />
    </div>
    <div class="time-info">
        <div><span class="title" v-html="displayTime"></span></div>
        <abbr>{{this.currentActivityDuration}} (新西兰时间)</abbr>
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
    activityTime: String,
    activityDuration: String
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
      let t = this.currentActivityTime;
      let day = moment(t).day();
      let date = moment(t).date();
      let month = moment(t).month() + 1;
      let week = this.getWeek(day);
      let year =  moment(t).year();
      return week + "，" + month + '月' + date + '日，' + year;     
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

<style>
.time-section {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: center;
}

.time-img {
  width: 18px;
  margin-right: 5px;
}

.time-info {
  display: inline-block;
  flex-direction: column;
  margin-left: 6px;
  color: black;
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

</style>