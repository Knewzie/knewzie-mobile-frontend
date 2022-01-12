import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  el: '#app'
})
