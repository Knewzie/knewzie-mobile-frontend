import Vue from 'vue'
import VueRouter from 'vue-router'
import Activity from './main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/activity_mobile/:id',
    name: 'Activity',
    component: Activity
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
