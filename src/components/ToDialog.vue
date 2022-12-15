<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="295px"
    :show-close="false"
    custom-class="dialog-class"
  >
    <div slot="header"></div>
    <span class="dialogh">是否打开去浪APP ？</span>
    <span slot="footer" class="dialog-footer">
      <div class="dialog-footer_item">
        <span class="dialogc" type="text" @click="submit(false)">取消</span>
      </div>
      <div class="dialog-footer_item">
        <span class="dialogm" type="text" @click="submit(true)">打开App</span>
      </div>
    </span>
  </el-dialog>
</template>
  
  <script>
export default {
  name: "ToDialog",
  props: {
    avatar: String,
    role: Number,
    id: Number,
    show: Boolean,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialogVisible = val;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
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
    submit(e) {
      this.$emit("submit", e);
    },
  },
};
</script>
  
  <style scoped>
/* 弹窗 */
::v-deep .dialog-class {
  height: 171px;
  width: 295px;
  border-radius: 20px;
  overflow: hidden;
}
::v-deep .dialog-class ::v-deep .el-dialog__header {
  padding: 0px !important;
}
::v-deep .el-dialog__footer {
  margin: 0px !important;
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
  border-top: 0.5px solid #dadada;
  display: flex;
  justify-content: space-around;
  margin: 0px;
}
.dialog-footer_item {
  width: 50%;
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-footer_item:last-child {
  border-left: 0.5px solid #dadada;
}
.el-button {
  padding: 10px;
}
</style>
  