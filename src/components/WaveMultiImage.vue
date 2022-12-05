<template>

    <div class="image-wrapper">
      <div  v-for="(item,index) in dataList" :key="index">
         <img :src="item"  />
      </div>
      <!-- 图片超过4张 -->
      <div v-if="mediaList.length > 4" class="image-item-more-wrapper"> 
        <img :src="mediaList[3]"  />
        <div class="image-item-more" >+3</div>
      </div>
    </div>

</template>
<script>

export default {
  name: 'WaveMultiImage',
  components: {
  },
  props: {
    mediaList: {
      type: Array,
      default: () => {return [];}
    },
  },
  data() {
      return {
        
      }
  },
  computed: {
     dataList(){
      if (this.mediaList.length > 4) {
        return this.mediaList.slice(0,3);
      }
      return this.mediaList;
     }
  },
  methods: {
      
  }
}
</script>



<style scoped>
.image-wrapper {
  /* text-align: center; */
  display: flex;
  justify-content: flex-start;
}
.image-wrapper img {
  width: 77px;
  height: 77px;
  border-radius: 15px;
}
.image-wrapper div {
  margin-left: 5px;
}

.image-item-more-wrapper {
  background: rgba(23, 23, 23);
  /* opacity:0.8; */
  border-radius: 15px;
  width: 77px;
  height: 77px;
  position: relative;
}
.image-item-more-wrapper img {
  opacity:0.3; 
  position: absolute;
}
.image-item-more {
  text-align: center;
  top: 28px;
  position: absolute;
  left: 28px;
  color: white;
}
</style>
