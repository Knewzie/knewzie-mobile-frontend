<template>
  <div>
    <div v-html="showContent" ></div>
    <div class="collapse-tool" v-if="showReadMore">
      <a href="#" style="color: #6599ff;" @click.prevent="toggleExpanded" >{{ expanded ? '收起' : '更多' }}</a>
      <img v-if="!expanded" src="/img/bx-chevron-down.png"  style="width: 13px;"/>
      <img v-if="expanded" src="/img/bx-chevron-up.png" style="width: 13px;"/>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    textNumber: Number
  },
  data() {
    return {
      expanded: false,
      showReadMore: false,
      showContent: ""
    };
  },
  mounted() {
    
  },
  filters: {
    
  },
  watch: {
    text(newV){
      this.showContent = this.truncateHTML(newV,this.textNumber);
      this.showReadMore = this.showReadMoreButton(this.textNumber);
    }
  },
  methods: {
    toggleExpanded() {
      this.$emit("onClickCall");
      // this.expanded = !this.expanded;
      // if (this.expanded) {
      //   this.showContent = this.text;
      // }else {
      //   this.showContent = this.truncateHTML(this.text,120);
      // }
    },
    truncateHTML(value, length) {
      const div = document.createElement("div");
      div.innerHTML = value;
      
      const text = div.textContent || div.innerText || "";
      console.log("div.text ====" + text.length);
      if (text.length > length) {
        console.log("div.innerHTML ====" + div.innerHTML.substring(0, length) + '...');
        return div.innerHTML.substring(0, length) + '...';
      }
      console.log("div.innerHTML2 ====" + div.innerHTML);
      return div.innerHTML;
    },
    showReadMoreButton( length) {
      const div = document.createElement("div");
      div.innerHTML = this.text;
      
      const text = div.textContent || div.innerText || "";
      
      if (text.length > length) {
        return true;
      }
      
      return false;
    }
  }
};
</script>

<style>
.collapse-tool{
  display: flex;
  align-items: center;
}
</style>