import Vue from 'vue'
import VueRouter from 'vue-router'
import Image from './pages/image'
import Video from './pages/video'

Vue.use(VueRouter)

const routes = [
  {
    path: '/show/image/:id',
    name: 'image',
    component: Image
  },
  {
    path: '/show/video/:id',
    name: 'video',
    component: Video
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
