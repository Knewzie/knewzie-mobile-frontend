<template>
  <div class="image-wrapper">
    <div v-for="(item, index) in dataList" :key="index">
      <img :src="item" v-on:click="openApp" />
    </div>
    <!-- 图片超过4张 -->
    <div v-if="mediaList.length > 4" class="image-item-more-wrapper">
      <img :src="mediaList[3]"   />
      <div class="image-item-more">+3</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WaveMultiImage",
  components: {},
  props: {
    mediaList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    dataList() {
      if (this.mediaList.length > 4) {
        return this.mediaList.slice(0, 3);
      }
      return this.mediaList;
    },
  },
  methods: {
    openApp() {
      this.$emit("onClickCall");
    },
  },
};
</script>



<style scoped>
.image-wrapper {
  /* text-align: center; */
  display: flex;
  justify-content: space-between;
}
.image-wrapper img {
  width: 21vw;
  height: 21vw;
  border-radius: 15px;
  object-fit: cover;
}
/* .image-wrapper div {
  margin-left: 5px;
} */

.image-item-more-wrapper {
  background: rgba(23, 23, 23);
  /* opacity:0.8; */
  border-radius: 15px;
  width: 21vw;
  height: 21vw;
  position: relative;
}
.image-item-more-wrapper img {
  width: 21vw;
  height: 21vw;
  opacity: 0.3;
  position: absolute;
}
.image-item-more {
  /* text-align: center; */
  width: 21vw;
  height: 21vw;
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10vw;
  margin-left: -10vw; */
  color: white;
}
</style>
