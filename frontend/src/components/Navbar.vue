<template>
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Brand -->
      <router-link to="/" class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
        <span class="font-semibold text-gray-900 dark:text-white text-lg">SchoolNotice</span>
      </router-link>

      <!-- Links -->
      <div class="flex items-center gap-1">
        <router-link to="/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Home</router-link>
        <router-link to="/announcements" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Announcements</router-link>

        <!-- User dashboard -->
        <router-link
          v-if="auth.isLoggedIn && !auth.isAdmin"
          to="/dashboard"
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          My Dashboard
        </router-link>

        <!-- Admin links -->
        <router-link
          v-if="auth.isLoggedIn && auth.isAdmin"
          to="/admin-dashboard"
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </router-link>
        <router-link
          v-if="auth.isLoggedIn && auth.isAdmin"
          to="/admin"
          class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
        >
          Admin Panel
        </router-link>

        <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2"></div>

        <!-- Dark mode toggle -->
        <button
          @click="theme.toggle()"
          class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :title="theme.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <span v-if="theme.dark">☀️</span>
          <span v-else>🌙</span>
        </button>

        <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2"></div>

        <!-- Logged in -->
        <div v-if="auth.isLoggedIn" class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {{ auth.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white leading-tight">{{ auth.user?.name }}</p>
              <p class="text-xs text-gray-400 capitalize leading-tight">
                {{ auth.user?.profession }}
                {{ auth.user?.level ? '· ' + auth.user?.level.toUpperCase() : '' }}
              </p>
            </div>
          </div>
          <button @click="handleLogout" class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Logout
          </button>
        </div>

        <!-- Not logged in -->
        <div v-else class="flex items-center gap-2">
          <router-link to="/register" class="bg-white dark:bg-gray-800 text-indigo-600 border border-indigo-300 dark:border-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            Register
          </router-link>
          <router-link to="/login" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Login
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>