import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import './style.css'
import vue3GoogleLogin from 'vue3-google-login'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vue3GoogleLogin, {
  clientId: '921096024256-ouu841336pnq2no47amc2nngdnlfca9k.apps.googleusercontent.com'
})

// Initialize theme
import { useThemeStore } from './stores/theme'
const theme = useThemeStore()
theme.init()

app.mount('#app')