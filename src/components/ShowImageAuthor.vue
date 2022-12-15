<template>
  <div class="avatar-box">
    <Avatar width="40px" height="40px" :avatar="avatar" :role="role" :id="id" />
    <div class="info">
      <span v-if="this.name" class="certificate-info">{{ this.name }}</span>
      <!-- <abbr v-if="this.intro">简介：{{ intro || "暂无简介" }}</abbr> -->
    </div>
    <!--  -->
    <div class="loading-box" v-show="loading">
      <RingLoader v-if="showFollow" :loading="loading" size="25px" />
    </div>

    <a
      :class="followedClass"
      v-if="!showFollow && dialog"
      v-on:click="dialogVisible = true"
      >关注</a
    >
    <ToDialog :show="dialogVisible" @submit="gotoDownload" />
  </div>
</template>
<script>
import RingLoader from "vue-spinner/src/RingLoader.vue";
import Avatar from "./Avatar";
import ToDialog from "./ToDialog.vue";
export default {
  name: "ShowImageAuthor",
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
    showFollow: Boolean,
    dialog: Boolean,
    role: Number,
    title: String,
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
.v-spinner > .v-ring {
  margin: 0 auto;
}

.v-ring {
  box-sizing: border-box;
}
</style>

<style scoped>
.avatar-box {
  padding: 16px 0px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e6e6e7;
}

.certificate-info {
  font-family: "Poppins";
  font-style: normal;
  display: inline-block;
  margin-left: 6px;
  color: #051a37;
  font-weight: 400;
  font-size: 14px;
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
  /* width: 48px; */
  padding: 5px 10px;
  border-radius: 12px;
  text-align: center;
  margin-left: 5px;
  border: 1px solid #8c83f6;
}

a.loading {
  display: none;
}

a.followed {
  background-color: #8dcf44;
  color: white;
}

a.to-follow {
  color: #8c83f6;
}
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
</style>
