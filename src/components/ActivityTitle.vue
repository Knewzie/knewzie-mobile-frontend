<template>
<div class="avatar-box">
    <!-- <Avatar :avatar="avatar" :role="role" :id="id" /> -->
    <div class="info">
        <div class="title">{{  this.title  }}
        <!-- <span class="certificate-info">{{ this.title }}</span> -->
        </div>
        <!-- <abbr>{{ duration || "ago"}}</abbr> -->
         <!-- <div class="abbr-box time-box"> -->
        <abbr> {{ duration }}</abbr>
          <span style="flex: 1"></span>
          <!-- <a v-on:click="report"><i class="btn-report" /></a> -->
        <!-- </div> -->
    </div>
    <!-- <div class="loading-box"  v-show="loading">
        <RingLoader v-if="showFollow" :loading="loading" size="25px"/>
    </div> -->
    <div  v-show="showReport">
      <a v-on:click="report"><i class="btn-report" /></a>
    </div>
     <!-- <a v-on:click="report"><i class="btn-collect" /></a> -->
     <!-- <a :class="followedClass" v-if="showFollow" v-on:click="follow">{{ currentRelationship === 0? "关注" : "已关注" }}</a> -->
</div>
</template>
<script>
import axios from 'axios'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Avatar from './Avatar'

export default {
  name: 'Author',
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
    duration: String,
    topicId: Number,
    showReport: Boolean,
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
          try {
            this.loading = true;
            await axios.post(`/user/follow`, { toUid: this.id });
            let relationship = this.currentRelationship;
            this.currentRelationship = relationship === 0 ? 1 : 0;
          } catch(e) {
            console.error(e);
          } finally {
            this.loading = false;
          }
      },
      report() {
      const { Page } = window;
      Page && Page.postMessage(
        JSON.stringify({
          "event": "report", data: { topicId: this.topicId }
        })
      );
    },
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
.btn-report {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url("@/images/ic_report.png");
  background-size: contain;
}

/* .btn-collect {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url("@/images/ic_collect.png");
  background-size: contain;
} */

.avatar-box {
    padding: 8px 18px;
    display: flex;
    align-items: center;
    /* border-bottom: 1px solid #E6E6E7; */
}

.certificate-info {
  display: inline-block;
  margin-left: 6px;
  color: rgba(0,0,0, 30%);
  font-size: 12px;
}

.info {
  color: black;
  flex: 1;
}
.title {
  color: #051A37;
  font-size: 20px;
  font-weight: 600;
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
    background-color: #8DCF44;
    color: white;
}

a.to-follow {
    color: #8DCF44;
}
</style>
