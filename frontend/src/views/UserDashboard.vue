<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="max-w-5xl mx-auto px-6 py-10">

      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-indigo-200 text-sm mb-2">👋 Welcome back</p>
            <h1 class="text-3xl font-bold mb-1">{{ auth.user?.name }}</h1>
            <p class="text-indigo-200 text-sm capitalize">
              {{ auth.user?.profession }}
              {{ auth.user?.level ? '· Level ' + auth.user?.level.toUpperCase() : '' }}
            </p>
          </div>
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 text-xs">👤</span>
          My Profile
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Full Name</p>
            <p class="font-medium text-gray-900">{{ auth.user?.name }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <p class="font-medium text-gray-900 text-sm truncate">{{ auth.user?.email }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Profession</p>
            <p class="font-medium text-gray-900 capitalize">{{ auth.user?.profession?.replace('_', ' ') }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Level</p>
            <p class="font-medium text-gray-900">{{ auth.user?.level ? auth.user?.level.toUpperCase() : 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-indigo-600 text-lg">📢</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ announcements.length }}</p>
          <p class="text-xs text-gray-400 mt-1">My Announcements</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-red-600 text-lg">🔴</span>
          </div>
          <p class="text-2xl font-bold text-red-500">{{ count('high') }}</p>
          <p class="text-xs text-gray-400 mt-1">Urgent</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-green-600 text-lg">📅</span>
          </div>
          <p class="text-2xl font-bold text-green-500">{{ thisMonth }}</p>
          <p class="text-xs text-gray-400 mt-1">This Month</p>
        </div>
      </div>

      <!-- My Announcements -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900 flex items-center gap-2">
            <span class="text-indigo-600">📋</span>
            Announcements For Me
          </h2>
          <router-link to="/announcements" class="text-xs text-indigo-600 hover:underline font-medium">
            View all →
          </router-link>
        </div>

        <div v-if="loading" class="p-10 text-center text-gray-400">
          <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading your announcements...
        </div>

        <div v-else-if="!announcements.length" class="p-16 text-center">
          <p class="text-5xl mb-4">📭</p>
          <p class="text-gray-500 font-medium">No announcements for you yet</p>
          <p class="text-gray-400 text-sm mt-1">Check back later for updates</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="a in announcements"
            :key="a.id"
            @click="router.push(`/announcements/${a.id}`)"
            class="px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <!-- Priority indicator -->
              <div :class="{
                'bg-red-100': a.importance === 'high',
                'bg-amber-100': a.importance === 'medium',
                'bg-green-100': a.importance === 'low'
              }" class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span v-if="a.importance === 'high'" class="text-red-600">🔴</span>
                <span v-else-if="a.importance === 'medium'" class="text-amber-600">🟡</span>
                <span v-else class="text-green-600">🟢</span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span :class="{
                    'bg-red-100 text-red-600': a.importance === 'high',
                    'bg-amber-100 text-amber-600': a.importance === 'medium',
                    'bg-green-100 text-green-600': a.importance === 'low'
                  }" class="text-xs font-medium px-2 py-0.5 rounded-full">{{ a.importance }}</span>
                  <span class="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{{ a.category_name }}</span>
                </div>
                <p class="font-semibold text-gray-900 mb-1">{{ a.title }}</p>
                <p class="text-sm text-gray-400 line-clamp-1">{{ a.content }}</p>
                <p class="text-xs text-gray-300 mt-2">📅 {{ formatDate(a.created_at) }}</p>
              </div>

              <span class="text-indigo-400 text-sm font-medium flex-shrink-0">Read →</span>
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
import Navbar from '../components/Navbar.vue'
import api from '../api/axios'

const router = useRouter()
const auth = useAuthStore()
const announcements = ref([])
const loading = ref(true)

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function count(imp) {
  return announcements.value.filter(a => a.importance === imp).length
}

const thisMonth = computed(() => {
  const now = new Date()
  return announcements.value.filter(a => {
    const d = new Date(a.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
})

async function load() {
  loading.value = true
  try {
    const res = await api.get('/announcements')
    announcements.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>