import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AnnouncementList from '../views/AnnouncementList.vue'
import AnnouncementDetail from '../views/AnnouncementDetail.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import ProfilePage from '../views/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/announcements', component: AnnouncementList },
    { path: '/announcements/:id', component: AnnouncementDetail },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    {
      path: '/profile',
      component: ProfilePage,
      beforeEnter: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) return '/login'
      }
    },
    {
      path: '/dashboard',
      component: UserDashboard,
      beforeEnter: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) return '/login'
        if (user.role === 'admin') return '/admin-dashboard'
      }
    },
    {
      path: '/admin-dashboard',
      component: AdminDashboard,
      beforeEnter: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user || user.role !== 'admin') return '/'
      }
    },
  ],
  scrollBehavior() { return { top: 0 } }
})

export default router