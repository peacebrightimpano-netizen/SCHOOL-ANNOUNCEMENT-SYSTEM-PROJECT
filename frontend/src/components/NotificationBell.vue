<template>
  <div class="relative">
    <!-- Bell Button -->
    <button
      @click="toggleOpen"
      class="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      🔔
      <!-- Badge -->
      <span
        v-if="unread > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
      >
        {{ unread > 9 ? '9+' : unread }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
        <button @click="markAllRead" class="text-xs text-indigo-600 hover:underline">Mark all read</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-4 text-center text-gray-400 text-sm">Loading...</div>

      <!-- Empty -->
      <div v-else-if="!notifications.length" class="p-8 text-center">
        <p class="text-2xl mb-2">🔕</p>
        <p class="text-gray-400 text-sm">No new notifications</p>
      </div>

      <!-- Notifications -->
      <div v-else class="max-h-80 overflow-y-auto">
        <div
          v-for="n in notifications"
          :key="n.id"
          @click="openAnnouncement(n.id)"
          class="px-4 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          :class="!n.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''"
        >
          <div class="flex items-start gap-3">
            <span :class="{
              'bg-red-100 text-red-600': n.importance === 'high',
              'bg-amber-100 text-amber-600': n.importance === 'medium',
              'bg-green-100 text-green-600': n.importance === 'low'
            }" class="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
              {{ n.importance }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ n.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(n.created_at) }}</p>
            </div>
            <span v-if="!n.read" class="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1"></span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-center">
        <router-link to="/announcements" @click="open=false" class="text-xs text-indigo-600 hover:underline font-medium">
          View all announcements →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()
const open = ref(false)
const loading = ref(false)
const notifications = ref([])
const readIds = ref(JSON.parse(localStorage.getItem('readNotifications') || '[]'))

const unread = computed(() => notifications.value.filter(n => !readIds.value.includes(n.id)).length)

function toggleOpen() {
  open.value = !open.value
  if (open.value) load()
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  try {
    const res = await api.get('/announcements')
    notifications.value = res.data.slice(0, 10).map(n => ({
      ...n,
      read: readIds.value.includes(n.id)
    }))
  } finally {
    loading.value = false
  }
}

function markAllRead() {
  const ids = notifications.value.map(n => n.id)
  readIds.value = [...new Set([...readIds.value, ...ids])]
  localStorage.setItem('readNotifications', JSON.stringify(readIds.value))
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}

function openAnnouncement(id) {
  readIds.value = [...new Set([...readIds.value, id])]
  localStorage.setItem('readNotifications', JSON.stringify(readIds.value))
  open.value = false
  router.push(`/announcements/${id}`)
}

// Close when clicking outside
function handleClickOutside(e) {
  if (!e.target.closest('.relative')) open.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  load()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>