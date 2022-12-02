<template>
<div class="event-wrapper">
    <div class="wave-tags">
      <div class="tag-item"><WaveTag :title="'置顶'" :bgColor="'rgba(240, 138, 64, 0.5)'" :fontColor="'#F9F9F9'"></WaveTag></div>
      <div class="tag-item"><WaveTag :title="'免费'" ></WaveTag></div>
      <div class="tag-item"><WaveTag :title="'热门'" :bgColor="'rgba(236, 162, 109, 0.2)'" :fontColor="'#F08A40'"></WaveTag></div>
      <div class="tag-item"><WaveTag :title="'过期'" :bgColor="'rgba(91, 213, 49, 0.2)'" :fontColor="'#228400'"></WaveTag></div>
      <div class="tag-item"><WaveTag :title="'售罄'" :bgColor="'rgba(229, 55, 97, 0.2)'" :fontColor="'#E63761'"></WaveTag></div>
    </div>
</div>
</template>
<script>

import WaveTag from './WaveTag.vue'

export default {
  name: 'EventTags',
   components: {
    WaveTag
    // eslint-disable-next-line

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
  },
  data() {
      return {
          currentRelationship: this.relationship,
          loading: false,
      }
  },
  watch: {
      
  },
  computed: {
    followedClass()  {
        
        return "";
    },
    certificatedClass () {
      
      
      return "";
    }
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
