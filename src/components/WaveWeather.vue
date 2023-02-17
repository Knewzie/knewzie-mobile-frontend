<template>
  <div class="weather-box">
    <div class="weather-item" v-for="(item,index) in weathers24h" :key="index">
      <img :src="item.icon" style="width: 30px;height: 30px"/>
      <span style="color: rgba(106, 114, 146, 1);">{{item.temp}}</span>
      <span v-if="index==0" class="text-span" style="background-color: rgba(93, 159, 248, 0.2);">{{weatherText(index)}}</span>
      <span v-else class="text-span" style="font-size: 13px;">{{weatherText(index)}}</span>
    </div>
  </div>
    

</template>
<script>



export default {
  name: 'WaveWeather',
   components: {
    // eslint-disable-next-line

  },
  props: {
    weathers24h: {
      type: Array,
      default:  () => {
        return [];
      },
    },
    
  },
  data() {
      return {
          
      }
  },
  filters: {

  },
  methods: {
    weatherText(index){
      var now = new Date();
      // var time = now.setHours(now.getHours() + index);
      var hour = now.getHours();
      var text = (hour == 0 ? '12' : hour.toString()) + 'AM';
      if (hour > 12) text = (hour - 12).toString() + 'PM';
      if (index == 0) text = "现在";
      return text;
    }
  }
}
</script>



<style scoped>
.weather-box {
  display: flex;
  overflow-x: scroll;
  white-space: nowrap;
}
.weather-item{
  display: flex;
  flex-direction: column;
  font-size: 16px;
  margin-right: 5px;
  align-items: center;
}

.text-span{
  font-size: 11px;
  color: rgba(7, 100, 233, 1);
  border-radius: 10px;
  padding: 3px 8px;
}

</style>
