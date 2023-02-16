<template>

    <div class="tag-box" v-bind:style="styleObj">
        <div v-if="icon != ''" class="type">
          <img class="type-img" :src="icon" />
        </div>
      {{title}}
    </div>

</template>
<script>



export default {
  name: 'WaveTrackTag',
   components: {
    // eslint-disable-next-line

  },
  props: {
    id: Number,
    bgColor: {
      type: String,
      default: '#5d9ff833'
    },
    fontSize: {
      type: String,
      default: '11px'
    },
    fontColor: {
      type: String,
      default: '#0764DF'
    },
    title: String,
    icon: {
      type: String,
      default: ""
    }
    
  },
  data() {
      return {
          styleObj: {
            backgroundColor: this.bgColor,
            fontSize: this.fontSize,
            color: this.fontColor
          }
      }
  },
  
  methods: {
      
  }
}
</script>



<style scoped>

.tag-box {
    padding: 5px 10px;
    font-weight: 500;
    border-radius: 8px;
    box-sizing: border-box;
    white-space: nowrap;
    display: flex;
    background: white;
    margin-top: 10px;
    align-items: flex-start;
}

.type {
  display: flex;
}
.type-img {
  width: 18px;
  margin-right: 0px;
}
</style>
