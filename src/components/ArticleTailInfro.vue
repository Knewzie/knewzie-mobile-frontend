<template>
    <section class="type-section">
      <div class="left-group">
        <div class="icon-wrapper eye-show">
          <img class="icon" src="/img/bx-eye-show.png"/>
          <span>{{pv}}</span>
        </div>
        <div class="icon-wrapper">
          <img class="icon" src="/img/bx-heart.png"/>
          <span>{{like}}</span>
        </div>
      </div>

      <div class="time">
        <span>{{createdAt}}</span>
      </div>
      
      
    </section>
</template>

<script>

export default {
  name: 'ArticleTailInfro',
  components: {
  },
  props: {
    like: Number,
    pv: Number,
    createdAt: Number,
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
        return `<span class="title2">{{currentLocation}}</span>`
      }
    }
  },
  methods: {
      
  }
}
</script>

<style scope>
.type-section {
  display: flex;
  background: white;
  justify-content: space-between;
  /* margin-top: 10px; */
  align-items: center;
  padding: 10px 18px;
}
.left-group{
  display: flex;
  font-size: 13px;
  font-weight: 400;
}
.icon-wrapper {
  display: flex;
  align-items: center;
}
.icon {
  width: 30px;
  margin-right: 5px;
}
.eye-show {
  margin-right: 50px;
}

.time{
  color:#6A7292;
  font-weight: 500;
  font-size: 11px;
}

</style>