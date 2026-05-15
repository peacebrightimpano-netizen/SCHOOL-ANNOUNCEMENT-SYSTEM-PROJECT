<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed top-0 left-0 bottom-0 z-50 flex flex-col">

      <!-- Logo -->
      <div class="h-16 flex items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white text-sm">SchoolNotice</p>
          <p class="text-xs text-gray-400">Admin Dashboard</p>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 px-4 py-6 space-y-1">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide px-3 mb-3">Overview</p>

        <button
          @click="activeTab = 'overview'"
          :class="activeTab === 'overview' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span>📊</span> Overview
        </button>

        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide px-3 mb-3 mt-6">Management</p>

        <button
          @click="activeTab = 'announcements'"
          :class="activeTab === 'announcements' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span>📢</span> Announcements
        </button>

        <button
          @click="activeTab = 'users'"
          :class="activeTab === 'users' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span>👥</span> Users
        </button>

        <button
          @click="activeTab = 'add-user'"
          :class="activeTab === 'add-user' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span>➕</span> Add User
        </button>

        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide px-3 mb-3 mt-6">Site</p>

        <router-link
          to="/"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>🏠</span> View Site
        </router-link>

        <router-link
          to="/announcements"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>📋</span> All Announcements
        </router-link>
      </nav>

      <!-- User info -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64 flex-1">

      <!-- Top bar -->
      <div class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-40">
        <h1 class="font-semibold text-gray-900 dark:text-white">
          {{ tabTitle }}
        </h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-400">{{ currentDate }}</span>
          <button
            v-if="activeTab === 'announcements'"
            @click="openAddModal"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Announcement
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-8">

        <!-- ── OVERVIEW TAB ── -->
        <div v-if="activeTab === 'overview'">

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Announcements</p>
              <p class="text-3xl font-semibold text-gray-900 dark:text-white">{{ announcements.length }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Users</p>
              <p class="text-3xl font-semibold text-indigo-600">{{ users.length }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Online Now</p>
              <p class="text-3xl font-semibold text-green-500">{{ onlineUsers }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">High Priority</p>
              <p class="text-3xl font-semibold text-red-500">{{ stats.high }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Users by Profession -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h2 class="font-semibold text-gray-900 dark:text-white mb-6">👥 Users by Profession</h2>
              <div class="space-y-4">
                <div v-for="p in professions" :key="p.name">
                  <div class="flex justify-between text-sm mb-1.5">
                    <span class="text-gray-700 dark:text-gray-300 capitalize font-medium">{{ p.name.replace('_', ' ') }}</span>
                    <span class="text-gray-500">{{ p.count }} users</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div :class="p.color" class="h-2.5 rounded-full transition-all duration-500" :style="`width: ${users.length ? (p.count/users.length)*100 : 0}%`"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Announcements by Priority -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h2 class="font-semibold text-gray-900 dark:text-white mb-6">📊 Announcements by Priority</h2>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1.5">
                    <span class="text-red-600 font-medium">🔴 High</span>
                    <span class="text-gray-500">{{ stats.high }}</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="bg-red-500 h-2.5 rounded-full" :style="`width: ${announcements.length ? (stats.high/announcements.length)*100 : 0}%`"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1.5">
                    <span class="text-amber-600 font-medium">🟡 Medium</span>
                    <span class="text-gray-500">{{ stats.medium }}</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="bg-amber-500 h-2.5 rounded-full" :style="`width: ${announcements.length ? (stats.medium/announcements.length)*100 : 0}%`"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1.5">
                    <span class="text-green-600 font-medium">🟢 Low</span>
                    <span class="text-gray-500">{{ stats.low }}</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="bg-green-500 h-2.5 rounded-full" :style="`width: ${announcements.length ? (stats.low/announcements.length)*100 : 0}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── ANNOUNCEMENTS TAB ── -->
        <div v-else-if="activeTab === 'announcements'">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 class="font-medium text-gray-900 dark:text-white">All Announcements</h2>
              <span class="text-sm text-gray-400">{{ announcements.length }} total</span>
            </div>
            <div v-if="loading" class="p-10 text-center text-gray-400">Loading...</div>
            <div v-else-if="!announcements.length" class="p-16 text-center">
              <p class="text-4xl mb-3">📭</p>
              <p class="text-gray-400">No announcements yet.</p>
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Target</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
                  <tr v-for="a in announcements" :key="a.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-xs truncate">{{ a.title }}</td>
                    <td class="px-6 py-4"><span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ a.category_name }}</span></td>
                    <td class="px-6 py-4">
                      <span :class="{
                        'bg-red-100 text-red-600': a.importance === 'high',
                        'bg-amber-100 text-amber-600': a.importance === 'medium',
                        'bg-green-100 text-green-600': a.importance === 'low'
                      }" class="text-xs font-medium px-2.5 py-0.5 rounded-full">{{ a.importance }}</span>
                    </td>
                    <td class="px-6 py-4"><span class="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">{{ a.target_audience }}</span></td>
                    <td class="px-6 py-4 text-gray-400 text-xs">{{ formatDate(a.created_at) }}</td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        <button @click="openEditModal(a)" class="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">✏️ Edit</button>
                        <button @click="removeAnnouncement(a.id)" class="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ── USERS TAB ── -->
        <div v-else-if="activeTab === 'users'">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 class="font-medium text-gray-900 dark:text-white">All Users</h2>
              <span class="text-sm text-gray-400">{{ users.length }} total</span>
            </div>
            <div v-if="loading" class="p-10 text-center text-gray-400">Loading...</div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Profession</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Last Logout</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Registered</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
                  <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {{ u.name?.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">{{ u.name }}</p>
                          <p class="text-xs text-gray-400">{{ u.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                        {{ u.profession?.replace('_', ' ') }} {{ u.level ? '· ' + u.level.toUpperCase() : '' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span v-if="u.is_online" class="flex items-center gap-1.5">
                        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span class="text-green-600 text-xs font-medium">Online</span>
                      </span>
                      <span v-else class="flex items-center gap-1.5">
                        <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
                        <span class="text-gray-400 text-xs font-medium">Offline</span>
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500 text-xs">{{ u.last_login ? formatDateTime(u.last_login) : '—' }}</td>
                    <td class="px-6 py-4 text-gray-500 text-xs">{{ u.last_logout ? formatDateTime(u.last_logout) : '—' }}</td>
                    <td class="px-6 py-4 text-gray-500 text-xs">{{ formatDateTime(u.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ── ADD USER TAB ── -->
        <div v-else-if="activeTab === 'add-user'">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 max-w-lg">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-6">➕ Add New User</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name <span class="text-red-500">*</span></label>
                <input v-model="userForm.name" type="text" placeholder="Enter full name" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address <span class="text-red-500">*</span></label>
                <input v-model="userForm.email" type="email" placeholder="Enter email" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password <span class="text-red-500">*</span></label>
                <input v-model="userForm.password" type="password" placeholder="Enter password" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profession <span class="text-red-500">*</span></label>
                <select v-model="userForm.profession" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select profession</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="staff">Staff</option>
                  <option value="dean">Dean</option>
                  <option value="discipline_prefect">Discipline Prefect</option>
                </select>
              </div>
              <div v-if="userForm.profession === 'student'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level <span class="text-red-500">*</span></label>
                <select v-model="userForm.level" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select level</option>
                  <option value="l3">L3</option>
                  <option value="l4">L4</option>
                  <option value="l5">L5</option>
                </select>
              </div>
            </div>

            <div v-if="userError" class="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{{ userError }}</div>
            <div v-if="userSuccess" class="mt-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">{{ userSuccess }}</div>

            <button
              @click="addUser"
              :disabled="userLoading"
              class="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {{ userLoading ? 'Adding User...' : 'Add User' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ANNOUNCEMENT MODAL -->
    <div v-if="modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="modal=false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingAnnouncement ? '✏️ Edit Announcement' : '+ Add Announcement' }}
          </h2>
          <button @click="modal=false" class="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        <div class="px-7 py-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title <span class="text-red-500">*</span></label>
            <input v-model="announcementForm.title" type="text" placeholder="Announcement title" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Content <span class="text-red-500">*</span></label>
            <textarea v-model="announcementForm.content" rows="4" placeholder="Write announcement here..." class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category <span class="text-red-500">*</span></label>
              <select v-model="announcementForm.category_id" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select category</option>
                <option value="1">General</option>
                <option value="2">Academic</option>
                <option value="3">Events</option>
                <option value="4">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
              <select v-model="announcementForm.importance" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Who can see this?</label>
            <select v-model="announcementForm.target_audience" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
          <div v-if="announcementForm.target_audience === 'personal'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Person</label>
            <select v-model="announcementForm.target_user_id" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select a person</option>
              <option v-for="u in users" :key="u.id" :value="u.id">
                {{ u.name }} — {{ u.profession }} {{ u.level ? '(' + u.level.toUpperCase() + ')' : '' }}
              </option>
            </select>
          </div>
          <div v-if="announcementError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{{ announcementError }}</div>
          <div v-if="announcementSuccess" class="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">{{ announcementSuccess }}</div>
        </div>

        <div class="px-7 py-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
          <button @click="submitAnnouncement" :disabled="announcementLoading" class="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center">
            {{ announcementLoading ? 'Saving...' : editingAnnouncement ? 'Update' : 'Create Announcement' }}
          </button>
          <button @click="modal=false" class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
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

const activeTab = ref('overview')
const announcements = ref([])
const users = ref([])
const loading = ref(true)

// Announcement modal
const modal = ref(false)
const editingAnnouncement = ref(false)
const editId = ref(null)
const announcementLoading = ref(false)
const announcementError = ref('')
const announcementSuccess = ref('')
const announcementForm = ref({
  title: '', content: '', category_id: '', importance: 'medium', target_audience: 'all', target_user_id: ''
})

// User form
const userLoading = ref(false)
const userError = ref('')
const userSuccess = ref('')
const userForm = ref({
  name: '', email: '', password: '', profession: '', level: ''
})

const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const tabTitle = computed(() => ({
  overview: '📊 Overview',
  announcements: '📢 Announcements',
  users: '👥 Users',
  'add-user': '➕ Add User'
}[activeTab.value]))

const onlineUsers = computed(() => users.value.filter(u => u.is_online).length)

const stats = computed(() => ({
  total: announcements.value.length,
  high: announcements.value.filter(a => a.importance === 'high').length,
  medium: announcements.value.filter(a => a.importance === 'medium').length,
  low: announcements.value.filter(a => a.importance === 'low').length,
  thisMonth: announcements.value.filter(a => {
    const now = new Date()
    const d = new Date(a.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}))

const professions = computed(() => {
  const list = [
    { name: 'student', color: 'bg-indigo-500' },
    { name: 'teacher', color: 'bg-green-500' },
    { name: 'staff', color: 'bg-amber-500' },
    { name: 'dean', color: 'bg-red-500' },
    { name: 'discipline_prefect', color: 'bg-purple-500' },
  ]
  return list.map(p => ({ ...p, count: users.value.filter(u => u.profession === p.name).length }))
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
}

async function handleLogout() {
  await auth.logout()
  router.push('/')
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

function openAddModal() {
  editingAnnouncement.value = false
  editId.value = null
  announcementForm.value = { title: '', content: '', category_id: '', importance: 'medium', target_audience: 'all', target_user_id: '' }
  announcementError.value = ''
  announcementSuccess.value = ''
  modal.value = true
}

function openEditModal(a) {
  editingAnnouncement.value = true
  editId.value = a.id
  announcementForm.value = { title: a.title, content: a.content, category_id: String(a.category_id), importance: a.importance, target_audience: a.target_audience || 'all', target_user_id: a.target_user_id || '' }
  announcementError.value = ''
  announcementSuccess.value = ''
  modal.value = true
}

async function submitAnnouncement() {
  if (!announcementForm.value.title || !announcementForm.value.content || !announcementForm.value.category_id) {
    announcementError.value = 'Please fill in all required fields.'
    return
  }
  announcementLoading.value = true
  announcementError.value = ''
  announcementSuccess.value = ''
  try {
    if (editingAnnouncement.value) {
      await api.put(`/announcements/${editId.value}`, announcementForm.value)
      announcementSuccess.value = '✅ Announcement updated!'
    } else {
      await api.post('/announcements', announcementForm.value)
      announcementSuccess.value = '✅ Announcement created!'
    }
    await load()
    setTimeout(() => { modal.value = false }, 1200)
  } catch {
    announcementError.value = 'Something went wrong. Please try again.'
  } finally {
    announcementLoading.value = false
  }
}

async function removeAnnouncement(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return
  try {
    await api.delete(`/announcements/${id}`)
    await load()
  } catch {
    alert('Failed to delete.')
  }
}

async function addUser() {
  if (!userForm.value.name || !userForm.value.email || !userForm.value.password || !userForm.value.profession) {
    userError.value = 'Please fill in all fields.'
    return
  }
  if (userForm.value.profession === 'student' && !userForm.value.level) {
    userError.value = 'Please select a level for the student.'
    return
  }
  userLoading.value = true
  userError.value = ''
  userSuccess.value = ''
  try {
    const res = await api.post('/auth/register', userForm.value)
    if (res.data.message === 'User registered successfully') {
      userSuccess.value = '✅ User added successfully!'
      userForm.value = { name: '', email: '', password: '', profession: '', level: '' }
      await load()
    } else {
      userError.value = res.data.message || 'Failed to add user.'
    }
  } catch {
    userError.value = 'Something went wrong. Please try again.'
  } finally {
    userLoading.value = false
  }
}

onMounted(load)
</script>