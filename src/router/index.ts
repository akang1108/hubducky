import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/auth',
    component: AuthView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
