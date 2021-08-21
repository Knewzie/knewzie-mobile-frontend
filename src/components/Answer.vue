<template>
<div class="body">
    <div class="avatar-box">
        <div class="avatar">
            <img :src="avatar"/>
        </div>
        <div class="info">
            <h4>{{ nickname }}</h4>
            <abbr>5分钟前 · 回答了问题</abbr>
        </div>
    </div>
    <article v-html="content">
    </article>
    <section class="actions">
        <div class="action-item" style="margin-right: 32px">
        <img src="/images/btn_love_tick.png" /><span>10k</span>
      </div>
      <div class="action-item"><img src="/images/btn_share.png" /><span>分享</span></div>
      <div class="space" />
      <div>1000 个评论</div>
    </section>
</div>
</template>
<script>
export default {
  name: 'Answer',
  props: {
    nickname: String,
    intro: String,
    avatar: String,
    content: String,
  }
}
</script>

<style scoped>
.body {
    background: white;
    padding: 16px 0;
}

.avatar-box {
    padding: 0 18px 16px;
    display: flex;
    align-items: center;
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

article {
    padding: 0px 28px;
}

h4 {
    margin: 0;
}

.actions {
  display: flex;
  background: white;
  margin-top: 10px;
  padding: 0px 28px;
  align-items: center;
}

.space {
  flex:1
}


.action-item {
  padding: 7px 0;
  display: flex;
  align-items: center;
  
}

.action-item > img {
  width: 18px;
  margin-right: 5px;
}

.action-item > span {
  line-height: normal;
}

</style>