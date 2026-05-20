<template>
  <div>
    <Navbar />
    <div class="max-w-3xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">My Profile</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account information</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-6">

        <!-- Cover -->
        <div class="h-24 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>

        <!-- Avatar -->
        <div class="px-8 pb-8">
          <div class="flex items-end justify-between -mt-10 mb-6">
            <div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
              <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {{ auth.user?.name?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span class="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Active Account</span>
          </div>

          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">{{ auth.user?.name }}</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm capitalize">
            {{ auth.user?.profession?.replace('_', ' ') }}
            {{ auth.user?.level ? '· Level ' + auth.user?.level.toUpperCase() : '' }}
          </p>
        </div>
      </div>

      <!-- Account Info -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Full Name</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ auth.user?.name }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ auth.user?.email }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Profession</p>
            <p class="font-medium text-gray-900 dark:text-white capitalize">{{ auth.user?.profession?.replace('_', ' ') }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Level</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ auth.user?.level ? auth.user?.level.toUpperCase() : 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <input
              v-model="passwordForm.current"
              type="password"
              placeholder="Enter current password"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <input
              v-model="passwordForm.newPass"
              type="password"
              placeholder="Enter new password"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              placeholder="Confirm new password"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div v-if="passwordError" class="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{{ passwordError }}</div>
        <div v-if="passwordSuccess" class="mt-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">{{ passwordSuccess }}</div>

        <button
          @click="changePassword"
          :disabled="passwordLoading"
          class="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {{ passwordLoading ? 'Updating...' : 'Update Password' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import Navbar from '../components/Navbar.vue'
import api from '../api/axios'

const auth = useAuthStore()
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
const passwordForm = ref({ current: '', newPass: '', confirm: '' })

async function changePassword() {
  if (!passwordForm.value.current || !passwordForm.value.newPass || !passwordForm.value.confirm) {
    passwordError.value = 'Please fill in all fields.'
    return
  }
  if (passwordForm.value.newPass !== passwordForm.value.confirm) {
    passwordError.value = 'New passwords do not match.'
    return
  }
  if (passwordForm.value.newPass.length < 6) {
    passwordError.value = 'Password must be at least 6 characters.'
    return
  }
  passwordLoading.value = true
  passwordError.value = ''
  passwordSuccess.value = ''
  try {
    const res = await api.post('/auth/change-password', {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.newPass
    })
    if (res.data.message === 'Password changed successfully') {
      passwordSuccess.value = '✅ Password updated successfully!'
      passwordForm.value = { current: '', newPass: '', confirm: '' }
    } else {
      passwordError.value = res.data.message || 'Failed to update password.'
    }
  } catch {
    passwordError.value = 'Something went wrong. Please try again.'
  } finally {
    passwordLoading.value = false
  }
}
</script>