<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Top Navbar -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <span class="font-semibold text-gray-900 text-lg">SchoolNotice</span>
          <span class="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">👤 {{ auth.user?.name }}</span>
          <router-link to="/" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">View Site</router-link>
          <button @click="handleLogout" class="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Admin Panel</h1>
          <p class="text-gray-500 text-sm mt-1">Create, edit, view and delete school announcements</p>
        </div>
        <button @click="openAdd" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <span class="text-lg leading-none">+</span>
          Add Announcement
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p class="text-3xl font-semibold text-gray-900">{{ announcements.length }}</p>
          <p class="text-xs text-gray-400 uppercase tracking-wide mt-1">Total Announcements</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p class="text-3xl font-semibold text-indigo-600">{{ users.length }}</p>
          <p class="text-xs text-gray-400 uppercase tracking-wide mt-1">Registered Users</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p class="text-3xl font-semibold text-red-500">{{ count('high') }}</p>
          <p class="text-xs text-gray-400 uppercase tracking-wide mt-1">High Priority</p>
        </div>
      </div>

      <!-- Filter by Category -->
      <div class="flex flex-wrap gap-3 mb-6">
        <button
          v-for="cat in ['All', ...categories]" :key="cat"
          @click="selectedCategory = cat"
          :class="selectedCategory === cat
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
          class="px-4 py-2 rounded-full text-sm font-medium border transition-colors"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-medium text-gray-900">Announcements</h2>
          <span class="text-sm text-gray-400">{{ filteredAnnouncements.length }} found</span>
        </div>

        <div v-if="loading" class="p-10 text-center text-gray-400">Loading...</div>

        <div v-else-if="!filteredAnnouncements.length" class="p-16 text-center">
          <p class="text-4xl mb-3">📭</p>
          <p class="text-gray-400 mb-4">No announcements found.</p>
          <button @click="openAdd" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            + Add First Announcement
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Target</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="a in filteredAnnouncements" :key="a.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{{ a.title }}</td>
                <td class="px-6 py-4">
                  <span class="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ a.category_name }}</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="{
                    'bg-red-100 text-red-600': a.importance === 'high',
                    'bg-amber-100 text-amber-600': a.importance === 'medium',
                    'bg-green-100 text-green-600': a.importance === 'low'
                  }" class="text-xs font-medium px-2.5 py-0.5 rounded-full">{{ a.importance }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">{{ a.target_audience }}</span>
                </td>
                <td class="px-6 py-4 text-gray-400">{{ formatDate(a.created_at) }}</td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button @click="viewDetail(a)" class="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                      👁️ View
                    </button>
                    <button @click="openEdit(a)" class="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">
                      ✏️ Edit
                    </button>
                    <button @click="remove(a.id)" class="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6 text-center">
        <router-link to="/" class="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← Back to main site
        </router-link>
      </div>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div v-if="modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="modal=false">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ editing ? '✏️ Edit Announcement' : '+ Add Announcement' }}
          </h2>
          <button @click="modal=false" class="text-gray-400 hover:text-gray-700 text-xl transition-colors">✕</button>
        </div>

        <div class="px-7 py-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
            <input v-model="form.title" type="text" placeholder="Enter announcement title" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Content <span class="text-red-500">*</span></label>
            <textarea v-model="form.content" placeholder="Write the full announcement here..." rows="4" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Category <span class="text-red-500">*</span></label>
              <select v-model="form.category_id" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="">Select category</option>
                <option value="1">General</option>
                <option value="2">Academic</option>
                <option value="3">Events</option>
                <option value="4">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select v-model="form.importance" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <!-- Target Audience -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Who can see this? <span class="text-red-500">*</span></label>
            <select v-model="form.target_audience" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="all">Everyone</option>
              <option value="student">All Students</option>
              <option value="l3">L3 Students Only</option>
              <option value="l4">L4 Students Only</option>
              <option value="l5">L5 Students Only</option>
              <option value="teacher">Teachers Only</option>
              <option value="staff">Staff Only</option>
              <option value="dean">Deans Only</option>
              <option value="discipline_prefect">Discipline Prefects Only</option>
              <option value="personal">Specific Person</option>
            </select>
          </div>

          <!-- Personal Target — show only if personal selected -->
          <div v-if="form.target_audience === 'personal'">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Select Person <span class="text-red-500">*</span></label>
            <select v-model="form.target_user_id" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select a person</option>
              <option v-for="u in users" :key="u.id" :value="u.id">
                {{ u.name }} — {{ u.profession }} {{ u.level ? '(' + u.level.toUpperCase() + ')' : '' }}
              </option>
            </select>
          </div>

          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{{ formError }}</div>
          <div v-if="formSuccess" class="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">{{ formSuccess }}</div>
        </div>

        <div class="px-7 py-5 border-t border-gray-100 flex gap-3">
          <button @click="submit" :disabled="submitting" class="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center">
            {{ submitting ? 'Saving...' : editing ? 'Update Announcement' : 'Create Announcement' }}
          </button>
          <button @click="modal=false" class="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW DETAIL MODAL -->
    <div v-if="detailModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="detailModal=false">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">👁️ View Announcement</h2>
          <button @click="detailModal=false" class="text-gray-400 hover:text-gray-700 text-xl transition-colors">✕</button>
        </div>

        <div class="px-7 py-6">
          <div class="flex gap-2 mb-4 flex-wrap">
            <span :class="{
              'bg-red-100 text-red-600': selectedItem?.importance === 'high',
              'bg-amber-100 text-amber-600': selectedItem?.importance === 'medium',
              'bg-green-100 text-green-600': selectedItem?.importance === 'low'
            }" class="text-xs font-medium px-2.5 py-0.5 rounded-full">{{ selectedItem?.importance }} priority</span>
            <span class="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ selectedItem?.category_name }}</span>
            <span class="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">{{ selectedItem?.target_audience }}</span>
          </div>

          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ selectedItem?.title }}</h3>

          <div class="flex gap-4 text-xs text-gray-400 mb-6 pb-4 border-b border-gray-100">
            <span>📅 {{ formatDate(selectedItem?.created_at) }}</span>
            <span>👤 {{ selectedItem?.created_by_name || 'Admin' }}</span>
          </div>

          <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{{ selectedItem?.content }}</p>
        </div>

        <div class="px-7 py-5 border-t border-gray-100 flex gap-3">
          <button @click="openEditFromDetail" class="flex-1 bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
            ✏️ Edit This Announcement
          </button>
          <button @click="detailModal=false" class="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Close
          </button>
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
const modal = ref(false)
const detailModal = ref(false)
const selectedItem = ref(null)
const editing = ref(false)
const editId = ref(null)
const submitting = ref(false)
const formError = ref('')
const formSuccess = ref('')
const selectedCategory = ref('All')
const form = ref({
  title: '',
  content: '',
  category_id: '',
  importance: 'medium',
  target_audience: 'all',
  target_user_id: ''
})

const categories = computed(() => [...new Set(announcements.value.map(a => a.category_name))])

const filteredAnnouncements = computed(() => {
  if (selectedCategory.value === 'All') return announcements.value
  return announcements.value.filter(a => a.category_name === selectedCategory.value)
})

function count(imp) { return announcements.value.filter(a => a.importance === imp).length }

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

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

function viewDetail(a) {
  selectedItem.value = a
  detailModal.value = true
}

function openEditFromDetail() {
  detailModal.value = false
  openEdit(selectedItem.value)
}

function openAdd() {
  editing.value = false
  editId.value = null
  form.value = { title: '', content: '', category_id: '', importance: 'medium', target_audience: 'all', target_user_id: '' }
  formError.value = ''
  formSuccess.value = ''
  modal.value = true
}

function openEdit(a) {
  editing.value = true
  editId.value = a.id
  form.value = {
    title: a.title,
    content: a.content,
    category_id: String(a.category_id),
    importance: a.importance,
    target_audience: a.target_audience || 'all',
    target_user_id: a.target_user_id || ''
  }
  formError.value = ''
  formSuccess.value = ''
  modal.value = true
}

async function submit() {
  if (!form.value.title || !form.value.content || !form.value.category_id) {
    formError.value = 'Please fill in all required fields.'
    return
  }
  if (form.value.target_audience === 'personal' && !form.value.target_user_id) {
    formError.value = 'Please select a person for personal announcement.'
    return
  }
  submitting.value = true
  formError.value = ''
  formSuccess.value = ''
  try {
    if (editing.value) {
      await api.put(`/announcements/${editId.value}`, form.value)
      formSuccess.value = '✅ Announcement updated successfully!'
    } else {
      await api.post('/announcements', form.value)
      formSuccess.value = '✅ Announcement created successfully!'
    }
    await load()
    setTimeout(() => { modal.value = false }, 1200)
  } catch {
    formError.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function remove(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return
  try {
    await api.delete(`/announcements/${id}`)
    await load()
  } catch {
    alert('Failed to delete.')
  }
}

onMounted(load)
</script>