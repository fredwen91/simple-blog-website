import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/my-posts',
      name: 'myPosts',
      component: () => import('../views/Posts.vue'),
      meta: { requiresAuth: true, title: 'My Posts' },
    },
    {
      path: '/:catchAll(.*)*',
      name: 'pageNotFound',
      component: () => import('../views/PageNotFound.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuthStore()

  if (to.meta.guest && isAuthenticated) {
    return { name: 'home' }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  return true
})

export default router
