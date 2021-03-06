import Vue from 'vue'
import router from './router'
import App from './main.vue'

Vue.config.productionTip = false

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
