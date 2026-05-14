<template>
  <div :class="{ 'dark': theme.dark }" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { useThemeStore } from './stores/theme'
const theme = useThemeStore()
theme.init()
</script>

<style>
.dark {
  background-color: #111827;
  color: #f3f4f6;
}
</style>