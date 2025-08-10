import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/teachers',
      name: 'Teachers',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Teachers/Teachers.vue'),
    },
    {
      path: '/teachers/:id',
      name: 'Teachers Id View',
      component: () => import('../views/Teachers/TeacherIdView.vue'),
    },
    {
      path: '/application',
      name: 'Applications',
      component: () => import('../views/Applications/ApplicationsView.vue'),
    },
    {
      path: '/groups',
      name: 'Groups',
      component: () => import('../views/Groups/GroupsView.vue'),
    },
    {
      path: '/balance',
      name: 'Balance',
      component: () => import('../views/Balance/BalanceView.vue'),
    },
    {
      path: '/expense',
      name: 'Expense',
      component: () => import('../views/Expense/ExpenseView.vue'),
    },
    {
      path: '/group/:slug',
      name: 'Group Id View',
      component: () => import('../views/Groups/GroupIdView.vue'),
    },
    {
      path: '/group/:slug/student/:id',
      name: 'Student Id View',
      component: () => import('../views/Students/StudentIdView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        layout: AuthLayout,
      },
    },
  ],
})

export default router
