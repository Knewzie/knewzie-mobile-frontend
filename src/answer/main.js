import Vue from 'vue'
import AnswerDetail from './AnswerDetail.vue'
import router from "./router";

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(AnswerDetail)
}).$mount('#app')
