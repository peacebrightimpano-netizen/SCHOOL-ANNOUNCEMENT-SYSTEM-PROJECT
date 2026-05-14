<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <span class="font-semibold text-gray-900 dark:text-white text-lg">SchoolNotice</span>
          <span class="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin</span>
        </div>
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Home</router-link>
          <router-link to="/admin" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Manage</router-link>
          <router-link to="/announcements" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Announcements</router-link>
          <button @click="handleLogout" class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {{ auth.user?.name }}! Here's your full overview.</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 animate-pulse h-24"></div>
      </div>

      <!-- Stats -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Announcements</p>
          <p class="text-3xl font-semibold text-gray-900 dark:text-white">{{ announcements.length }}</p>
          <p class="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Users</p>
          <p class="text-3xl font-semibold text-indigo-600">{{ users.length }}</p>
          <p class="text-xs text-gray-400 mt-1">Registered</p>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Online Now</p>
          <p class="text-3xl font-semibold text-green-500">{{ onlineUsers }}</p>
          <p class="text-xs text-gray-400 mt-1">Active users</p>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">This Month</p>
          <p class="text-3xl font-semibold text-amber-500">{{ stats.thisMonth }}</p>
          <p class="text-xs text-gray-400 mt-1">New announcements</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <!-- Users by Profession -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-6">👥 Users by Profession</h2>
          <div class="space-y-4">
            <div v-for="p in professions" :key="p.name">
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-gray-700 dark:text-gray-300 capitalize font-medium">{{ p.name.replace('_', ' ') }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{ p.count }} {{ p.count === 1 ? 'user' : 'users' }}</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  :class="p.color"
                  class="h-2.5 rounded-full transition-all duration-500"
                  :style="`width: ${users.length ? (p.count/users.length)*100 : 0}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Announcements by Priority -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-6">📊 Announcements by Priority</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-red-600 font-medium">🔴 High Priority</span>
                <span class="text-gray-500">{{ stats.high }} announcements</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-red-500 h-2.5 rounded-full transition-all duration-500" :style="`width: ${announcements.length ? (stats.high/announcements.length)*100 : 0}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-amber-600 font-medium">🟡 Medium Priority</span>
                <span class="text-gray-500">{{ stats.medium }} announcements</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-amber-500 h-2.5 rounded-full transition-all duration-500" :style="`width: ${announcements.length ? (stats.medium/announcements.length)*100 : 0}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-green-600 font-medium">🟢 Low Priority</span>
                <span class="text-gray-500">{{ stats.low }} announcements</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-green-500 h-2.5 rounded-full transition-all duration-500" :style="`width: ${announcements.length ? (stats.low/announcements.length)*100 : 0}%`"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Users Activity Table -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900 dark:text-white">👤 User Activity — Login & Logout Times</h2>
          <span class="text-xs text-gray-400">{{ users.length }} total users</span>
        </div>

        <div v-if="loading" class="p-6 text-center text-gray-400">Loading...</div>
        <div v-else-if="!users.length" class="p-6 text-center text-gray-400">No users yet.</div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Profession</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Last Logout</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Registered</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
              <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-sm flex-shrink-0">
                      {{ u.name?.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ u.name }}</p>
                      <p class="text-xs text-gray-400">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                    {{ u.profession?.replace('_', ' ') }} {{ u.level ? '· ' + u.level.toUpperCase() : '' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span v-if="u.is_online" class="flex items-center gap-1.5">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span class="text-green-600 text-xs font-medium">Online</span>
                  </span>
                  <span v-else class="flex items-center gap-1.5">
                    <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span class="text-gray-400 text-xs font-medium">Offline</span>
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                  {{ u.last_login ? formatDateTime(u.last_login) : '—' }}
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                  {{ u.last_logout ? formatDateTime(u.last_logout) : '—' }}
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                  {{ formatDateTime(u.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Announcements -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900 dark:text-white">📢 Recent Announcements</h2>
          <router-link to="/admin" class="text-xs text-indigo-600 hover:underline font-medium">Manage all</router-link>
        </div>
        <div v-if="loading" class="p-6 text-center text-gray-400">Loading...</div>
        <div v-else-if="!announcements.length" class="p-6 text-center text-gray-400">No announcements yet.</div>
        <div v-else>
          <div
            v-for="a in announcements.slice(0, 5)"
            :key="a.id"
            @click="$router.push(`/announcements/${a.id}`)"
            class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">{{ a.title }}</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ formatDateTime(a.created_at) }} · {{ a.category_name }} ·
                  <span class="capitalize">{{ a.target_audience }}</span>
                </p>
              </div>
              <span :class="{
                'bg-red-100 text-red-600': a.importance === 'high',
                'bg-amber-100 text-amber-600': a.importance === 'medium',
                'bg-green-100 text-green-600': a.importance === 'low'
              }" class="text-xs font-medium px-2.5 py-0.5 rounded-full ml-3 flex-shrink-0">{{ a.importance }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/axios'

const router = useRouter()
const auth = useAuthStore()
const announcements = ref([])
const users = ref([])
const loading = ref(true)

async function handleLogout() {
  await auth.logout()
  router.push('/')
}

function formatDateTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const onlineUsers = computed(() => users.value.filter(u => u.is_online).length)

const stats = computed(() => {
  const now = new Date()
  const thisMonth = announcements.value.filter(a => {
    const d = new Date(a.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return {
    total: announcements.value.length,
    high: announcements.value.filter(a => a.importance === 'high').length,
    medium: announcements.value.filter(a => a.importance === 'medium').length,
    low: announcements.value.filter(a => a.importance === 'low').length,
    thisMonth
  }
})

const professions = computed(() => {
  const list = [
    { name: 'student', color: 'bg-indigo-500' },
    { name: 'teacher', color: 'bg-green-500' },
    { name: 'staff', color: 'bg-amber-500' },
    { name: 'dean', color: 'bg-red-500' },
    { name: 'discipline_prefect', color: 'bg-purple-500' },
  ]
  return list.map(p => ({
    ...p,
    count: users.value.filter(u => u.profession === p.name).length
  }))
})

async function load() {
  loading.value = true
  try {
    const [announcementsRes, usersRes] = await Promise.all([
      api.get('/announcements'),
      api.get('/announcements/users')
    ])
    announcements.value = announcementsRes.data
    users.value = usersRes.data
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>