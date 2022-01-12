<template>
  <div class="block">
    <div class="block">
      <span class="demonstration">默认 Hover 指示器触发</span>
      <el-carousel height="300px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="block">
      <span class="demonstration">Click 指示器触发</span>
      <el-carousel trigger="click" height="150px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowImage",
  created() {
    console.dir("hello world")
  }
}
</script>

<style scoped>

</style>
