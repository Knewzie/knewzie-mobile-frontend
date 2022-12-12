<template>
  <div class="Waterfall-box">
    <div class="Waterfall-beader">{{ title }}</div>
    <el-row :gutter="20">
      <el-col
        :span="12"
        v-for="(item, index) in list"
        :key="'Waterfall' + item + index"
        v-on:click="dialogVisible = true"
      >
        <el-image
          style="width: 100%; height: 100%; border-radius: 20px"
          :src="src"
          v-on:click="dialogVisible = true"
          fit="contain"
        ></el-image>
        <div class="Waterfall-like">
          <!-- v-on:click="showAuthor" -->
          <img class="Waterfall-image" src="../../src/images/bx-heart.png" />
        </div>
        <div class="avatar-box">
          <Avatar
            height="20px"
            width="20px"
            :avatar="avatar"
            :role="role"
            :id="id"
          />
          <div class="info">
            <span v-if="title" class="certificate-info">{{ title }}</span>
          </div>
        </div>
        <div class="header4">
          <p class="header4_span">{{ name }}</p>
        </div>
      </el-col>
      <ToDialog :show="dialogVisible" @submit="dialogVisible = false" />
    </el-row>
  </div>
</template>
  <script>
import axios from "axios";
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
  },
  data() {
    return {
      dialogVisible: false,
      currentRelationship: this.relationship,
      loading: false,
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      src: "https://img.knewzie.com/image/11708/1670383817090.png",
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
    dialogV(e) {
      this.dialogVisible = e;
    },
    async follow() {
      try {
        this.loading = true;
        await axios.post(`/user/follow`, { toUid: this.id });
        let relationship = this.currentRelationship;
        this.currentRelationship = relationship === 0 ? 1 : 0;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async toapp() {
      try {
        this.loading = true;
        await axios.post(`/user/follow`, { toUid: this.id });
        let relationship = this.currentRelationship;
        this.currentRelationship = relationship === 0 ? 1 : 0;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
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

/* Waterfall-like */
.el-col {
  position: relative;
}
.Waterfall-like {
  position: absolute;
  width: 26px;
  height: 26px;
  right: 18px;
  top: 10px;
  z-index: 2;
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
  background-color: gray;
  border-radius: 20px;
}
</style>
  