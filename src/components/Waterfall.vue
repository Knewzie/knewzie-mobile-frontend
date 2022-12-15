<template>
  <div class="Waterfall-box">
    <div class="Waterfall-beader">{{ name }}还在哪浪...</div>
    <div class="v-waterfall-content" id="v-waterfall">
      <div
        class="v-waterfall-item"
        v-for="(img, index) in waterfallList"
        :key="'Waterfall' + img + index"
        :style="{
          top: img.top + 'px',
          left: img.left + 'px',
          width: waterfallImgWidth + 'px',
          height: img.height,
        }"
        v-on:click="dialogVisible = true"
      >
        <el-image
          style="width: 100%; height: 100%; border-radius: 20px"
          :src="img.src"
          v-on:click="dialogVisible = true"
          fit="contain"
        ></el-image>
        <div class="Waterfall-like">
          <img class="Waterfall-image" src="../../src/images/bx-heart.png" />
        </div>
        <div class="avatar-box">
          <Avatar
            height="20px"
            width="20px"
            :avatar="img.avatar"
            :role="role"
            :id="id"
          />
          <div class="info">
            <span class="certificate-info">{{ img.nickname }}</span>
          </div>
        </div>
        <div class="header4">
          <p class="header4_span">{{ img.title }}</p>
        </div>
      </div>
    </div>
    <ToDialog :show="dialogVisible" @submit="gotoDownload" />
  </div>
</template>
  <script>
import axios from "axios";
// import { validateHeaderName } from "http";
import moment from "moment";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import Avatar from "./Avatar";
import ToDialog from "./ToDialog.vue";
export default {
  name: "Waterfall",
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
    dialog: Boolean,
    role: Number,
    title: String,
    relationship: Number,
    uid: Number,
  },
  data() {
    return {
      dialogVisible: false,
      currentRelationship: this.relationship,
      loading: false,
      article: [],
      src: "https://img.knewzie.com/image/11708/1670383817090.png",
      waterfallList: [],
      // waterfallImgWidth: 100,
      // waterfallImgWidth: this.scrollerWidth, // 每个盒子的宽度
      // waterfallImgCol: 5,// 瀑布流的列数
      waterfallImgCol: 2, // 瀑布流的列数
      waterfallImgRight: 10, // 每个盒子的右padding
      waterfallImgBottom: 10, // 每个盒子的下padding
      waterfallDeviationHeight: [],
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
    waterfallImgWidth: function() {
      return (window.innerWidth/2  - 21);
    }
  },
  created() {
    axios.defaults.baseURL = "https://api.knewzie.com";

    const { wx } = window;

    wx.error(function (res) {
      alert(JSON.stringify(res));
    });

    wx.ready(() => {
      this.wxReady = true;

      let imgUrlThis = "https://h5.knewzie.com/img/icon.jpeg";
      if (this.article.imageList && this.article.imageList.length > 0) {
        imgUrlThis = this.article.imageList[0];
      }

      wx.onMenuShareAppMessage({
        title: this.article.title,
        desc: `${this.article.replies} 人回答, ${this.article.pv} 人查看`,
        link: window.location.href,
        // imgUrl: "https://h5.knewzie.com/img/icon.jpeg",
        imgUrl: imgUrlThis,
        success: function () {},
      });

      wx.onMenuShareTimeline({
        title: this.article.title,
        link: window.location.href,
        // imgUrl: "https://h5.knewzie.com/img/icon.jpeg",
        imgUrl: imgUrlThis,
        success: function () {},
      });
    });

    const timestamp = moment().unix();
    const appId = "wxd6fe3b0d4e0030ac";
    const nonceStr = "knewzie";

    axios
      .post(`/topic/list`, { type: 4, queryUserId: this.uid, page: 1 })
      .then((response) => {
        const { data } = response.data;
        this.article = data.list;
        this.calculationWidth();
      })
      .then(() =>
        axios.post(`/config/mp/signature`, {
          appId,
          noncestr: nonceStr,
          timestamp: timestamp,
          url: window.location.href,
        })
      )
      .then((response) => {
        const { data: sign } = response.data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: sign, // 必填，签名
          jsApiList: [
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareQZone",
          ], // 必填，需要使用的JS接口列表
          openTagList: ["wx-open-launch-app"], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
        });
      });
  },
  methods: {
    dialogV(e) {
      this.dialogVisible = e;
    },
    gotoDownload (e) {
      if (e) {
        this.$emit("onClickCall");
      }
        this.dialogVisible = false
    },
    
    //计算每个图片的宽度或者是列数
    calculationWidth() {
      let domWidth = document.getElementById("v-waterfall").offsetWidth;
      if (!this.waterfallImgWidth && this.waterfallImgCol) {
        this.waterfallImgWidth =
          (domWidth - this.waterfallImgRight * this.waterfallImgCol) /
          this.waterfallImgCol;
      } else if (this.waterfallImgWidth && !this.waterfallImgCol) {
        this.waterfallImgCol = Math.floor(
          domWidth / (this.waterfallImgWidth + this.waterfallImgRight)
        );
      }
      //初始化偏移高度数组
      this.waterfallDeviationHeight = new Array(this.waterfallImgCol);
      for (let i = 0; i < this.waterfallDeviationHeight.length; i++) {
        this.waterfallDeviationHeight[i] = 0;
      }
      this.imgPreloading();
    },
    //图片预加载
    imgPreloading() {
      for (let i = 0; i < this.article.length; i++) {
        let aImg = new Image();
        aImg.src = this.article[i].imageList[0]
          ? this.article[i].imageList[0]
          : this.article[i].extend.videoThumbnail;
        aImg.onload = aImg.onerror = () => {
          let imgData = {};
          imgData.height = (this.waterfallImgWidth / aImg.width) * aImg.height;
          imgData.src = this.article[i].imageList[0]
            ? this.article[i].imageList[0]
            : this.article[i].extend.videoThumbnail;
          imgData.nickname = this.article[i].creator.nickname; // 说明文字（也可以自己写数组，或者封装json数据，都可以，但是前提是你会相关操作，这里不赘述）
          imgData.title = this.article[i].title; // 说明文字
          imgData.avatar = this.article[i].creator.avatar; // 说明文字
          this.waterfallList.push(imgData);
          this.rankImg(imgData);
        };
      }
    },
    //瀑布流布局
    rankImg(imgData) {
      let {
        waterfallImgWidth,
        waterfallImgRight,
        waterfallImgBottom,
        waterfallDeviationHeight,
        // waterfallImgCol
      } = this;
      let minIndex = this.filterMin();
      imgData.top = waterfallDeviationHeight[minIndex];
      imgData.left = minIndex * (waterfallImgRight + waterfallImgWidth);
      // waterfallDeviationHeight[minIndex] += imgData.height + waterfallImgBottom;// 不加文字的盒子高度
      waterfallDeviationHeight[minIndex] +=
        imgData.height + waterfallImgBottom + 120; // 加了文字的盒子高度，留出文字的地方（这里设置56px）
      // console.log(imgData);
    },
    /**
     * 找到最短的列并返回下标
     * @returns {number} 下标
     */
    filterMin() {
      const min = Math.min.apply(null, this.waterfallDeviationHeight);
      return this.waterfallDeviationHeight.indexOf(min);
    },
  },
};
</script>
  
  <style>
/* 弹窗 */
::v-deep .dialog-class {
  height: 171px;
  width: 295px;
  border-radius: 20px;
}
.dialog-class ::v-deep .el-dialog__header {
  padding: 0px !important;
}
.dialog-button-group {
  display: flex;
  justify-content: space-around;
}
.dialogh {
  display: flex;
  justify-content: center;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 16px;
  /* identical to box height, or 80% */
  display: flex;
  align-items: center;
  color: #1e1e1e;
}
.dialogc {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 16px;
  /* identical to box height, or 80% */
  display: flex;
  align-items: center;
  color: #757474;
}
.dialogm {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 16px;
  /* identical to box height, or 80% */
  display: flex;
  align-items: center;
  color: #6599ff;
}
.dialog-footer {
  display: flex;
  justify-content: space-around;
  margin: 0px 9px;
}
/* 以上为弹窗 */
.Waterfall-box {
  margin-top: 20px;
  width: 100%;
}
.v-spinner > .v-ring {
  margin: 0 auto;
}

.v-ring {
  box-sizing: border-box;
}
</style>

<style scoped>
.avatar-box {
  padding: 10px 0 8px;
  display: flex;
  align-items: center;
}

.certificate-info {
  display: inline-block;
  margin-left: 6px;
  color: #6a7292;
  font-size: 12px;
}

.info {
  color: black;
  flex: 1;
}

.Waterfall-beader {
  padding: 12px 0px;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
  color: #051a37;
}
.header4 {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: #051a37;
  flex: none;
  order: 0;
  flex-grow: 1;
}
::v-deep .header4_span {
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/* .w-conter {
  width: 100%;
  column-count: 2;
  counter-reset: count;
  margin: 0 auto;
} */
.v-waterfall-content {
  width: 100%;
  height: 100%;
  position: relative;
}
.v-waterfall-item {
  float: left;
  position: absolute;
}
/* Waterfall-like */
.Waterfall-like {
  position: absolute;
  width: 26px;
  height: 26px;
  right: 18px;
  top: 10px;
  /* z-index: 2; */
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.Waterfall-like img {
  margin: 2px;
  width: 18px;
  height: 18px;
  border-radius: 20px;
}
</style>
  