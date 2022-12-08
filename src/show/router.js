import Vue from 'vue'
import VueRouter from 'vue-router'
import ShowImage from './pages/image'
import ShowVideo from './pages/video'
import { Dialog,Button,ButtonGroup } from 'element-ui';

Vue.use(Dialog);
Vue.use(Button);
Vue.use(ButtonGroup);

Vue.use(VueRouter)

const routes = [
  {
    path: '/show/image/:id',
    component: ShowImage
  },
  {
    path: '/show/video/:id',
    component: ShowVideo
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
