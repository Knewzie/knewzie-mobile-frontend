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
      <RingLoader v-if="showFollow" :loading="loading" size="25px" />
    </div>
    <div>
      <span class="certificate-info"
        >{{ this.name }}
        <span class="cIimg">
          <img
            class="sCimg"
            v-if="this.role == 1 || this.role == 2"
            src="../images/sign.png"
            alt=""
            srcset=""
          />
          <img
            class="sCimg"
            v-if="this.role == 4"
            src="../images/sign4.png"
            alt=""
            srcset=""
          />
          <img
            class="sCimg"
            v-if="this.role == 5"
            src="../images/sign5.png"
            alt=""
            srcset=""
          />
          <img
            class="sCimg"
            v-if="this.role == 6"
            src="../images/sign6.png"
            alt=""
            srcset=""
          />
        </span>
      </span>
    </div>
    <ToDialog :show="dialogVisible" @submit="gotoDownload" />
    <a
      :class="followedClass"
      v-if="showFollow"
      v-on:click="dialogVisible = true"
      >关注</a
    >
  </div>
</template>
<script>
// import axios from 'axios'
import RingLoader from "vue-spinner/src/RingLoader.vue";
import Avatar from "./Avatar";
import ToDialog from "./ToDialog.vue";

export default {
  name: "EventAuthor",
  components: {
    // eslint-disable-next-line
    RingLoader,
    Avatar,
    ToDialog,
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
      dialogVisible: false,
    };
  },
  watch: {
    relationship(newV) {
      this.currentRelationship = newV;
    },
  },
  computed: {
    followedClass() {
      let clazz =
        this.currentRelationship === 0
          ? "to-follow follow-box"
          : "followed follow-box";
      if (this.loading) {
        clazz += " loading";
      }
      return clazz;
    },
    certificatedClass() {
      let returnClass = "certificate-box";
      switch (this.role) {
        case 2: {
          returnClass += " enterprise";
          break;
        }
        case 3: {
          returnClass += " organization";
          break;
        }
        case 4: {
          returnClass += " vip";
          break;
        }
        case 5: {
          returnClass += " certificated";
          break;
        }
      }
      return returnClass;
    },
  },
  methods: {
    async gotoDownload(e) {
      if (e) {
        this.$emit("onClickCall");
        this.download();
      }
      this.dialogVisible = false;
    },
    download() {
      var ua = navigator.userAgent;
      //  var appVer = navigator.appVersion;
      // console.log('appver='+appVer);
      var url = `https://play.google.com/store/apps/details?id=com.dazhixinany.know`;
      var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isIOS) {
        url = `https://apps.apple.com/nz/app/%E7%AD%94%E7%9F%A5%E6%96%B0/id1551768968`;
      }
      var isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1;
      if (isAndroid) {
        var isHuawei = ua.toLowerCase().match(/huawei/i) == "huawei";
        if (isHuawei) {
          url = `https://appgallery.cloud.huawei.com/ag/n/app/C104495637?locale=zh_CN&source=appshare&subsource=C104495637&shareTo=com.android.bluetooth&shareFrom=appmarket`;
        }
      }
      window.location.href = url;
    },
  },
};
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #051a37;
  font-size: 14px;
  font-weight: 400;
}

.cIimg {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sCimg {
  width: 40px;
  height: 40px;
  margin: 0px;
  padding: 0px;
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
  color: rgba(0, 0, 0, 60%);
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
  border: 1px solid #8dcf44;
}

a.loading {
  display: none;
}

a.followed {
  border: 1px solid #0764df;
  color: #0764df;
  border-radius: 8px;
}

a.to-follow {
  border: 1px solid #0764df;
  color: #0764df;
  border-radius: 8px;
}
</style>
