import Vue from 'vue'
import App from './main.vue'
import router from './router'

import { Dialog,Button,ButtonGroup } from 'element-ui';

Vue.use(Dialog);
Vue.use(Button);
Vue.use(ButtonGroup);

Vue.config.productionTip = false
Vue.config.ignoredElements = ['wx-open-launch-app'];

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
