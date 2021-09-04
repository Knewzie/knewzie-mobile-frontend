<template>
<div class="avatar-box">
    <div class="avatar">
        <img :src="avatar" />
    </div>
    <div class="info">
        <div><h4>{{ name }}</h4><span>赞同了这个问题</span></div>
        <abbr>15 分钟前</abbr>
    </div>
</div>
</template>
<script>
export default {
  name: 'AgreePerson',
  props: {
    id: Number,
    name: String,
    avatar: String,
  },
}
</script>
<style scoped>
.avatar-box {
    padding: 16px 18px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E6E6E7;
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
 
.info h4 {
    display: inline-block;
    margin: 0 14px 0 0;
}

</style>