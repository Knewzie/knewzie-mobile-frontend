<template>
<div class="avatar-box">
    <!-- <div class="info"> -->
        <!-- <div><h4>{{ title }}</h4> -->
        <!-- <span class="certificate-info">{{ this.title }}</span> -->
        <!-- </div> -->
        <!-- <abbr>简介：{{ intro || "暂无简介"}}</abbr> -->
    <!-- </div> -->
    <Avatar :avatar="avatar" :role="role" :id="id" />
    
    <div v-show="loading">
        <RingLoader v-if="showFollow" :loading="loading" size="25px"/>
    </div>
    <div><span class="certificate-info">{{ this.name }}</span></div>
     <a :class="followedClass" v-if="showFollow" v-on:click="follow">关注</a>
</div>
</template>
<script>
// import axios from 'axios'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Avatar from './Avatar'

export default {
  name: 'EventAuthor',
   components: {
    // eslint-disable-next-line
    RingLoader, Avatar
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
      relationship(newV) {
          this.currentRelationship = newV;
      }
  },
  computed: {
    followedClass()  {
        let clazz = this.currentRelationship === 0 ? "to-follow follow-box" : "followed follow-box";
        if (this.loading) {
            clazz += " loading";
        }
        return clazz;
    },
    certificatedClass () {
      let returnClass = "certificate-box";
      switch (this.role) {
        case 2: {
          returnClass += " enterprise"
          break;
        }
        case 3: {
          returnClass += " organization"
          break;
        }
        case 4: {
          returnClass += " vip"
          break;
        }
        case 5: {
          returnClass += " certificated"
          break;
        }
      }
      return returnClass;
    }
  },
  methods: {
      async follow () {
        this.$emit('onClickCall');
      }
  }
}
</script>

<style>
.v-spinner > .v-ring {
    margin: 0 auto;
}

.v-ring {
    box-sizing: border-box;
}

</style>

<style scoped>

.avatar-box {
    padding: 0px 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* border-bottom: 1px solid #E6E6E7; */
}

.certificate-info {
  display: inline-block;
  margin-left: 0px;
  margin-right: 5px;
  color: #051A37;
  font-size: 14px;
  font-weight: 400;
}

.info {
  color: black;
  flex: 1;
}

.info h4 {
  display: inline-block;
}

.info abbr {
  display: block;
  font-size: 12px;
  color: rgba(0, 0, 0, 60%)
}

.loading-box {
    width: 48px;
    height: 25px;
    text-align: center;
}
h4 {
    margin: 0;
}

a.follow-box {
    box-sizing: border-box;
    width: 48px;
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 12px;
    text-align: center;
    margin-left: 5px;
    border: 1px solid #8DCF44;
}

a.loading {
    display: none;
}

a.followed {
    border: 1px solid #0764DF;
    color: #0764DF;
    border-radius: 8px;
}

a.to-follow {
    border: 1px solid #0764DF;
    color: #0764DF;
    border-radius: 8px;
}
</style>
