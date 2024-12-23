import { createRouter, createWebHashHistory } from 'vue-router'
import ConnectionView from '../views/ConnectionView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'connection',
      component: ConnectionView,
    },
  ],
})

export default router
