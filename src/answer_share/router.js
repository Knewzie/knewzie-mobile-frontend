import Vue from 'vue'
import VueRouter from 'vue-router'
import Page from './AnswerDetail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/reply/:replyId/topic/:topicId',
    name: 'Reply',
    component: Page
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
