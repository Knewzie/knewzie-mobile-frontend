import Vue from 'vue'
import VueRouter from 'vue-router'
import Topic from './main.vue'
import { Dialog, Button, ButtonGroup, Image, Row, Col } from 'element-ui';

Vue.use(Dialog);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Image);
Vue.use(VueRouter)

const routes = [
  {
    path: '/topic/:id',
    name: 'Topic',
    component: Topic
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
