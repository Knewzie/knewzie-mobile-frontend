<template>
<div class="avatar-box">
    <div class="avatar">
        <img :src="avatar" />
    </div>
    <div class="info">
        <div><h4>{{ name }}</h4><span>赞同了这个问题</span></div>
        <abbr>{{ duration }}</abbr>
    </div>
</div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'AgreePerson',
  props: {
    id: Number,
    name: String,
    avatar: String,
    likedAt: Number
  },
  computed: {
      duration() {
        if (!this.likedAt) {
            return "加载中..."
        } 

        let now = moment();  
        let createdAt = moment(this.likedAt * 1000);
        let diff = moment.duration(now.diff(createdAt));
        if (diff.asDays() > 10) {
            return createdAt.format('YYYY-MM-DD')
        } else if (diff.asHours() >= 24) {
            return `${parseInt(diff.asDays())} 天前`
        } else if (diff.asMinutes() >= 60) {
            return `${parseInt(diff.asHours())} 小时前`
        } else if (diff.asSeconds() >= 60) {
            return `${parseInt(diff.asMinutes())} 分钟前`
        } else if (diff.asSeconds() > 0) {
            return `${parseInt(diff.asSeconds())} 秒前`
        } else {
            return "刚刚";
        }
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