<template>
  <div>
    <Navbar />
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-display text-3xl font-semibold text-white mb-1">All Announcements</h1>
        <p class="text-gray-500 text-sm">{{ filtered.length }} announcement{{ filtered.length !== 1 ? 's' : '' }} found</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-8 items-center">
        <button
          v-for="f in filters" :key="f.value"
          @click="active = f.value"
          :class="active === f.value
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'"
          class="px-4 py-2 rounded-full text-sm font-medium border transition-colors"
        >
          {{ f.label }}
        </button>

        <select v-model="sortBy" class="ml-auto input-field w-auto text-sm px-4 py-2">
          <option value="date">Sort by Date</option>
          <option value="importance">Sort by Priority</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-gray-900 border border-gray-800 rounded-xl h-72 animate-pulse"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button @click="load" class="btn-ghost">Try Again</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!filtered.length" class="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
        <p class="text-4xl mb-4">🔍</p>
        <p class="text-gray-500">No announcements found for this filter.</p>
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

const filters = [
  { label: 'All', value: 'all' },
  { label: '🔴 High', value: 'high' },
  { label: '🟡 Medium', value: 'medium' },
  { label: '🟢 Low', value: 'low' },
]

const impOrder = { high: 0, medium: 1, low: 2 }

const filtered = computed(() => {
  let list = active.value === 'all' ? announcements.value : announcements.value.filter(a => a.importance === active.value)
  if (sortBy.value === 'importance') list = [...list].sort((a, b) => impOrder[a.importance] - impOrder[b.importance])
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