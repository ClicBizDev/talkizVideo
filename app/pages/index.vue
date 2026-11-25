<template>
  <div class="d-flex flex-column align-center px-3 py-4 px-sm-6 py-sm-8" style="min-height: calc(100vh - 58px);">
    <!-- Initializing session check -->
    <div v-if="initializingAuth" class="d-flex align-center justify-center mt-16">
      <v-progress-circular indeterminate color="#2196F3" size="40" width="4" />
    </div>

    <!-- ==================== PUBLIC LANDING PAGE (LOGGED OUT) ==================== -->
    <template v-else-if="!authStore.isAuthenticated">
      <!-- Hero Section (tldr.yt-inspired) -->
      <div class="landing-hero text-center w-100 mt-3 mt-sm-8 mt-md-10 mb-7 mb-sm-10 px-1" style="max-width: 720px;">
        <h1 class="hero-headline mb-3 mb-sm-4">
          Have a voice chat with a YouTube video
        </h1>

        <p class="hero-subtitle mx-auto mb-5 mb-sm-7" style="max-width: 520px;">
          {{ t('home.welcomeSubtitleBefore') }}
          <span class="inline-plus-btn" aria-hidden="true">+</span>.
        </p>

        <!-- URL Input + Blue + Button -->
        <div class="mx-auto w-100" style="max-width: 540px;">
          <div class="d-flex align-center ga-2 ga-sm-3 w-100">
            <div class="yt-input-pill yt-input-pill--hero flex-grow-1 d-flex align-center">
              <input
                v-model="youtubeUrl"
                type="url"
                :placeholder="t('home.urlPlaceholder')"
                class="yt-input-field"
                @keyup.enter="handleGuestSubmit"
              />
              <button
                v-if="youtubeUrl"
                type="button"
                class="yt-clear-btn"
                :title="t('common.clear')"
                @click="clearInput"
              >
                ✕
              </button>
            </div>

            <v-btn
              icon
              color="#2196F3"
              size="48"
              elevation="2"
              class="flex-shrink-0"
              :loading="signingInGuest"
              :disabled="signingInGuest"
              :title="t('home.analyzeTooltip')"
              @click="handleGuestSubmit"
            >
              <v-icon color="white" size="26">mdi-plus</v-icon>
            </v-btn>
          </div>

          <div class="text-caption text-grey-darken-1 mt-2">
            {{ t('home.freeToStart') }}
          </div>

          <v-alert
            v-if="errorMsg"
            type="error"
            variant="tonal"
            density="compact"
            closable
            class="mt-3 text-left"
            @click:close="errorMsg = ''"
          >
            {{ errorMsg }}
          </v-alert>
        </div>
      </div>

      <!-- 10 Most Recent Scraped Videos -->
      <div v-if="recentVideos.length > 0" class="w-100 mt-4 mb-8" style="max-width: 1080px;">
        <div class="d-flex align-center justify-space-between mb-4 px-1">
          <h2 class="text-subtitle-1 font-weight-bold" style="color: #0f172a;">
            {{ t('home.recentVideosTitle') }}
          </h2>
        </div>

        <v-row dense>
          <v-col
            v-for="vid in recentVideos"
            :key="vid.videoId"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="pa-2"
          >
            <v-card
              class="recent-video-card h-100 d-flex flex-column rounded-xl overflow-hidden"
              elevation="1"
              @click="selectRecentVideoAsGuest(vid)"
            >
              <div class="recent-thumb-wrapper">
                <img
                  :src="vid.thumbnail"
                  :alt="vid.title"
                  loading="lazy"
                  class="recent-thumb-img"
                />
                <div class="recent-play-overlay">
                  <v-icon color="white" size="34">mdi-play-circle</v-icon>
                </div>
              </div>
              <div class="pa-3 d-flex flex-column flex-grow-1 justify-space-between">
                <div class="recent-video-title font-weight-semibold mb-2">
                  {{ vid.title }}
                </div>
                <div v-if="vid.createdAt" class="text-caption text-grey-darken-1">
                  {{ formatVideoDate(vid.createdAt) }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- ==================== AUTHENTICATED WORKSPACE ==================== -->
    <template v-else>
      <!-- 1. YouTube URL Bar (always visible at top, pre-filled if coming from landing page) -->
      <div class="w-100 d-flex flex-column align-center" style="max-width: 520px;">
        <div class="d-flex align-center ga-2 ga-sm-3 w-100">
          <div class="yt-input-pill flex-grow-1 d-flex align-center">
            <input
              v-model="youtubeUrl"
              type="url"
              :placeholder="t('home.urlPlaceholder')"
              class="yt-input-field"
              :disabled="processing"
              @keyup.enter="handleAddVideo"
            />
            <button
              v-if="youtubeUrl && !processing"
              type="button"
              class="yt-clear-btn"
              :title="t('common.clear')"
              @click="clearInput"
            >
              ✕
            </button>
          </div>

          <v-btn
            icon
            color="#2196F3"
            size="44"
            elevation="2"
            class="flex-shrink-0"
            :disabled="processing || !youtubeUrl.trim()"
            :title="t('home.analyzeTooltip')"
            @click="handleAddVideo"
          >
            <v-icon color="white" size="24">mdi-plus</v-icon>
          </v-btn>
        </div>

        <!-- Info message (e.g. duplicate video already in library or cancelled) -->
        <v-alert
          v-if="infoMsg"
          type="info"
          variant="tonal"
          density="compact"
          closable
          class="mt-3 w-100"
          @click:close="infoMsg = ''"
        >
          {{ infoMsg }}
        </v-alert>

        <!-- Error message -->
        <v-alert
          v-if="errorMsg"
          type="error"
          variant="tonal"
          density="compact"
          closable
          class="mt-3 w-100"
          @click:close="errorMsg = ''"
        >
          {{ errorMsg }}
        </v-alert>
      </div>

      <!-- 2. Processing State -->
      <div
        v-if="processing"
        class="d-flex flex-column align-center text-center mt-8 w-100"
        style="max-width: 520px;"
      >
        <v-card class="pa-5 pa-sm-8 w-100 rounded-xl d-flex flex-column align-center" elevation="1" style="border: 1px solid #e2e8f0;">
          <div class="text-h6 font-weight-bold mb-5" style="letter-spacing: 0.04em; color: #0f172a;">
            {{ t('home.processingTitle') }}
          </div>

          <v-progress-circular
            indeterminate
            color="#2196F3"
            size="52"
            width="4"
            class="mb-5"
          />

          <!-- Source pill -->
          <div
            class="px-3 py-2 rounded-pill d-inline-flex align-center mb-4"
            style="background: #f4f6f9; border: 1px solid #e3e8ef; max-width: 100%;"
          >
            <v-icon size="18" color="#ff0000" class="mr-2 flex-shrink-0">mdi-youtube</v-icon>
            <span class="text-caption font-weight-medium text-truncate" style="color: #334155; max-width: 70vw;">
              {{ processingUrl }}
            </span>
          </div>

          <!-- Phase + elapsed timer -->
          <div class="text-body-2 font-weight-medium" style="color: #334155;">
            {{ processingPhase }}
            <span v-if="elapsedSec > 0" style="color: #94a3b8; font-weight: 400;">
              — {{ formatElapsed(elapsedSec) }}
            </span>
          </div>

          <!-- Sub-detail -->
          <div v-if="processingSubDetail" class="text-caption mt-2" style="color: #64748b; max-width: 440px;">
            {{ processingSubDetail }}
          </div>

          <!-- Cancel button -->
          <v-btn
            variant="outlined"
            color="error"
            size="small"
            rounded="pill"
            class="mt-5 text-none px-4"
            :loading="cancelling"
            :disabled="cancelling"
            @click="handleCancelAnalysis"
          >
            <v-icon start size="16">mdi-close-circle-outline</v-icon>
            {{ cancelling ? t('home.cancelling') : t('home.cancelAnalysis') }}
          </v-btn>
        </v-card>
      </div>

      <!-- Loading selected video from drawer -->
      <div v-else-if="videosStore.loadingActiveVideo" class="d-flex flex-column align-center justify-center mt-12">
        <v-progress-circular indeterminate color="#2196F3" size="44" width="4" />
        <div class="text-caption text-grey-darken-1 mt-3">{{ t('home.loadingPlayer') }}</div>
      </div>

      <!-- 3. Active Video Player directly underneath the URL bar -->
      <div v-else-if="videosStore.activeVideo" class="mt-5 w-100 d-flex justify-center">
        <VideoPlayerCard
          :project="videosStore.activeVideo"
          :creditsDepleted="!authStore.hasCredits"
          :autoStartAgent="autoStartAgent"
          @auto-started="autoStartAgent = false"
          @conversation-ended="onConversationEnded"
        />
      </div>

      <!-- Empty welcome state when no video is selected yet -->
      <div v-else class="d-flex flex-column align-center text-center mt-8 mt-sm-14 px-3 px-sm-4" style="max-width: 480px;">
        <v-avatar size="68" color="#eff6ff" class="mb-4">
          <v-icon size="38" color="#2196F3">mdi-play-circle-outline</v-icon>
        </v-avatar>
        <h1 class="text-h6 font-weight-bold mb-2" style="color: #0f172a;">
          {{ t('home.welcomeTitle') }}
        </h1>
        <p class="text-body-2 text-grey-darken-1 mb-5" style="line-height: 1.55;">
          {{ t('home.welcomeSubtitleBefore') }}
          <span class="inline-plus-btn" aria-hidden="true">+</span>.<br />
          {{ t('home.welcomeSubtitleAfter') }}
        </p>
        <v-btn
          v-if="videosStore.videos.length > 0"
          variant="tonal"
          color="primary"
          rounded="pill"
          class="text-none font-weight-medium"
          @click="videosStore.drawerOpen = true"
        >
          <v-icon start>mdi-playlist-play</v-icon>
          {{ videosStore.videos.length > 1
            ? t('home.viewMyVideosPlural', { count: videosStore.videos.length })
            : t('home.viewMyVideos', { count: videosStore.videos.length }) }}
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useVideosStore } from '../../stores/videos'
import videoService from '../services/video.service.js'
import VideoPlayerCard from '../components/video/VideoPlayerCard.vue'

const PENDING_URL_KEY = 'talkiz_pending_youtube_url'

const supabase = useSupabaseClient()
const authStore = useAuthStore()
const videosStore = useVideosStore()
const { t } = useI18n()

const initializingAuth = ref(true)
const signingInGuest = ref(false)
const autoStartAgent = ref(false)
const recentVideos = ref([])

const youtubeUrl = ref('')
const errorMsg = ref('')
const infoMsg = ref('')
const processing = ref(false)
const cancelling = ref(false)
const processingUrl = ref('')
const processingPhase = ref('')
const processingSubDetail = ref('')
const elapsedSec = ref(0)

let elapsedTimer = null
let isUnmounted = false
let activeTaskId = null
let activeProjUid = null
let cancelledByUser = false

const stopTimers = () => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

const startTimer = () => {
  stopTimers()
  elapsedSec.value = 0
  const startedAt = Date.now()
  elapsedTimer = setInterval(() => {
    elapsedSec.value = Math.round((Date.now() - startedAt) / 1000)
  }, 1000)
}

const formatElapsed = (sec) => {
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  const s = sec % 60
  if (min < 60) return `${min}min ${s}s`
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${m}min`
}

const formatVideoDate = (rawDate) => {
  if (!rawDate) return ''
  try {
    const d = new Date(rawDate)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

const clearInput = () => {
  youtubeUrl.value = ''
  errorMsg.value = ''
  infoMsg.value = ''
}

const triggerGoogleSignIn = async () => {
  if (signingInGuest.value) return
  signingInGuest.value = true
  try {
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      signingInGuest.value = false
      navigateTo('/login')
    }
  } catch {
    signingInGuest.value = false
    navigateTo('/login')
  }
}

const handleGuestSubmit = async () => {
  errorMsg.value = ''
  let ytUrl = youtubeUrl.value.trim()
  if (ytUrl) {
    if (!ytUrl.startsWith('http://') && !ytUrl.startsWith('https://')) {
      ytUrl = 'https://' + ytUrl
      youtubeUrl.value = ytUrl
    }
    if (!videoService.isValidYoutubeUrl(ytUrl)) {
      errorMsg.value = t('home.errors.invalidUrl')
      return
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PENDING_URL_KEY, ytUrl)
    }
  }
  await triggerGoogleSignIn()
}

const selectRecentVideoAsGuest = async (vid) => {
  if (vid?.youtubeUrl && typeof localStorage !== 'undefined') {
    localStorage.setItem(PENDING_URL_KEY, vid.youtubeUrl)
  }
  await triggerGoogleSignIn()
}

const getBrowserLanguage = () => {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.split('-')[0]
    if (lang && lang.length === 2) return lang
  }
  return 'en'
}

const waitForYoutubeTask = async (taskId) => {
  let consecutiveErrors = 0
  while (!isUnmounted && !cancelledByUser) {
    await new Promise((resolve) => setTimeout(resolve, 2500))
    if (isUnmounted || cancelledByUser) throw new Error('Cancelled')
    try {
      const task = await videoService.getYoutubeTaskStatus(taskId)
      consecutiveErrors = 0
      if (!task) continue

      if (task.status === 'cancelled') {
        throw new Error('Cancelled')
      }
      if (task.phase && task.status === 'running') {
        processingPhase.value = task.phase
        processingSubDetail.value = task.detail || ''
      }
      if (task.status === 'completed') {
        return task
      }
      if (task.status === 'error') {
        throw new Error(task.error || 'Failed to analyze YouTube video.')
      }
    } catch (pollErr) {
      if (pollErr.message === 'Cancelled') throw pollErr
      if (pollErr.response?.status === 404) {
        throw new Error(t('home.errors.taskExpired'))
      }
      if (!pollErr.response && pollErr.message && !/network|timeout|fetch/i.test(pollErr.message)) {
        throw pollErr
      }
      consecutiveErrors++
      if (consecutiveErrors >= 6) {
        throw new Error(t('home.errors.connectionLost'))
      }
    }
  }
  throw new Error('Cancelled')
}

const handleCancelAnalysis = async () => {
  if (!processing.value || cancelling.value) return
  cancelling.value = true
  cancelledByUser = true
  stopTimers()

  const taskToCancel = activeTaskId
  const projToDelete = activeProjUid
  const clientUid = authStore.clientUid

  activeTaskId = null
  activeProjUid = null

  try {
    if (taskToCancel) {
      await videoService.cancelYoutubeTask(taskToCancel).catch(() => {})
    }
    if (projToDelete && clientUid) {
      await videoService.removeVideo(clientUid, projToDelete).catch(() => {})
    }
  } finally {
    cancelling.value = false
    processing.value = false
    processingSubDetail.value = ''
    infoMsg.value = t('home.analysisCancelled')
  }
}

const handleAddVideo = async () => {
  if (processing.value) return
  errorMsg.value = ''
  infoMsg.value = ''
  cancelledByUser = false
  activeTaskId = null
  activeProjUid = null

  let ytUrl = youtubeUrl.value.trim()
  if (!ytUrl) {
    errorMsg.value = t('home.errors.emptyUrl')
    return
  }
  if (!ytUrl.startsWith('http://') && !ytUrl.startsWith('https://')) {
    ytUrl = 'https://' + ytUrl
    youtubeUrl.value = ytUrl
  }
  if (!videoService.isValidYoutubeUrl(ytUrl)) {
    errorMsg.value = t('home.errors.invalidUrl')
    return
  }

  const clientUid = authStore.clientUid
  if (!clientUid) {
    errorMsg.value = t('home.errors.sessionExpired')
    return
  }

  // Prevent duplicate scraping: if this video ID is already in My Videos, open it directly
  const targetVideoId = videoService.extractYoutubeId(ytUrl)
  if (targetVideoId) {
    if (videosStore.videos.length === 0) {
      await videosStore.fetchVideos(clientUid)
    }
    const existing = videosStore.videos.find(
      (v) => videoService.extractYoutubeId(v.proj_youtube_url || '') === targetVideoId
    )
    if (existing) {
      infoMsg.value = t('home.alreadyExists')
      youtubeUrl.value = ''
      autoStartAgent.value = true
      await videosStore.selectVideo(existing.proj_uid)
      return
    }
  }

  processing.value = true
  processingUrl.value = ytUrl
  processingPhase.value = t('home.phases.creatingProfile')
  processingSubDetail.value = t('home.phases.configuringRules')
  startTimer()

  const lang = getBrowserLanguage()
  let createdProjUid = null

  try {
    const createRes = await videoService.createYoutubeProject({
      clientUid,
      language: lang,
      projectName: 'YouTube Video',
    })

    if (cancelledByUser) {
      if (createRes?.results?.proj_uid) {
        videoService.removeVideo(clientUid, createRes.results.proj_uid).catch(() => {})
      }
      return
    }

    if (!createRes?.success || !createRes?.results?.proj_uid) {
      throw new Error(t('home.errors.createProjectFailed'))
    }

    const projUid = createRes.results.proj_uid
    createdProjUid = projUid
    activeProjUid = projUid

    processingPhase.value = t('home.phases.connectingYoutube')
    processingSubDetail.value = t('home.phases.checkingDuration')

    const ytRes = await videoService.startYoutubeAnalysis({
      projectUid: projUid,
      clientUid,
      youtubeUrl: ytUrl,
    })

    let ytFinalResult = ytRes?.results || {}
    if (ytFinalResult.taskId) {
      activeTaskId = ytFinalResult.taskId
      if (cancelledByUser) {
        videoService.cancelYoutubeTask(activeTaskId).catch(() => {})
        videoService.removeVideo(clientUid, projUid).catch(() => {})
        return
      }
      ytFinalResult = await waitForYoutubeTask(ytFinalResult.taskId)
    }

    if (cancelledByUser) return

    const sourceLabel = ytFinalResult?.sourceName || ytUrl

    processingPhase.value = t('home.phases.finalizing')
    processingSubDetail.value = t('home.phases.agentReady', { label: sourceLabel })
    stopTimers()
    processing.value = false
    processingSubDetail.value = ''
    activeTaskId = null
    activeProjUid = null
    youtubeUrl.value = ''

    autoStartAgent.value = true
    await Promise.all([
      videosStore.fetchVideos(clientUid),
      videosStore.selectVideo(projUid),
    ])
  } catch (err) {
    if (isUnmounted || cancelledByUser || err?.message === 'Cancelled') return
    stopTimers()
    processing.value = false
    processingSubDetail.value = ''
    activeTaskId = null
    activeProjUid = null

    const errCode = err?.response?.data?.code
    if (createdProjUid && (errCode === 'EMBED_DISABLED' || err?.response?.status === 403)) {
      videoService.removeVideo(clientUid, createdProjUid).catch(() => {})
    }

    if (errCode === 'EMBED_DISABLED') {
      errorMsg.value = t('home.errors.embedDisabled')
    } else {
      errorMsg.value = err?.response?.data?.message || err?.message || t('home.errors.genericProcessing')
    }
  }
}

const onConversationEnded = async () => {
  await authStore.refreshCredits(supabase)
}

watch(
  () => authStore.isAuthenticated,
  async (isAuth) => {
    if (!isAuth && !initializingAuth.value && recentVideos.value.length === 0) {
      recentVideos.value = await videoService.getRecentVideos(10)
    }
  }
)

onMounted(async () => {
  let pendingAutoScanUrl = ''
  try {
    const { data } = await supabase.auth.getSession()
    if (data?.session) {
      if (!authStore.isAuthenticated) {
        await authStore.hydrateFromSession(supabase, data.session)
      }
      if (typeof localStorage !== 'undefined') {
        const pendingUrl = localStorage.getItem(PENDING_URL_KEY)
        if (pendingUrl) {
          pendingAutoScanUrl = pendingUrl
          youtubeUrl.value = pendingUrl
          localStorage.removeItem(PENDING_URL_KEY)
        }
      }
      if (authStore.clientUid) {
        if (pendingAutoScanUrl) {
          await videosStore.fetchVideos(authStore.clientUid)
        } else {
          videosStore.fetchVideos(authStore.clientUid)
        }
      }
    } else {
      // Guest landing page: load the 10 most recently scraped public YouTube videos
      recentVideos.value = await videoService.getRecentVideos(10)
    }
  } finally {
    initializingAuth.value = false
  }

  // Auto-start scan right after returning from Google sign-in with a pending URL
  if (pendingAutoScanUrl && authStore.isAuthenticated && !isUnmounted) {
    handleAddVideo()
  }
})

onUnmounted(() => {
  isUnmounted = true
  stopTimers()
})
</script>

<style scoped>
.hero-headline {
  font-size: clamp(1.75rem, 6.2vw, 3.6rem);
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.hero-subtitle {
  font-size: 0.95rem;
  line-height: 1.55;
  color: #475569;
}

@media (min-width: 600px) {
  .hero-subtitle {
    font-size: 1.08rem;
    line-height: 1.6;
  }
}

.yt-input-pill {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  height: 44px;
  padding: 0 12px;
  min-width: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.yt-input-pill--hero {
  height: 48px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

.yt-input-pill:focus-within {
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.14);
}

.yt-input-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #0f172a;
  background: transparent;
  min-width: 0;
}

.yt-input-field::placeholder {
  color: #94a3b8;
}

.yt-clear-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  line-height: 1;
  border-radius: 50%;
}

.yt-clear-btn:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.inline-plus-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #2196F3;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  margin: 0 2px;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
}

.recent-video-card {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.recent-video-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1) !important;
  border-color: #cbd5e1;
}

.recent-thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #0f172a;
  overflow: hidden;
}

.recent-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recent-play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.recent-video-card:hover .recent-play-overlay {
  opacity: 1;
}

/* On touch devices (tablets / phones), keep a subtle play badge visible */
@media (hover: none) {
  .recent-play-overlay {
    opacity: 0.72;
    background: rgba(15, 23, 42, 0.16);
  }
}

.recent-video-title {
  font-size: 0.88rem;
  line-height: 1.35;
  color: #0f172a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
