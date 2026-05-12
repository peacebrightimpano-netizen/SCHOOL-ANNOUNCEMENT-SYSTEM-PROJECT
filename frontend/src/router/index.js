import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AnnouncementList from '../views/AnnouncementList.vue'
import AnnouncementDetail from '../views/AnnouncementDetail.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import AdminPanel from '../views/AdminPanel.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/announcements', component: AnnouncementList },
    { path: '/announcements/:id', component: AnnouncementDetail },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    {
      path: '/admin',
      component: AdminPanel,
      beforeEnter: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        // Redirect to home if not admin
        if (!user || user.role !== 'admin') return '/'
      }
    },
  ],
  scrollBehavior() { return { top: 0 } }
})

export default router