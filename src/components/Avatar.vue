<template>
  <a class="avatar" v-on:click="showAuthor">
    <img :src="avatar" />
    <div :class="certificatedClass"></div>
  </a>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    avatar: String,
    role: Number,
    id: Number,
  },
  computed: {
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
  methods: {
    showAuthor() {
      const { Page } = window;
      Page && Page.postMessage(JSON.stringify(
          { "event": "showAuthor", data: { id: this.id } }
      ));
    },
  }
}
</script>

<style scoped>

.certificate-info {
  display: inline-block;
  margin-left: 6px;
  color: rgba(0,0,0, 30%);
  font-size: 12px;
}

.avatar {
  position: relative;
}

.certificate-box {
  display: inline-block;
  width: 17px;
  height: 17px;
  content: " ";
  position: absolute;
  bottom: -3px;
  right: -3px;
  background-size: cover;
}

.certificate-box.enterprise {
  background-image: url("./images/ic_enterprise.png");
}

.certificate-box.organization {
  background-image: url("./images/ic_organization.png");
}

.certificate-box.vip {
  background-image: url("./images/ic_vip.png");
}

.certificate-box.certificated {
  background-image: url("./images/ic_certificated.png");
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
</style>
