<template>
<div class="avatar-box">
    <div class="avatar">
        <img :src="avatar" />
    </div>
    <div class="info">
        <h4>{{ name }}</h4>
        <abbr>简介：{{ intro || "暂无简介"}}</abbr>
    </div>
    <a :class="followedClass">{{ relationship == 0? "关注" : "已关注" }}</a>
</div>
</template>
<script>
export default {
  name: 'Author',
  props: {
    name: String,
    avatar: String,
    intro: String,
    relationship: Number,
  },
  computed: {
    followedClass()  {
        return this.relationship == 0? "to-follow" : "followed";
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
    width: 46px;
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 12px;
    text-align: center;
}

a.followed {
    background-color: #8DCF44;
    color: white;
}

a.to-follow {
    border: 1px solid #8DCF44;
    color: #8DCF44;
}
</style>