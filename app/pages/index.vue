<template>
  <div class="d-flex flex-column align-center px-3 py-4 px-sm-4 py-sm-6" style="min-height: calc(100vh - 58px);">
    <!-- 1. YouTube URL Bar (always visible at top, mobile-friendly) -->
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
        @conversation-ended="onConversationEnded"
      />
    </div>

    <!-- Empty welcome state when no video is selected yet -->
    <div v-else class="d-flex flex-column align-center text-center mt-14 px-4" style="max-width: 480px;">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useVideosStore } from '../../stores/videos'
import videoService from '../services/video.service.js'
import VideoPlayerCard from '../components/video/VideoPlayerCard.vue'

definePageMeta({
  middleware: 'auth',
})

const supabase = useSupabaseClient()
const authStore = useAuthStore()
const videosStore = useVideosStore()
const { t } = useI18n()

const youtubeUrl = ref('')
const errorMsg = ref('')
const processing = ref(false)
const processingUrl = ref('')
const processingPhase = ref('')
const processingSubDetail = ref('')
const elapsedSec = ref(0)

let elapsedTimer = null
let isUnmounted = false

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

const clearInput = () => {
  youtubeUrl.value = ''
  errorMsg.value = ''
}

const getBrowserLanguage = () => {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.split('-')[0]
    if (lang && lang.length === 2) return lang
  }
  return 'fr'
}

const waitForYoutubeTask = async (taskId) => {
  let consecutiveErrors = 0
  while (!isUnmounted) {
    await new Promise((resolve) => setTimeout(resolve, 2500))
    if (isUnmounted) throw new Error('Cancelled')
    try {
      const task = await videoService.getYoutubeTaskStatus(taskId)
      consecutiveErrors = 0
      if (!task) continue

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

const handleAddVideo = async () => {
  if (processing.value) return
  errorMsg.value = ''

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

  processing.value = true
  processingUrl.value = ytUrl
  processingPhase.value = t('home.phases.creatingProfile')
  processingSubDetail.value = t('home.phases.configuringRules')
  startTimer()

  const lang = getBrowserLanguage()
  let createdProjUid = null

  try {
    // 1. Create YouTube project shell
    const createRes = await videoService.createYoutubeProject({
      clientUid,
      language: lang,
      projectName: 'YouTube Video',
    })

    if (!createRes?.success || !createRes?.results?.proj_uid) {
      throw new Error(t('home.errors.createProjectFailed'))
    }

    const projUid = createRes.results.proj_uid
    createdProjUid = projUid

    // 2. Launch async multimodal YouTube analysis (includes backend EMBED_DISABLED pre-flight check)
    processingPhase.value = t('home.phases.connectingYoutube')
    processingSubDetail.value = t('home.phases.checkingDuration')

    const ytRes = await videoService.startYoutubeAnalysis({
      projectUid: projUid,
      clientUid,
      youtubeUrl: ytUrl,
    })

    let ytFinalResult = ytRes?.results || {}
    if (ytFinalResult.taskId) {
      ytFinalResult = await waitForYoutubeTask(ytFinalResult.taskId)
    }

    const sourceLabel = ytFinalResult?.sourceName || ytUrl

    // 3. Refresh videos list & load the new player directly below the URL input
    processingPhase.value = t('home.phases.finalizing')
    processingSubDetail.value = t('home.phases.agentReady', { label: sourceLabel })
    stopTimers()
    processing.value = false
    processingSubDetail.value = ''
    youtubeUrl.value = ''

    await Promise.all([
      videosStore.fetchVideos(clientUid),
      videosStore.selectVideo(projUid),
    ])
  } catch (err) {
    if (isUnmounted) return
    stopTimers()
    processing.value = false
    processingSubDetail.value = ''

    const errCode = err?.response?.data?.code
    // Clean up empty orphan project shell if video was rejected pre-flight
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
  // Update credit counter after conversation ends (not real-time)
  await authStore.refreshCredits(supabase)
}

onMounted(async () => {
  if (authStore.clientUid) {
    await videosStore.fetchVideos(authStore.clientUid)
  }
})

onUnmounted(() => {
  isUnmounted = true
  stopTimers()
})
</script>

<style scoped>
.yt-input-pill {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  height: 44px;
  padding: 0 12px;
  min-width: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
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
</style>
