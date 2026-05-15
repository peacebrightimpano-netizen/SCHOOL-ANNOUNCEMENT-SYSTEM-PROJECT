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
          Manage your school announcements with ease.
        </h2>
        <p class="text-gray-400 text-base">Post updates, events, and notices — all in one place.</p>
      </div>
      <p class="text-gray-600 text-sm">© 2025 SchoolNotice. All rights reserved.</p>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">

        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h1>
          <p class="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <!-- Google Button -->
        <GoogleLogin :callback="handleGoogleLogin" class="w-full">
          <button class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>
        </GoogleLogin>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400">or sign in with email</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              autocomplete="off"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              @keyup.enter="login"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              autocomplete="new-password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              @keyup.enter="login"
            />
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {{ error }}
        </div>

        <!-- Sign in Button -->
        <button
          @click="login"
          :disabled="loading"
          class="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <!-- Register Link -->
        <div class="mt-4 text-center text-sm text-gray-500">
          Don't have an account?
          <router-link to="/register" class="text-indigo-600 font-medium hover:underline">Register here</router-link>
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
import { GoogleLogin, decodeCredential } from 'vue3-google-login'
import api from '../api/axios'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function login() {
  if (!form.value.email || !form.value.password) {
    error.value = 'Please fill in all fields.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/login', form.value)
    if (res.data.token) {
      auth.login(res.data.token, res.data.user)
      if (res.data.user.role === 'admin') {
        router.push('/admin-dashboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      error.value = res.data.message || 'Invalid email or password.'
    }
  } catch {
    error.value = 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin(response) {
  try {
    const userData = decodeCredential(response.credential)
    const res = await api.post('/auth/google', {
      email: userData.email,
      name: userData.name,
      google_id: userData.sub
    })
    if (res.data.token) {
      auth.login(res.data.token, res.data.user)
      router.push('/')
    } else {
      error.value = 'Google login failed. Please try again.'
    }
  } catch {
    error.value = 'Google login failed. Please try again.'
  }
}
</script>