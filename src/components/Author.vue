<template>
<div class="avatar-box">
    <div class="avatar">
        <img :src="avatar" />
    </div>
    <div class="info">
        <h4>{{ name }}</h4>
        <abbr>简介：{{ intro || "暂无简介"}}</abbr>
    </div>
    <a>已关注</a>
</div>
</template>
<script>
export default {
  name: 'Author',
  props: {
    name: String,
    avatar: String,
    intro: String
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
    background-color: #8DCF44;
    text-align: center;
    color: white;
    border-radius: 12px;
}
</style>