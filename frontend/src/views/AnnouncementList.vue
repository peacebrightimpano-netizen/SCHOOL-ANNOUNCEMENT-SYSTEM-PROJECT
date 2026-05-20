<template>
  <div>
    <Navbar />
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white mb-1">All Announcements</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ filtered.length }} announcement{{ filtered.length !== 1 ? 's' : '' }} found</p>
      </div>

      <!-- Search + Filters -->
      <div class="flex flex-wrap gap-3 mb-8 items-center">

        <!-- Search -->
        <div class="relative flex-1 min-w-64">
          <input
            v-model="search"
            type="text"
            placeholder="Search announcements..."
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pl-10 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <!-- Filters -->
        <button
          v-for="f in filters" :key="f.value"
          @click="active = f.value"
          :class="active === f.value
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'"
          class="px-4 py-2 rounded-full text-sm font-medium border transition-colors"
        >
          {{ f.label }}
        </button>

        <!-- Sort -->
        <select v-model="sortBy" class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="date">Sort by Date</option>
          <option value="importance">Sort by Priority</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl h-72 animate-pulse"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-8 text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button @click="load" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Try Again</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!filtered.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-16 text-center">
        <p class="text-4xl mb-4">🔍</p>
        <p class="text-gray-500 dark:text-gray-400">No announcements found for this search.</p>
        <button @click="search=''; active='all'" class="mt-4 text-indigo-600 text-sm hover:underline">Clear filters</button>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnouncementCard v-for="a in filtered" :key="a.id" :announcement="a" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import AnnouncementCard from '../components/AnnouncementCard.vue'
import api from '../api/axios'

const announcements = ref([])
const loading = ref(true)
const error = ref('')
const active = ref('all')
const sortBy = ref('date')
const search = ref('')

const filters = [
  { label: 'All', value: 'all' },
  { label: '🔴 High', value: 'high' },
  { label: '🟡 Medium', value: 'medium' },
  { label: '🟢 Low', value: 'low' },
]

const impOrder = { high: 0, medium: 1, low: 2 }

const filtered = computed(() => {
  let list = announcements.value

  // Search filter
  if (search.value) {
    list = list.filter(a =>
      a.title.toLowerCase().includes(search.value.toLowerCase()) ||
      a.content.toLowerCase().includes(search.value.toLowerCase()) ||
      a.category_name.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // Priority filter
  if (active.value !== 'all') {
    list = list.filter(a => a.importance === active.value)
  }

  // Sort
  if (sortBy.value === 'importance') {
    list = [...list].sort((a, b) => impOrder[a.importance] - impOrder[b.importance])
  }

  return list
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/announcements')
    announcements.value = res.data
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>