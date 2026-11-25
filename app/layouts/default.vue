<template>
  <v-app>
    <!-- Header Talkiz Video -->
    <v-app-bar
      :elevation="0"
      height="64"
      style="background: rgba(255, 255, 255, 0.96) !important; backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0;"
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

          <NuxtLink to="/" class="d-flex align-center text-decoration-none ml-1 brand-link">
            <img
              src="/logo-talkiz-icon.svg?v=6"
              alt="Talkiz.yt"
              class="brand-icon flex-shrink-0"
            />
            <span class="brand-wordmark" :class="{ 'd-none d-sm-inline': authStore.isAuthenticated }">
              Talkiz<span class="brand-tld">.yt</span>
            </span>
          </NuxtLink>
        </div>

        <!-- Right: Sign in with Google (when logged out) -->
        <div v-if="!authStore.isAuthenticated" class="d-flex align-center flex-shrink-0">
          <button
            type="button"
            class="header-google-btn"
            :disabled="signingInGoogle"
            @click="signInWithGoogleHeader"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" class="header-google-icon flex-shrink-0">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.51-3.51C18.14 1.38 15.34 0 12 0 7.31 0 3.25 2.69 1.28 6.6l4.09 3.17C6.34 6.91 8.94 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.87 3c2.26-2.09 3.55-5.17 3.55-8.82z"/>
              <path fill="#FBBC05" d="M5.37 14.23a7.17 7.17 0 0 1 0-4.46L1.28 6.6a11.98 11.98 0 0 0 0 10.8l4.09-3.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3c-1.08.72-2.45 1.16-4.06 1.16-3.06 0-5.66-1.87-6.63-4.52l-4.09 3.17C3.25 21.31 7.31 24 12 24z"/>
            </svg>
            <span class="header-google-label-full">{{ t('nav.signInGoogle') }}</span>
            <span class="header-google-label-short">Sign in</span>
          </button>
        </div>

        <!-- Right: Credits counter + Recharge + Account icon (when logged in) -->
        <div v-else class="d-flex align-center ga-1 ga-sm-2 flex-shrink-0">
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

    <v-main class="d-flex flex-column" style="background: #E6DAF5; min-height: 100vh;">
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
const signingInGoogle = ref(false)

const signInWithGoogleHeader = async () => {
  if (signingInGoogle.value) return
  signingInGoogle.value = true
  try {
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      signingInGoogle.value = false
      navigateTo('/login')
    }
  } catch {
    signingInGoogle.value = false
    navigateTo('/login')
  }
}

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
      const publicPaths = ['/', '/login', '/cgu', '/confidentialite', '/mentions-legales']
      if (!publicPaths.includes(route.path) && !route.path.startsWith('/auth')) {
        navigateTo('/')
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
.brand-link {
  gap: 0.5rem;
  min-width: 0;
}

.brand-icon {
  height: 34px;
  width: 34px;
  background-color: #FF0000;
  border-radius: 0.65rem;
  padding: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.brand-wordmark {
  font-size: 1.5rem;
  line-height: 1.75rem;
  font-weight: 700;
  color: #3b82f6;
  letter-spacing: -0.025em;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.brand-tld {
  color: #DC2626;
}

.legal-footer {
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
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

.header-google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.header-google-label-short {
  display: none;
}

.header-google-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #94a3b8;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
}

.header-google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 420px) {
  .header-google-btn {
    height: 34px;
    padding: 0 10px;
    font-size: 0.8rem;
    gap: 6px;
  }

  .header-google-label-full {
    display: none;
  }

  .header-google-label-short {
    display: inline;
  }

  .brand-wordmark {
    font-size: 1.15rem;
  }
}

@media (min-width: 600px) {
  .brand-link {
    gap: 0.75rem;
  }

  .brand-icon {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 0.75rem;
    padding: 5px;
  }

  .brand-wordmark {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}
</style>
