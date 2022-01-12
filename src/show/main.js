import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import App from './main.vue'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
