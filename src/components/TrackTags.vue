<template>
<div class="event-wrapper">
    <div class="wave-tags">
      <div class="tag-item" v-if="weight > 10"><WaveTrackTag :title="'热门'" :bgColor="'rgba(236, 162, 109, 0.2)'" :fontColor="'#F08A40'"></WaveTrackTag></div>
      <div class="tag-item" v-if="difficulty == 'advanced'">
        <WaveTrackTag :icon="'/img/bx-line-chart.svg'" :title="'高手步道'" :bgColor="'rgba(173, 187, 206, 0.2)'"  :fontColor="'#6A7292'"></WaveTrackTag>
      </div>
      <div class="tag-item" v-if="dog == 1">
        <WaveTrackTag :icon="'/img/bxs-dog.svg'" :title="'允许带狗'" :bgColor="'rgba(173, 187, 206, 0.2)'" :fontColor="'#6A7292'"></WaveTrackTag>
      </div>
    </div>
</div>
</template>
<script>

import WaveTrackTag from './WaveTrackTag.vue'

export default {
  name: 'EventTags',
   components: {
    WaveTrackTag
    // eslint-disable-next-line

  },
  props: {
    id: Number,
    weight: Number, //权重
    difficulty: String,     //难度
    dog: Number,   //是否允许带狗
  },
  data() {
      return {
          loading: false,
      }
  },
  watch: {
      
  },
  computed: {
    
  },
  methods: {
      
  }
}
</script>

<style scoped>

.event-wrapper{ 
  padding: 25px 18px 0 18px;
}
.wave-tags {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
}
.tag-item{
  margin-right: 4px;
}


</style>
