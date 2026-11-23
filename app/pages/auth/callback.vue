<template>
  <div class="d-flex flex-column align-center justify-center" style="min-height: 100vh; background: #0f172a; color: white;">
    <v-progress-circular indeterminate color="#2196F3" size="48" width="4" class="mb-4" />
    <div class="text-body-1 font-weight-medium">{{ statusText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth'

definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const authStore = useAuthStore()
const statusText = ref('Finalisation de la connexion...')

onMounted(async () => {
  try {
    // Handle PKCE code exchange if present in query params
    const route = useRoute()
    if (route.query.code) {
      const { error } = await supabase.auth.exchangeCodeForSession(String(route.query.code))
      if (error) {
        console.error('[Auth Callback] Code exchange error:', error)
      }
    }

    const { data } = await supabase.auth.getSession()
    if (data?.session) {
      await authStore.hydrateFromSession(supabase, data.session)
      navigateTo('/')
      return
    }

    // Fallback: wait briefly for Supabase client to parse hash tokens
    setTimeout(async () => {
      const { data: retryData } = await supabase.auth.getSession()
      if (retryData?.session) {
        await authStore.hydrateFromSession(supabase, retryData.session)
        navigateTo('/')
      } else {
        statusText.value = 'Impossible de finaliser la connexion. Redirection...'
        setTimeout(() => navigateTo('/login'), 1200)
      }
    }, 800)
  } catch (err) {
    console.error('[Auth Callback] Error:', err)
    navigateTo('/login')
  }
})
</script>
