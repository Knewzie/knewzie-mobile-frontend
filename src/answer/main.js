import Vue from 'vue'
import router from '../router'
import AnswerDetail from './AnswerDetail.vue'

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(AnswerDetail)
}).$mount('#app')
