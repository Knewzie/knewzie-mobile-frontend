<template>
  <div>
    <ToDialog :show="dialogVisible" @submit="gotoDownload" />
    <div class="float">
      <div class="video_a">
        <div class="video_a_top">
          <img class="header_img" :src="avatar" />
          <span class="video_a_name">{{ nickname }}</span>
          <span class="video_a_follow">关注</span>
        </div>

        <div class="video_title">{{ title }}</div>
        <el-row class="companies">
          <el-col :span="6"><div style="visibility: hidden">隐藏</div> </el-col>
          <el-col :span="10">
            <div class="fIcon">
              <div class="fIcon_item">
                <img src="../images/bx-eye.png" />&nbsp;&nbsp;{{ pv }}
              </div>
              <div class="fIcon_item">
                <img src="../images/bx-heart2.png" />&nbsp;&nbsp;{{ likes }}
              </div>
              <div class="fIcon_item">
                <img src="../images/bx-comment.png" />&nbsp;&nbsp;{{ replies }}
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="video_input" v-on:click="dialogVisible = true">
          <div>Write a comment</div>
          <img src="../images/bx-send.png" alt="" srcset="" />
        </div>
      </div>
    </div>
  </div>
</template>
  <script>
import RingLoader from "vue-spinner/src/RingLoader.vue";
import ToDialog from "./ToDialog.vue";
//   import Avatar from "./Avatar";

export default {
  name: "Author",
  components: {
    // eslint-disable-next-line
    RingLoader,
    ToDialog,
  },
  props: {
    id: Number,
    nickname: String,
    pv: Number,
    likes: Number,
    replies: Number,
    title: String,
    avatar: String,

    intro: String,
    showFollow: Boolean,
    dialog: Boolean,
    relationship: Number,
  },
  data() {
    return {
      dialogVisible: false,
      currentRelationship: this.relationship,
      loading: false,
    };
  },
  watch: {
    relationship(newV) {
      this.currentRelationship = newV;
    },
  },
  computed: {},
  methods: {
    gotoDownload(e) {
      if (e) {
        this.$emit("onClickCall");
      }
      this.dialogVisible = false;
    },
  },
};
</script>
  
  <style>
.float {
  position: fixed;
  width: 100vw;
  left: 0px;
  bottom: 2px;
  background-color: rgba(0, 0, 0, 0%);
  color: #f6f6f6;
  z-index: 9;
}
.video_a {
  margin: 0px auto;
  width: 90%;
  /* padding: 20px; */
}
.video_a_top {
  height: 26px;
  display: flex;
  justify-content: flex-start;
  justify-items: center;
}
.header_img {
  margin: auto 10px auto 0px;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f6f6f6;
}
.video_a_name {
  margin-right: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 26px;
  text-align: center;
}
.video_a_follow {
  /* height: 26px;
  width: 57px; */
  font-weight: 400;
  font-size: 13px;
  border-radius: 8px;
  padding: 4px 8px 4px 8px;
  border: 1px solid #fff;
}
.video_title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;

  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 1;
  overflow: hidden;
}
/* 一键三连 */
.companies {
  /* display: none; */
  margin-top: 10px;
}
.fIcon {
  display: flex;
  justify-content: space-between;
}
.fIcon_item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
}
.fIcon img {
  width: 20px;
  height: 20px;
}
.video_input {
  margin: 10px 0px;
  padding: auto;
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* width: 100%; */
  padding: 0px 15px;
  border-radius: 50px;
  /* padding: 12px 16px 12px 16px; */
}
.video_input img {
  margin: 10px 0px;
  height: 18px;
  width: 19px;
}
</style>
  
  <style scoped>
</style>
  