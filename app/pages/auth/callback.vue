<template>
  <div class="d-flex flex-column align-center justify-center" style="min-height: 100vh; background: #0f172a; color: white;">
    <v-progress-circular indeterminate color="#2196F3" size="48" width="4" class="mb-4" />
    <div class="text-body-1 font-weight-medium">{{ statusText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../../stores/auth'

definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const authStore = useAuthStore()
const statusText = ref('Finalisation de la connexion...')

let authSubscription = null
let fallbackTimer = null
let finished = false

const completeLogin = async (session) => {
  if (finished || !session) return
  finished = true
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (authSubscription) authSubscription.unsubscribe()
  try {
    await authStore.hydrateFromSession(supabase, session)
    navigateTo('/')
  } catch (err) {
    console.error('[Auth Callback] Hydration error:', err)
    navigateTo('/login')
  }
}

onMounted(async () => {
  try {
    // 1. Listen for @nuxtjs/supabase's automatic PKCE code exchange
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
        completeLogin(session)
      }
    })
    authSubscription = listener.subscription

    // 2. Check if the session is already available right away
    const { data } = await supabase.auth.getSession()
    if (data?.session) {
      await completeLogin(data.session)
      return
    }

    // 3. Safety timeout if OAuth failed or was cancelled
    fallbackTimer = setTimeout(async () => {
      if (finished) return
      const { data: retryData } = await supabase.auth.getSession()
      if (retryData?.session) {
        await completeLogin(retryData.session)
      } else {
        statusText.value = 'Impossible de finaliser la connexion. Redirection...'
        setTimeout(() => navigateTo('/login'), 1000)
      }
    }, 3500)
  } catch (err) {
    console.error('[Auth Callback] Error:', err)
    navigateTo('/login')
  }
})

onUnmounted(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (authSubscription) authSubscription.unsubscribe()
})
</script>
