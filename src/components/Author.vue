<template>
<div class="avatar-box">
    <div class="avatar">
        <img :src="avatar" />
    </div>
    <div class="info">
        <h4>{{ name }}</h4>
        <abbr>简介：{{ intro || "暂无简介"}}</abbr>
    </div>
    <a :class="followedClass" v-on:click="follow">{{ currentRelationship == 0? "关注" : "已关注" }}</a>
</div>
</template>
<script>

import axios from 'axios'

export default {
  name: 'Author',
  props: {
    id: Number,
    name: String,
    avatar: String,
    intro: String,
    relationship: Number,
  },
  data() {
      return {
          currentRelationship: this.relationship,
      }
  },
  watch: {
      relationship(newV) {
          this.currentRelationship = newV;
      }
  },
  computed: {
    followedClass()  {
        return this.currentRelationship == 0 ? "to-follow" : "followed";
    }
  },
  methods: {
      follow: async function () {
          try {
            await axios.post(`/api/user/${this.id}/follow`);
            let relationship = this.currentRelationship;
            this.currentRelationship = relationship == 0 ? 1 : 0;
          } catch(e) {
            console.error(e);
          }
      }
  }
}
</script>

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
a {
    box-sizing: border-box;
    width: 48px;
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 12px;
    text-align: center;
    margin-left: 5px;
    border: 1px solid #8DCF44;
}

a.followed {
    background-color: #8DCF44;
    color: white;
}

a.to-follow {
    color: #8DCF44;
}
</style>