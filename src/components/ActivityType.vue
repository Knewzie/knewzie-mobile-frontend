<template>
    <section class="type-section">
      <div class="type">
        <img class="type-img" :src="'/img/bx-map.png'" />
      </div>
      <div class="type-info">
          <abbr>
            {{activityLocation}}
          </abbr>          
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
    isFree: Boolean,
    isSignup: Boolean,
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
        return `<span class="title2">{{currentLocation}}</span>`
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
  align-items: center;
  /* padding: 5px 0; */
}

.type {
  display: flex;
}
.type-img {
  width: 18px;
  margin-right: 0px;
}

.type-info {
  display: inline-block;
  flex-direction: column;
  margin-left: 6px;
  color: #616575;
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