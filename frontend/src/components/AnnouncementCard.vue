<template>
  <router-link :to="`/announcements/${announcement.id}`" class="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:-translate-y-1 transition-all duration-200 group">

    <!-- Image -->
    <div class="h-44 overflow-hidden relative">
      <img
        v-if="announcement.image_url"
        :src="announcement.image_url"
        :alt="announcement.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <img
        v-else
        :src="defaultImage"
        alt="Announcement"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <div class="flex items-center gap-2 mb-3 flex-wrap">
        <span :class="{
          'bg-red-100 text-red-600': announcement.importance === 'high',
          'bg-amber-100 text-amber-600': announcement.importance === 'medium',
          'bg-green-100 text-green-600': announcement.importance === 'low'
        }" class="text-xs font-medium px-2.5 py-0.5 rounded-full">{{ announcement.importance }}</span>
        <span class="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ announcement.category_name }}</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
        {{ announcement.title }}
      </h3>
      <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">
        {{ announcement.content }}
      </p>
    </div>

    <!-- Footer -->
    <div class="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
      <span class="text-xs text-gray-400">{{ formatDate(announcement.created_at) }}</span>
      <span class="text-xs text-indigo-600 font-medium">Read more →</span>
    </div>

  </router-link>
</template>

<script setup>
defineProps({ announcement: Object })

const defaultImage = 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=60'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>