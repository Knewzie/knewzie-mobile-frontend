<template>
    <section class="type-section">
      <div>
        <img class="type-img" :src="this.currentIsOnline?'/img/activity_video.png':'/img/location.png'" />
      </div>
      <div class="type-info">
          <div><span class="title">{{this.currentIsOnline?"线上活动":"活动地点"}}</span></div>
          <abbr><span v-html="displayTitle"></span></abbr>
      </div>
    </section>
</template>

<script>

export default {
  name: 'ActivityType',
  components: {
  },
  props: {
    id: Number,
    isOnline: Boolean,
    activityLocation: String,
  },
  data() {
      return {
          currentIsOnline: this.isOnline,
          currentLocation: this.activityLocation
      }
  },
  watch: {

  },
  computed: {
    displayTitle() {
      if (this.currentIsOnline) {
        return `<span class="title2">参与活动即可获得活动链接</span>`                
      } else {
        return `<span class="title2">${this.currentLocation}</span>`
      }
    }
  },
  methods: {
      
  }
}
</script>

<style>
.type-section {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 7px 28px;
  align-items: center;
}

.type-img {
  width: 18px;
  margin-right: 5px;
}

.type-info {
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