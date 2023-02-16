import Vue from 'vue'
import VueRouter from 'vue-router'
import Business from './pages/business'
import User from './pages/user'
// import { Dialog, Button, ButtonGroup, Image, Row, Col } from 'element-ui';

// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Image);
// Vue.use(Dialog);
// Vue.use(Button);
// Vue.use(ButtonGroup);

Vue.use(VueRouter)

const routes = [
  {
    path: '/profile/business/:id',
    component: Business
  },
  {
    path: '/profile/user/:id',
    component: User
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
