<template>
  <v-app>
    <!-- Header Talkiz Video -->
    <v-app-bar
      :elevation="0"
      height="64"
      style="background: rgba(255, 255, 255, 0.92) !important; backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0;"
    >
      <div style="width: 100%; padding: 0 1rem;" class="d-flex justify-space-between align-center h-100">
        <!-- Left: Videos drawer toggle + Logo -->
        <div class="d-flex align-center ga-2">
          <v-btn
            v-if="authStore.isAuthenticated"
            variant="tonal"
            color="primary"
            rounded="pill"
            size="small"
            class="text-none font-weight-medium px-3"
            @click="toggleVideosDrawer"
          >
            <v-icon start size="18">mdi-playlist-play</v-icon>
            <span class="d-none d-sm-inline">Mes vidéos</span>
            <v-chip
              v-if="videosStore.videos.length > 0"
              size="x-small"
              color="primary"
              variant="flat"
              class="ml-2 font-weight-bold"
            >
              {{ videosStore.videos.length }}
            </v-chip>
          </v-btn>

          <NuxtLink to="/" class="d-flex align-center text-decoration-none ml-1" style="gap: 0.55rem;">
            <img
              src="/logo-talkiz-icon.svg"
              alt="Talkiz"
              style="height: 2.1rem; width: 2.1rem; background-color: #000000; border-radius: 0.6rem; padding: 4px;"
            />
            <span style="font-size: 1.55rem; line-height: 1.8rem; font-weight: 700; color: #2196F3; letter-spacing: -0.025em;">
              Talkiz<span style="color: #0f172a;">.ai</span>
            </span>
            <v-chip size="x-small" color="red-darken-1" variant="tonal" class="font-weight-bold d-none d-sm-inline-flex">
              Video
            </v-chip>
          </NuxtLink>
        </div>

        <!-- Right: Credits counter + Recharge + Account icon -->
        <div v-if="authStore.isAuthenticated" class="d-flex align-center ga-2">
          <!-- Credit counter (1 crédit = 1 minute) -->
          <div class="d-flex align-center rounded-pill px-2 py-1" style="background: #f1f5f9; border: 1px solid #e2e8f0;">
            <v-tooltip text="1 crédit = 1 minute de conversation vocale" location="bottom">
              <template #activator="{ props: tooltipProps }">
                <div v-bind="tooltipProps" class="d-flex align-center ga-1 px-1">
                  <v-icon size="16" :color="creditIconColor">mdi-timer-outline</v-icon>
                  <span class="text-caption font-weight-bold" :style="{ color: creditTextColor }">
                    {{ authStore.formattedCredits }} min
                  </span>
                </div>
              </template>
            </v-tooltip>

            <v-btn
              icon
              size="x-small"
              variant="text"
              color="grey-darken-1"
              :loading="authStore.isRefreshingCredits"
              title="Rafraîchir les crédits"
              @click="refreshCredits"
            >
              <v-icon size="15">mdi-refresh</v-icon>
            </v-btn>

            <v-btn
              size="x-small"
              :color="!authStore.hasCredits ? 'error' : 'primary'"
              variant="flat"
              rounded="pill"
              class="text-none font-weight-bold ml-1 px-2"
              to="/billing"
            >
              {{ !authStore.hasCredits ? 'Recharger' : '+' }}
            </v-btn>
          </div>

          <!-- Account Icon -->
          <v-btn
            icon
            variant="text"
            title="Mon compte"
            @click="showAccountDialog = true"
          >
            <v-avatar size="34" color="primary">
              <v-img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" :alt="authStore.fullName" />
              <span v-else class="text-caption font-weight-bold text-white">{{ authStore.initials }}</span>
            </v-avatar>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Slide-out Videos Drawer -->
    <VideosDrawer v-if="authStore.isAuthenticated" />

    <!-- Account Dialog -->
    <AccountDialog v-if="authStore.isAuthenticated" v-model="showAccountDialog" />

    <v-main style="background: #f8fafc; min-height: 100vh;">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useVideosStore } from '../../stores/videos'
import { setAccessToken } from '../services/api.js'
import VideosDrawer from '../components/video/VideosDrawer.vue'
import AccountDialog from '../components/video/AccountDialog.vue'

const supabase = useSupabaseClient()
const authStore = useAuthStore()
const videosStore = useVideosStore()

const showAccountDialog = ref(false)

const creditIconColor = computed(() => {
  const b = Number(authStore.creditBudget ?? 1)
  if (b <= 0) return 'error'
  if (b < 5) return 'orange-darken-2'
  return 'success'
})

const creditTextColor = computed(() => {
  const b = Number(authStore.creditBudget ?? 1)
  if (b <= 0) return '#dc2626'
  if (b < 5) return '#ea580c'
  return '#0f172a'
})

const refreshCredits = () => {
  authStore.refreshCredits(supabase)
}

const toggleVideosDrawer = () => {
  videosStore.drawerOpen = !videosStore.drawerOpen
  if (videosStore.drawerOpen && authStore.clientUid) {
    videosStore.fetchVideos(authStore.clientUid)
  }
}

let authListener = null

onMounted(() => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      authStore.clearUser()
      videosStore.clearActiveVideo()
      const route = useRoute()
      if (route.path !== '/login' && !route.path.startsWith('/auth')) {
        navigateTo('/login')
      }
    } else if (session?.access_token) {
      setAccessToken(session.access_token)
    }
  })
  authListener = data.subscription
})

onUnmounted(() => {
  if (authListener) authListener.unsubscribe()
})
</script>
