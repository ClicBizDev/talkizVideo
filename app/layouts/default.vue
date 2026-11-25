<template>
  <v-app>
    <!-- Header Talkiz Video -->
    <v-app-bar
      :elevation="0"
      height="58"
      style="background: rgba(255, 255, 255, 0.94) !important; backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0;"
    >
      <div class="header-inner d-flex justify-space-between align-center w-100 h-100 px-2 px-sm-4">
        <!-- Left: Videos drawer toggle + Logo -->
        <div class="d-flex align-center ga-1 ga-sm-2" style="min-width: 0;">
          <v-btn
            v-if="authStore.isAuthenticated"
            variant="tonal"
            color="primary"
            rounded="pill"
            size="small"
            class="text-none font-weight-medium px-2 px-sm-3 flex-shrink-0"
            @click="toggleVideosDrawer"
          >
            <v-icon size="18" class="mr-sm-1">mdi-playlist-play</v-icon>
            <span class="d-none d-sm-inline">{{ t('nav.myVideos') }}</span>
            <v-chip
              v-if="videosStore.videos.length > 0"
              size="x-small"
              color="primary"
              variant="flat"
              class="ml-1 ml-sm-2 font-weight-bold"
            >
              {{ videosStore.videos.length }}
            </v-chip>
          </v-btn>

          <NuxtLink to="/" class="d-flex align-center text-decoration-none ml-1" style="gap: 0.4rem; min-width: 0;">
            <img
              src="/logo-talkiz-icon.svg"
              alt="Talkiz"
              class="brand-icon flex-shrink-0"
            />
            <span class="brand-wordmark d-none d-sm-inline">
              Talkiz<span style="color: #0f172a;">.ai</span>
            </span>
            <v-chip size="x-small" color="red-darken-1" variant="tonal" class="font-weight-bold d-none d-md-inline-flex">
              Video
            </v-chip>
          </NuxtLink>
        </div>

        <!-- Right: Credits counter + Recharge + Account icon -->
        <div v-if="authStore.isAuthenticated" class="d-flex align-center ga-1 ga-sm-2 flex-shrink-0">
          <!-- Credit counter (1 credit = 1 minute) -->
          <div class="d-flex align-center rounded-pill px-2 py-1" style="background: #f1f5f9; border: 1px solid #e2e8f0;">
            <v-tooltip :text="t('nav.creditsTooltip')" location="bottom">
              <template #activator="{ props: tooltipProps }">
                <div v-bind="tooltipProps" class="d-flex align-center ga-1 px-1">
                  <v-icon size="15" :color="creditIconColor">mdi-timer-outline</v-icon>
                  <span class="text-caption font-weight-bold text-no-wrap" :style="{ color: creditTextColor }">
                    {{ authStore.formattedCredits }}<span class="d-none d-sm-inline"> {{ t('common.min') }}</span>
                  </span>
                </div>
              </template>
            </v-tooltip>

            <v-btn
              icon
              size="x-small"
              variant="text"
              color="grey-darken-1"
              class="d-none d-sm-inline-flex"
              :loading="authStore.isRefreshingCredits"
              :title="t('nav.refreshCredits')"
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
              {{ !authStore.hasCredits ? t('nav.recharge') : '+' }}
            </v-btn>
          </div>

          <!-- Account Icon -->
          <v-btn
            icon
            size="small"
            variant="text"
            :title="t('nav.myAccount')"
            @click="showAccountDialog = true"
          >
            <v-avatar size="32" color="primary">
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

    <v-main class="d-flex flex-column" style="background: #f8fafc; min-height: 100vh;">
      <div class="flex-grow-1">
        <slot />
      </div>

      <!-- Legal Footer -->
      <footer class="legal-footer px-4 py-4 text-center">
        <div class="d-flex flex-wrap justify-center align-center ga-2 text-caption" style="color: #64748b;">
          <span>{{ t('footer.copyright') }}</span>
          <span class="d-none d-sm-inline">&bull;</span>
          <div class="d-flex flex-wrap justify-center align-center ga-3">
            <NuxtLink to="/cgu" class="legal-link">{{ t('footer.terms') }}</NuxtLink>
            <NuxtLink to="/confidentialite" class="legal-link">{{ t('footer.privacy') }}</NuxtLink>
            <NuxtLink to="/mentions-legales" class="legal-link">{{ t('footer.legal') }}</NuxtLink>
          </div>
        </div>
        <div class="mt-2 mx-auto" style="font-size: 11px; color: #94a3b8; max-width: 720px; line-height: 1.45;">
          {{ t('footer.disclaimer') }}
        </div>
      </footer>
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
const { t } = useI18n()

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
      const publicPaths = ['/login', '/cgu', '/confidentialite', '/mentions-legales']
      if (!publicPaths.includes(route.path) && !route.path.startsWith('/auth')) {
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

<style scoped>
.brand-icon {
  height: 1.9rem;
  width: 1.9rem;
  background-color: #000000;
  border-radius: 0.55rem;
  padding: 4px;
}

.brand-wordmark {
  font-size: 1.25rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: #2196F3;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.legal-footer {
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.legal-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.15s ease;
}

.legal-link:hover {
  color: #2196F3;
  text-decoration: underline;
}

@media (min-width: 600px) {
  .brand-icon {
    height: 2.1rem;
    width: 2.1rem;
  }

  .brand-wordmark {
    font-size: 1.5rem;
    line-height: 1.8rem;
  }
}
</style>
