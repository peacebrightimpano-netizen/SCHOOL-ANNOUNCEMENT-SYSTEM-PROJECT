<template>
  <div>
    <Navbar />
    <div class="max-w-3xl mx-auto px-6 py-10">

      <router-link to="/announcements" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
        ← Back to Announcements
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="bg-gray-900 border border-gray-800 rounded-xl p-10 animate-pulse">
        <div class="h-48 bg-gray-800 rounded-lg mb-6"></div>
        <div class="h-8 bg-gray-800 rounded w-2/3 mb-4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-800 rounded"></div>
          <div class="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="announcement" class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

        <!-- Image -->
        <div class="h-64 bg-gray-800 flex items-center justify-center overflow-hidden">
          <img v-if="announcement.image_url" :src="announcement.image_url" :alt="announcement.title" class="w-full h-full object-cover" />
          <span v-else class="text-5xl text-gray-600">📢</span>
        </div>

        <div class="p-8">
          <!-- Badges -->
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span :class="`badge-${announcement.importance}`">● {{ announcement.importance }} priority</span>
            <span class="badge-cat">{{ announcement.category_name }}</span>
          </div>

          <!-- Title -->
          <h1 class="font-display text-3xl font-semibold text-white leading-tight mb-4">
            {{ announcement.title }}
          </h1>

          <!-- Meta -->
          <div class="flex flex-wrap gap-4 text-xs text-gray-500 pb-6 mb-6 border-b border-gray-800">
            <span>📅 {{ formatDate(announcement.created_at) }}</span>
            <span>👤 {{ announcement.created_by_name || 'Admin' }}</span>
          </div>

          <!-- Body -->
          <div class="text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
            {{ announcement.content }}
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
        <p class="text-4xl mb-4">❌</p>
        <p class="text-gray-500">Announcement not found.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import api from '../api/axios'

const route = useRoute()
const announcement = ref(null)
const loading = ref(true)

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await api.get(`/announcements/${route.params.id}`)
    announcement.value = res.data
  } finally {
    loading.value = false
  }
})
</script>