import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]

/**
 * Using hash history to allow app to be able to run without a web server
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
