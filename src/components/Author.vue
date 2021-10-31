<template>
<div class="avatar-box">
    <a class="avatar" v-on:click="showAuthor">
        <img :src="avatar" />
    </a>
    <div class="info">
        <h4>{{ name }}</h4>
        <abbr>简介：{{ intro || "暂无简介"}}</abbr>
    </div>
    <div class="loading-box" v-show="loading">
        <RingLoader v-if="showFollow" :loading="loading" size="25px"/>
    </div>
     <a :class="followedClass" v-on:click="follow">{{ currentRelationship === 0? "关注" : "已关注" }}</a>
</div>
</template>
<script>
import axios from 'axios'
import RingLoader from 'vue-spinner/src/RingLoader.vue'

export default {
  name: 'Author',
   components: {
    // eslint-disable-next-line
    RingLoader
  },
  props: {
    id: Number,
    name: String,
    avatar: String,
    intro: String,
    showFollow: Boolean,
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
    }
  },
  methods: {
      showAuthor () {
        const { Page } = window;
        Page && Page.postMessage(JSON.stringify(
            {"event": "showAuthor", data : { id : this.id }}
        ));
      },
      follow: async function () {
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
    padding: 16px 18px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E6E6E7;
}
.info {
    flex: 1;
}

.loading-box {
    width: 48px;
    height: 25px;
    text-align: center;
}
.avatar {
    width: 40px;
    height: 40px;
    margin-right: 16px;
}
.avatar img {
    object-fit: cover; /* Do not scale the image */
    width: 40px;
    height: 40px;
    background-color: gray;
    border-radius: 20px;
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