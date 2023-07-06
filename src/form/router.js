import Vue from 'vue'
import VueRouter from 'vue-router'
import Track from './main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/track/:id',
    name: 'Track',
    component: Track
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
