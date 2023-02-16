<template>
  <div>
    <div v-html="showContent" ></div>
    <a href="#" @click.prevent="toggleExpanded" v-if="showReadMoreButton(textNumber)">{{ expanded ? '收起' : '更多' }}</a>
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
      
      showContent: ""
    };
  },
  created() {
    this.showContent = this.truncateHTML(this.text,this.textNumber);
  },
  filters: {
    
  },
  computed: {
  
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        this.showContent = this.text;
      }else {
        this.showContent = this.truncateHTML(this.text,120);
      }
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