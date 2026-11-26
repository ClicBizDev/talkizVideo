<template>
  <div v-if="project" class="workspace-3col w-100">
    <!-- Column 1 (Desktop left / Narrow below video+agent): My Videos sidebar slot -->
    <div v-if="$slots.sidebar" class="col-my-videos">
      <slot name="sidebar" />
    </div>

    <!-- Column 2 (Desktop center wide / Narrow top): YouTube Video Player Card -->
    <div class="col-video-player">
      <v-card
        v-if="youtubeVideoId"
        class="link-preview-card overflow-hidden w-100"
        variant="elevated"
        :style="{
          border: '1px solid #e2e8f0',
          borderRadius: project.proj_link_border_radius || '14px'
        }"
      >
        <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; background: #000;">
          <iframe
            v-if="!embedBlocked"
            ref="youtubeIframe"
            :key="youtubeVideoId"
            :src="youtubeEmbedUrl"
            @load="onYoutubeIframeLoad"
            style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>

          <!-- Strict block when video owner disables embedding (YouTube error 101 / 150) -->
          <div
            v-else
            style="position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden;"
          >
            <img
              :src="youtubeThumbnailUrl"
              :alt="videoTitle"
              style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.28);"
            />
            <div
              class="d-flex flex-column align-center justify-center text-center pa-3 pa-sm-4"
              style="position: absolute; inset: 0; color: white;"
            >
              <v-icon color="warning" size="28" class="mb-2">mdi-block-helper</v-icon>
              <div class="text-caption mb-3" style="max-width: 340px; color: rgba(255,255,255,0.95); line-height: 1.45;">
                {{ t('player.embedDisabledNotice') }}
              </div>
              <v-btn
                :href="youtubeWatchUrl"
                target="_blank"
                rel="noopener noreferrer"
                color="white"
                variant="flat"
                rounded="pill"
                size="small"
                class="text-none font-weight-bold text-black px-4"
              >
                <v-icon start size="18">mdi-open-in-new</v-icon>
                {{ t('player.watchOnYoutube') }}
              </v-btn>
            </div>
          </div>
        </div>

        <v-card-text v-if="videoTitle" class="pa-3 pa-sm-4 d-flex align-center justify-space-between ga-2" style="background: #ffffff;">
          <div class="text-subtitle-1 font-weight-bold text-black d-flex align-center" style="line-height: 1.3; min-width: 0;">
            <v-icon size="20" color="primary" class="mr-2 flex-shrink-0">mdi-play-circle-outline</v-icon>
            <span style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ videoTitle }}
            </span>
          </div>
          <div class="d-flex align-center flex-shrink-0">
            <v-tooltip :text="t('player.watchOnYoutube')" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon
                  size="small"
                  variant="text"
                  color="grey-darken-1"
                  :href="youtubeWatchUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="t('player.watchOnYoutube')"
                >
                  <v-icon size="20">mdi-open-in-new</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Column 3 (Desktop right / Narrow directly under video): Talkiz Voice Agent -->
    <div class="col-talkiz-agent">
      <!-- No-credits blocking alert (when user has 0 credits) -->
      <v-card
        v-if="creditsDepleted"
        variant="outlined"
        class="pa-4 pa-sm-5 text-center w-100"
        :style="{
          borderColor: '#fecaca',
          background: '#fef2f2',
          borderRadius: project.proj_link_border_radius || '14px'
        }"
      >
        <v-icon color="error" size="36" class="mb-2">mdi-clock-alert-outline</v-icon>
        <div class="text-subtitle-1 font-weight-bold text-red-darken-2 mb-1">
          {{ t('player.creditsDepletedTitle') }}
        </div>
        <div class="text-body-2 text-grey-darken-2 mb-4">
          {{ t('player.creditsDepletedSubtitle') }}
        </div>
        <v-btn
          color="var(--talkizColorBtn)"
          class="text-white font-weight-bold"
          rounded="pill"
          elevation="2"
          to="/billing"
        >
          <v-icon start>mdi-lightning-bolt</v-icon>
          {{ t('player.topUpCredits') }}
        </v-btn>
      </v-card>

      <!-- Talkiz Voice Agent Player (strictly disabled if YouTube embed is blocked by creator) -->
      <div
        v-else-if="!embedBlocked"
        class="agent-column-inner w-100 d-flex flex-column"
      >
        <div class="agent-player-slot w-100 flex-grow-1 d-flex flex-column" @click.capture="onPlayerAreaClick">
          <component
            :is="playerComponent"
            :key="project.proj_uid"
            ref="agentPlayer"
            :projectConfig="project"
            :clientUid="project.proj_client_uid || project.client_uid"
            :projectUid="project.proj_uid"
            width="100%"
            height="100%"
            style="width: 100%; max-width: 100%; flex: 1;"
            :bgColor="project.proj_link_display_bg_color || 'white'"
            :bgCustom="project.proj_link_display_bg_custom || '#FFFFFF'"
            :textColor="project.proj_link_display_text_color || 'black'"
            :textCustom="project.proj_link_display_text_custom || '#000000'"
            :borderRadius="project.proj_link_border_radius || '14px'"
            :invitationText="project.proj_link_invitation_text || t('player.defaultInvitation')"
            :voiceType="project.proj_oart_voice_type"
            :voiceSpeed="project.proj_oart_voice_speed"
            :temperature="project.proj_oart_temperature"
            :suggestedQuestions="[
              project.proj_plugin_btn_text_1,
              project.proj_plugin_btn_text_2,
              project.proj_plugin_btn_text_3,
              project.proj_plugin_btn_text_4,
              project.proj_plugin_btn_text_5
            ]"
            :autoStart="false"
            :hasEmbeddedYoutubePlayer="!!youtubeVideoId && !embedBlocked"
            @conversation-started="handleConversationStarted"
            @seek-youtube="seekYoutubeVideo"
            @close="handleConversationEnded"
          />
        </div>

        <!-- AI Act Transparency Notice (permanently visible at the bottom of the agent column) -->
        <div
          class="d-flex align-start ga-2 mt-2 px-1 text-left w-100 flex-shrink-0"
          style="font-size: 11.5px; color: #475569; line-height: 1.4;"
        >
          <v-icon size="15" color="#475569" class="mt-0 flex-shrink-0" style="margin-top: 2px;">mdi-information-outline</v-icon>
          <span>
            {{ t('player.aiActNotice') }}
          </span>
        </div>
      </div>
    </div>

    <!-- RGPD Microphone Consent Modal before first WebRTC / OpenAI activation -->
    <v-dialog v-model="showMicConsentDialog" max-width="440" width="calc(100% - 24px)" persistent>
      <v-card rounded="xl" class="pa-3">
        <v-card-title class="d-flex align-center ga-2 text-subtitle-1 font-weight-bold pb-1">
          <v-avatar size="34" color="#eff6ff">
            <v-icon size="20" color="#2196F3">mdi-microphone-outline</v-icon>
          </v-avatar>
          <span>{{ t('player.micConsent.title') }}</span>
        </v-card-title>

        <v-card-text class="text-body-2 text-grey-darken-2 pt-3 pb-2" style="line-height: 1.55;">
          {{ t('player.micConsent.bodyBefore') }}<strong>{{ t('player.micConsent.bodyProvider') }}</strong>{{ t('player.micConsent.bodyAfter') }}
          <div class="mt-3">
            <NuxtLink
              to="/confidentialite"
              target="_blank"
              class="text-caption font-weight-medium"
              style="color: #2196F3; text-decoration: underline;"
            >
              {{ t('player.micConsent.privacyLink') }}
            </NuxtLink>
          </div>
        </v-card-text>

        <v-card-actions class="justify-end ga-2 pt-3">
          <v-btn
            variant="text"
            color="grey-darken-1"
            class="text-none"
            @click="cancelMicConsent"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="pill"
            class="text-white text-none font-weight-bold px-5"
            style="background-color: #2196F3 !important;"
            @click="acceptMicConsent"
          >
            <v-icon start size="18">mdi-microphone</v-icon>
            {{ t('player.micConsent.allowButton') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import RealtimeBannerPlayer from '../avatar/RealtimeBannerPlayer.vue'
import LiveBannerPlayer from '../avatar/LiveBannerPlayer.vue'
import GeminiLiveBannerPlayer from '../avatar/GeminiLiveBannerPlayer.vue'
import videoService from '../../services/video.service.js'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  creditsDepleted: {
    type: Boolean,
    default: false,
  },
  autoStartAgent: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['conversation-ended', 'auto-started'])
const { t } = useI18n()

const agentPlayer = ref(null)
const youtubeIframe = ref(null)
const embedBlocked = ref(false)

// ── RGPD Microphone Consent Gate ───────────────────────────────────────────
const showMicConsentDialog = ref(false)
const micConsentAccepted = ref(false)
let pendingClickTarget = null

const getConsentStorageKey = () => {
  const uid = props.project?.proj_client_uid || props.project?.client_uid || ''
  return uid ? `mic_consent_accepted_${uid}` : 'mic_consent_accepted'
}

const loadMicConsent = async () => {
  if (typeof localStorage === 'undefined') return
  const userKey = getConsentStorageKey()
  const stored =
    localStorage.getItem(userKey) === 'true' ||
    localStorage.getItem('mic_consent_accepted') === 'true'

  // If the browser has NOT yet granted microphone permission ('prompt'), always show the RGPD disclaimer first
  if (stored && typeof navigator !== 'undefined' && navigator.permissions?.query) {
    try {
      const perm = await navigator.permissions.query({ name: 'microphone' })
      if (perm.state === 'prompt') {
        micConsentAccepted.value = false
        return
      }
    } catch {
      // Safari / browsers without microphone permission query: fall back to stored flag
    }
  }
  micConsentAccepted.value = stored
}

const onPlayerAreaClick = (event) => {
  if (micConsentAccepted.value) return
  event.stopPropagation()
  event.preventDefault()
  pendingClickTarget = event.target
  showMicConsentDialog.value = true
}

const cancelMicConsent = () => {
  showMicConsentDialog.value = false
  pendingClickTarget = null
}

const acceptMicConsent = async () => {
  micConsentAccepted.value = true
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('mic_consent_accepted', 'true')
    localStorage.setItem(getConsentStorageKey(), 'true')
  }
  showMicConsentDialog.value = false
  const targetToReplay = pendingClickTarget
  pendingClickTarget = null

  await nextTick()
  if (targetToReplay && typeof targetToReplay.click === 'function' && document.contains(targetToReplay)) {
    targetToReplay.click()
  } else if (agentPlayer.value && typeof agentPlayer.value.handleBannerClick === 'function') {
    agentPlayer.value.handleBannerClick()
  }
}

const playerMaxWidth = computed(() => props.project?.proj_link_width || '520px')

const videoTitle = computed(() => props.project?.proj_youtube_title || props.project?.proj_name || '')

const youtubeVideoId = computed(() => videoService.extractYoutubeId(props.project?.proj_youtube_url || ''))

const youtubeThumbnailUrl = computed(() => {
  if (!youtubeVideoId.value) return ''
  return `https://img.youtube.com/vi/${youtubeVideoId.value}/hqdefault.jpg`
})

const youtubeWatchUrl = computed(() => {
  if (!youtubeVideoId.value) return props.project?.proj_youtube_url || 'https://www.youtube.com'
  return `https://www.youtube.com/watch?v=${youtubeVideoId.value}`
})

const youtubeEmbedUrl = computed(() => {
  if (!youtubeVideoId.value) return ''
  return `https://www.youtube.com/embed/${youtubeVideoId.value}?enablejsapi=1&rel=0&modestbranding=1`
})

const playerComponent = computed(() => {
  if (props.project?.model_id === 4) return GeminiLiveBannerPlayer
  if (props.project?.model_id === 3) return LiveBannerPlayer
  return RealtimeBannerPlayer
})

// ── Bidirectional YouTube IFrame <-> Talkiz Player sync ────────────────────
let isYoutubeCurrentlyPlaying = false
let programmaticYoutubeActionUntil = 0
let youtubeUserPauseTimer = null

const clearYoutubeUserPauseTimer = () => {
  if (youtubeUserPauseTimer) {
    clearTimeout(youtubeUserPauseTimer)
    youtubeUserPauseTimer = null
  }
}

const sendYoutubeCommand = (func, args = []) => {
  const win = youtubeIframe.value?.contentWindow
  if (!win) return
  try {
    win.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
  } catch (e) {
    console.warn('[TalkizVideo] Failed to send YouTube command:', e)
  }
}

const onYoutubeIframeLoad = () => {
  const win = youtubeIframe.value?.contentWindow
  if (!win) return
  try {
    win.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*')
    win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*')
    win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onError'] }), '*')
  } catch (e) {
    console.warn('[TalkizVideo] Failed to register YouTube state listener:', e)
  }
}

const handleYoutubeMessage = (event) => {
  if (!event.origin || !event.origin.includes('youtube.com')) return
  let data = event.data
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch { return }
  }
  if (!data || typeof data !== 'object') return

  // Detect YouTube embed-disabled error (101 / 150)
  if (data.event === 'onError' && (data.info === 101 || data.info === 150)) {
    embedBlocked.value = true
    return
  }

  let playerState = null
  if (data.event === 'onStateChange' && typeof data.info === 'number') {
    playerState = data.info
  } else if (data.event === 'infoDelivery' && data.info && typeof data.info.playerState === 'number') {
    playerState = data.info.playerState
  }

  if (playerState === 1) {
    clearYoutubeUserPauseTimer()
    isYoutubeCurrentlyPlaying = true
    if (agentPlayer.value) {
      if (typeof agentPlayer.value.setExternalMediaPlaying === 'function') {
        agentPlayer.value.setExternalMediaPlaying(true)
      }
      if (agentPlayer.value.bannerState === 'conversation' && !agentPlayer.value.isPaused) {
        if (typeof agentPlayer.value.pauseAgent === 'function') {
          agentPlayer.value.pauseAgent()
        } else if (typeof agentPlayer.value.togglePause === 'function') {
          agentPlayer.value.togglePause()
        }
      }
    }
  } else if (playerState === 3) {
    clearYoutubeUserPauseTimer()
  } else if (playerState === 2 || playerState === 0) {
    if (agentPlayer.value && typeof agentPlayer.value.setExternalMediaPlaying === 'function') {
      agentPlayer.value.setExternalMediaPlaying(false)
    }
    if (isYoutubeCurrentlyPlaying && Date.now() > programmaticYoutubeActionUntil) {
      clearYoutubeUserPauseTimer()
      const delayMs = playerState === 0 ? 150 : 700
      youtubeUserPauseTimer = setTimeout(() => {
        youtubeUserPauseTimer = null
        isYoutubeCurrentlyPlaying = false
        if (
          agentPlayer.value &&
          agentPlayer.value.bannerState === 'conversation' &&
          typeof agentPlayer.value.onExternalMediaStoppedByUser === 'function'
        ) {
          agentPlayer.value.onExternalMediaStoppedByUser()
        }
      }, delayMs)
    } else {
      isYoutubeCurrentlyPlaying = false
    }
  }
}

const pauseYoutubeVideo = () => {
  if (embedBlocked.value) return
  clearYoutubeUserPauseTimer()
  programmaticYoutubeActionUntil = Date.now() + 1500
  isYoutubeCurrentlyPlaying = false
  sendYoutubeCommand('pauseVideo', [])
  if (agentPlayer.value && typeof agentPlayer.value.setExternalMediaPlaying === 'function') {
    agentPlayer.value.setExternalMediaPlaying(false)
  }
}

const seekYoutubeVideo = (seconds) => {
  if (embedBlocked.value) return
  clearYoutubeUserPauseTimer()
  programmaticYoutubeActionUntil = Date.now() + 1500
  const sec = Math.max(0, Math.floor(Number(seconds) || 0))
  // On mobile / narrow screens, scroll smoothly to the top so the full YouTube player is visible
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (agentPlayer.value) {
    if (typeof agentPlayer.value.pauseAgent === 'function') {
      agentPlayer.value.pauseAgent()
    } else if (agentPlayer.value.bannerState === 'conversation' && !agentPlayer.value.isPaused && typeof agentPlayer.value.togglePause === 'function') {
      agentPlayer.value.togglePause()
    }
    if (typeof agentPlayer.value.setExternalMediaPlaying === 'function') {
      agentPlayer.value.setExternalMediaPlaying(true)
    }
  }
  onYoutubeIframeLoad()
  sendYoutubeCommand('seekTo', [sec, true])
  sendYoutubeCommand('playVideo', [])
}

const handleConversationStarted = () => {
  pauseYoutubeVideo()
}

const handleConversationEnded = () => {
  setTimeout(() => {
    emit('conversation-ended')
  }, 1500)
}

const triggerAutoStartIfRequested = async () => {
  if (!props.autoStartAgent || props.creditsDepleted || embedBlocked.value || !props.project?.proj_uid) {
    return
  }
  emit('auto-started')
  await loadMicConsent()
  await nextTick()
  setTimeout(() => {
    if (props.creditsDepleted || embedBlocked.value) return
    if (!micConsentAccepted.value) {
      showMicConsentDialog.value = true
      return
    }
    if (agentPlayer.value && typeof agentPlayer.value.handleBannerClick === 'function') {
      agentPlayer.value.handleBannerClick()
    }
  }, 350)
}

watch(() => props.project?.proj_uid, () => {
  clearYoutubeUserPauseTimer()
  isYoutubeCurrentlyPlaying = false
  embedBlocked.value = false
  triggerAutoStartIfRequested()
})

watch(() => props.autoStartAgent, (val) => {
  if (val) triggerAutoStartIfRequested()
})

onMounted(() => {
  loadMicConsent()
  window.addEventListener('message', handleYoutubeMessage)
  triggerAutoStartIfRequested()
})

onBeforeUnmount(() => {
  clearYoutubeUserPauseTimer()
  window.removeEventListener('message', handleYoutubeMessage)
})
</script>

<style scoped>
/* Narrow screens (mobile & portrait tablet): Video -> Agent -> My Videos */
.workspace-3col {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  width: 100%;
  max-width: 100%;
}

.col-video-player {
  order: 1;
  min-width: 0;
}

.col-talkiz-agent {
  order: 2;
  min-width: 0;
}

.col-my-videos {
  order: 3;
  min-width: 0;
}

/* Wide screens (>= 1024px): Full-width & full-height 3 columns */
@media (min-width: 1024px) {
  .workspace-3col {
    grid-template-columns: 240px minmax(0, 1fr) 350px;
    gap: 16px;
    align-items: stretch;
    min-height: calc(100vh - 150px);
  }

  .col-my-videos {
    order: 1;
    position: sticky;
    top: 76px;
    height: calc(100vh - 150px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .col-video-player {
    order: 2;
  }

  .col-talkiz-agent {
    order: 3;
    position: sticky;
    top: 76px;
    height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;
  }

  .agent-column-inner {
    height: 100%;
    min-height: 0;
  }

  .agent-player-slot {
    min-height: 0;
    overflow-y: auto;
  }
}

@media (min-width: 1360px) {
  .workspace-3col {
    grid-template-columns: 260px minmax(0, 1fr) 380px;
    gap: 20px;
  }
}
</style>
