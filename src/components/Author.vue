<template>
  <div class="avatar-box">
    <Avatar :avatar="avatar" :role="role" :id="id" />
    <div class="info">
      <div>
        <h4>{{ name }}</h4>
        <span v-if="this.title" class="certificate-info">{{ this.title }}</span>
      </div>
      <abbr v-if="this.intro">简介：{{ intro || "暂无简介" }}</abbr>
    </div>
    <!--  -->
    <div class="loading-box" v-show="loading">
      <RingLoader v-if="showFollow" :loading="loading" size="25px" />
    </div>
    <a :class="followedClass" v-if="showFollow" v-on:click="follow">{{
      currentRelationship === 0 ? "关注" : "已关注"
    }}</a>
    <a
      :class="followedClass"
      v-if="!showFollow && dialog"
      v-on:click="dialogVisible = true"
      >{{ currentRelationship === 0 ? "关注" : "已关注" }}</a
    >
    <el-dialog
      v-if="dialog"
      :visible.sync="dialogVisible"
      width="295px"
      :show-close="false"
      custom-class="dialog-class"
    >
      <div slot="header"></div>
      <span class="dialogh">是否打开去浪APP ？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialogc" type="text" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button class="dialogm" type="text" @click="dialogVisible = false"
          >打开App</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import Avatar from "./Avatar";

export default {
  name: "Author",
  components: {
    // eslint-disable-next-line
    RingLoader,
    Avatar,
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
  border-bottom: 1px solid #e6e6e7;
}

.certificate-info {
  display: inline-block;
  margin-left: 6px;
  color: rgba(0, 0, 0, 30%);
  font-size: 12px;
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
  background-color: #8dcf44;
  color: white;
}

a.to-follow {
  color: #8dcf44;
}

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
