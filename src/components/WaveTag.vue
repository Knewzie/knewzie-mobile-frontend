<template>

    <span class="tag-box" v-bind:style="styleObj">{{title}}</span>

</template>
<script>



export default {
  name: 'WaveTag',
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
    /* background-color: #5d9ff833; */
    /* border-color: #d9ecff; */
    height: 32px;
    padding: 5px 10px;
    line-height: 30px;
    /* font-size: 11px; */
    font-weight: 500;
    /* color: #0764DF; */
    /* border-width: 1px; */
    /* border-style: solid; */
    border-radius: 8px;
    box-sizing: border-box;
    white-space: nowrap;
}


</style>
