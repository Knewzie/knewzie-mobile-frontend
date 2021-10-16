import Vue from 'vue'
import VueRouter from 'vue-router'
import Topic from './main.vue'

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
