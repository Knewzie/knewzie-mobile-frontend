<template>
<div class="avatar-box">
    <!-- 头像 -->
    <img :src="avatar" class="avatar"/>

    <div><span class="certificate-info">{{ this.name }}</span></div>
    <div>{{followersCount}}&nbsp;&nbsp;粉丝</div>
    <div class="follow-wrapper">
      <a class="to-follow follow-box"  v-on:click="follow">关注</a>
      <a class="to-follow follow-box"  v-on:click="follow">私信</a>
    </div>
     
</div>
</template>
<script>

import Avatar from './Avatar'
import axios from "axios";

export default {
  name: 'EventAuthorDetail',
   components: {
    // eslint-disable-next-line
    Avatar
  },
  props: {
    id: Number,
    name: String,
    avatar: String,
    // followersCount: [String,Number],
  },
  data() {
      return {
          currentRelationship: this.relationship,
          loading: false,
          followersCount: 0//粉丝数
      }
  },
  watch: {
      relationship(newV) {
          this.currentRelationship = newV;
      },
      id(newValue){
        if (newValue != -1) {
          this.loadData();
        }
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
  mounted() {
    // this.loadData();
  },
  methods: {
      async follow () {
          this.$emit('onClickCall');
      },
      loadData(){
        axios.defaults.baseURL = "https://api.knewzie.com";
        axios
        .post(`/user/followers`, { "queryUserId": this.id })
        .then((response) => {
          if (response.data.code == 200) {
            this.followersCount = response.data.data.total;
          }
        });
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
    flex-direction: column;
    align-items: center;
    /* border-bottom: 1px solid #E6E6E7; */
}
.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover; /* Do not scale the image */
  background-color: gray;
  border-radius: 30px;
}
.certificate-info {
  display: inline-block;
  margin-left: 0px;
  margin-right: 5px;
  margin-top: 10px;
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

.follow-wrapper {
  margin-top: 10px;
}
</style>
