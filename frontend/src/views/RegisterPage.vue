<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Left Panel -->
    <div class="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
        <span class="text-white font-semibold text-lg">SchoolNotice</span>
      </div>
      <div>
        <h2 class="text-white text-4xl font-semibold leading-tight mb-4">
          Join SchoolNotice today.
        </h2>
        <p class="text-gray-400 text-base">Stay updated with all school announcements relevant to you.</p>
      </div>
      <p class="text-gray-600 text-sm">© 2025 SchoolNotice. All rights reserved.</p>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">

        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-1">Create Account</h1>
          <p class="text-gray-500 text-sm">Register to access school announcements</p>
        </div>

        <!-- Google Button -->
        <button class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400">or register with email</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="off"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              autocomplete="off"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Profession</label>
            <select
              v-model="form.profession"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select your profession</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="dean">Dean</option>
              <option value="discipline_prefect">Discipline Prefect</option>
            </select>
          </div>

          <!-- Level — only show if student -->
          <div v-if="form.profession === 'student'">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Level <span class="text-red-500">*</span></label>
            <select
              v-model="form.level"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select your level</option>
              <option value="l3">L3</option>
              <option value="l4">L4</option>
              <option value="l5">L5</option>
            </select>
          </div>
        </div>

        <!-- Error / Success -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {{ error }}
        </div>
        <div v-if="success" class="mt-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
          {{ success }}
        </div>

        <!-- Create Account Button -->
        <button
          @click="register"
          :disabled="loading"
          class="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>

        <!-- Login Link -->
        <div class="mt-4 text-center text-sm text-gray-500">
          Already have an account?
          <router-link to="/login" class="text-indigo-600 font-medium hover:underline">Sign in</router-link>
        </div>

        <div class="mt-3 text-center">
          <router-link to="/" class="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back to Home</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/axios'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ name: '', email: '', password: '', profession: '', level: '' })
const loading = ref(false)
const error = ref('')
const success = ref('')

async function register() {
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.profession) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (form.value.profession === 'student' && !form.value.level) {
    error.value = 'Please select your level.'
    return
  }
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await api.post('/auth/register', form.value)
    if (res.data.message === 'User registered successfully') {
      // Auto login after register
      const loginRes = await api.post('/auth/login', {
        email: form.value.email,
        password: form.value.password
      })
      if (loginRes.data.token) {
        auth.login(loginRes.data.token, loginRes.data.user)
        success.value = '✅ Account created! Welcome to SchoolNotice!'
        setTimeout(() => router.push('/'), 1500)
      }
    } else {
      error.value = res.data.message || 'Registration failed.'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>