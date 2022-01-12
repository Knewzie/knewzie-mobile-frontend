import Vue from 'vue'
import VueRouter from 'vue-router'
import ShowImage from './pages/image'
import ShowVideo from './pages/video'

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
