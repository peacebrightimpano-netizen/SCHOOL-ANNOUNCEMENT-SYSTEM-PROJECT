<template>
  <div>
    <Navbar />
    <!-- Hero Section -->
    <div class="relative overflow-hidden" style="min-height: 500px;">
      <!-- Background Image -->
      <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80"
        alt="School" class="absolute inset-0 w-full h-full object-cover" />
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-indigo-900/70"></div>

      <!-- Content -->
      <div class="relative max-w-7xl mx-auto px-6 py-24 flex items-center justify-between gap-12">

        <!-- Left Text -->
        <div class="flex-1">
          <p class="text-indigo-300 text-xs font-medium tracking-widest uppercase mb-4">📢 Official School Portal</p>
          <h1 class="text-5xl font-bold text-white leading-tight mb-4">
            Stay Informed,<br>Stay Ahead.
          </h1>
          <p class="text-indigo-100 text-lg max-w-xl mb-8">
            Your central hub for all school announcements, updates, and important notices. Never miss an important
            update again.
          </p>
          <div class="flex gap-3 flex-wrap">
            <router-link to="/announcements"
              class="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors shadow-lg">
              Browse Announcements →
            </router-link>
            <router-link v-if="auth.isLoggedIn" :to="auth.isAdmin ? '/admin-dashboard' : '/dashboard'"
              class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors border border-indigo-400">
              My Dashboard
            </router-link>
            <router-link v-else to="/register"
              class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors border border-indigo-400">
              Get Started
            </router-link>
          </div>
        </div>

        <!-- Right Stats Box -->
        <div class="hidden lg:flex flex-col gap-4 flex-shrink-0">
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white text-center">
            <p class="text-4xl font-bold mb-1">📢</p>
            <p class="text-2xl font-bold">School</p>
            <p class="text-indigo-200 text-sm">Announcement System</p>
          </div>
          <div
            class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white flex items-center gap-3">
            <span class="text-2xl">🎓</span>
            <div>
              <p class="font-semibold text-sm">Students</p>
              <p class="text-indigo-200 text-xs">L3, L4, L5</p>
            </div>
          </div>
          <div
            class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white flex items-center gap-3">
            <span class="text-2xl">👨‍🏫</span>
            <div>
              <p class="font-semibold text-sm">Teachers & Staff</p>
              <p class="text-indigo-200 text-xs">Stay connected</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Logged in user welcome card -->
    <div v-if="auth.isLoggedIn" class="max-w-7xl mx-auto px-6 mt-8">
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">Welcome back, {{ auth.user?.name }}! 👋</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {{ auth.user?.profession?.replace('_', ' ') }}
              {{ auth.user?.level ? '· ' + auth.user?.level.toUpperCase() : '' }}
              · {{ auth.user?.email }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <router-link :to="auth.isAdmin ? '/admin-dashboard' : '/dashboard'"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            My Dashboard
          </router-link>
          <button @click="handleLogout"
            class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Not logged in banner -->
    <div v-else class="max-w-7xl mx-auto px-6 mt-8">
      <div
        class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p class="font-semibold text-indigo-900 dark:text-indigo-300">Create an account to see personalized
            announcements!</p>
          <p class="text-sm text-indigo-600 dark:text-indigo-400 mt-1">Register to see announcements meant specifically
            for you.</p>
        </div>
        <div class="flex gap-3">
          <router-link to="/register"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Register
          </router-link>
          <router-link to="/login"
            class="bg-white dark:bg-gray-800 text-indigo-600 border border-indigo-300 dark:border-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            Login
          </router-link>
        </div>
      </div>
    </div>

    <!-- Announcements -->
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ auth.isLoggedIn ? 'Your Announcements' : 'Latest Announcements' }}
        </h2>
        <router-link to="/announcements"
          class="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">View all
          →</router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl h-72 animate-pulse">
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button @click="load" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Try Again</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!announcements.length"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-16 text-center">
        <p class="text-4xl mb-4">📭</p>
        <p class="text-gray-500 dark:text-gray-400">No announcements available for you at this time.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnouncementCard v-for="a in announcements" :key="a.id" :announcement="a" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 mt-10">
      <div class="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S
          </div>
          <span class="text-white font-semibold">SchoolNotice</span>
        </div>
        <p class="text-sm">© 2025 SchoolNotice. All rights reserved.</p>
        <div class="flex gap-4 text-sm">
          <router-link to="/" class="hover:text-white transition-colors">Home</router-link>
          <router-link to="/announcements" class="hover:text-white transition-colors">Announcements</router-link>
          <router-link to="/login" class="hover:text-white transition-colors">Login</router-link>
          <router-link to="/register" class="hover:text-white transition-colors">Register</router-link>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Navbar from '../components/Navbar.vue'
import AnnouncementCard from '../components/AnnouncementCard.vue'
import api from '../api/axios'

const router = useRouter()
const auth = useAuthStore()
const announcements = ref([])
const loading = ref(true)
const error = ref('')

async function handleLogout() {
  await auth.logout()
  router.push('/')
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/announcements')
    announcements.value = res.data.slice(0, 6)
  } catch {
    error.value = 'Network error. Make sure backend is running.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>