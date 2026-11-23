<template>
  <div v-if="project" class="video-player-wrapper d-flex flex-column align-center w-100">
    <!-- YouTube Video Player Card -->
    <v-card
      v-if="youtubeVideoId"
      class="mb-3 mb-sm-4 link-preview-card overflow-hidden w-100"
      variant="elevated"
      :style="{
        maxWidth: playerMaxWidth,
        border: '1px solid #eaeaea',
        borderRadius: project.proj_link_border_radius || '12px'
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

        <!-- Honest fallback when video owner disables embedding (YouTube error 101 / 150) -->
        <div
          v-else
          style="position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden;"
        >
          <img
            :src="youtubeThumbnailUrl"
            :alt="videoTitle"
            style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.32);"
          />
          <div
            class="d-flex flex-column align-center justify-center text-center pa-3 pa-sm-4"
            style="position: absolute; inset: 0; color: white;"
          >
            <v-chip size="x-small" color="warning" variant="flat" class="mb-2 font-weight-bold">
              <v-icon start size="14">mdi-alert-outline</v-icon>
              Fonctions limitées
            </v-chip>
            <div class="text-caption mb-3" style="max-width: 340px; color: rgba(255,255,255,0.92); line-height: 1.4;">
              La chaîne YouTube interdit la lecture intégrée : le pilotage de la vidéo (positionnement sur un passage, pause/reprise synchronisée) n'est pas disponible. Vous pouvez toutefois poser vos questions à l'assistant ci-dessous.
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
              <v-icon start color="red-darken-1" size="18">mdi-youtube</v-icon>
              Regarder sur YouTube
            </v-btn>
          </div>
        </div>
      </div>

      <v-card-text v-if="videoTitle" class="pa-3 d-flex align-center justify-space-between ga-2">
        <div class="text-subtitle-2 font-weight-bold text-black d-flex align-center" style="line-height: 1.3; min-width: 0;">
          <v-icon size="small" color="red-darken-1" class="mr-2 flex-shrink-0">mdi-youtube</v-icon>
          <span style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            {{ videoTitle }}
          </span>
        </div>
        <div v-if="showShareActions" class="d-flex align-center flex-shrink-0">
          <v-btn
            icon
            size="x-small"
            variant="text"
            color="grey-darken-1"
            :title="copied ? 'Lien copié !' : 'Copier le lien de partage'"
            @click="copyShareLink"
          >
            <v-icon size="18" :color="copied ? 'success' : undefined">
              {{ copied ? 'mdi-check' : 'mdi-link-variant' }}
            </v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- No-credits blocking alert (when user has 0 credits) -->
    <v-card
      v-if="creditsDepleted"
      variant="outlined"
      class="mb-4 pa-4 pa-sm-5 text-center w-100"
      :style="{
        maxWidth: playerMaxWidth,
        borderColor: '#fecaca',
        background: '#fef2f2',
        borderRadius: project.proj_link_border_radius || '12px'
      }"
    >
      <v-icon color="error" size="36" class="mb-2">mdi-clock-alert-outline</v-icon>
      <div class="text-subtitle-1 font-weight-bold text-red-darken-2 mb-1">
        Crédits épuisés (0 min restante)
      </div>
      <div class="text-body-2 text-grey-darken-2 mb-4">
        Rechargez votre compte pour continuer à discuter avec vos vidéos YouTube.
      </div>
      <v-btn
        color="var(--talkizColorBtn)"
        class="text-white font-weight-bold"
        rounded="pill"
        elevation="2"
        to="/billing"
      >
        <v-icon start>mdi-lightning-bolt</v-icon>
        Recharger mes crédits
      </v-btn>
    </v-card>

    <!-- Talkiz Voice Agent Player (LiveBannerPlayer or RealtimeBannerPlayer) -->
    <div v-else class="w-100 d-flex justify-center" :style="{ maxWidth: playerMaxWidth }">
      <component
        :is="playerComponent"
        :key="project.proj_uid"
        ref="agentPlayer"
        :projectConfig="project"
        :clientUid="project.proj_client_uid || project.client_uid"
        :projectUid="project.proj_uid"
        width="100%"
        :height="project.proj_link_height || '150px'"
        style="width: 100%; max-width: 100%;"
        :bgColor="project.proj_link_display_bg_color || 'white'"
        :bgCustom="project.proj_link_display_bg_custom || '#FFFFFF'"
        :textColor="project.proj_link_display_text_color || 'black'"
        :textCustom="project.proj_link_display_text_custom || '#000000'"
        :borderRadius="project.proj_link_border_radius || '12px'"
        :invitationText="project.proj_link_invitation_text || 'Ou cliquez ici et je répondrai à vos questions !'"
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

    <!-- Footer copyright -->
    <div
      class="d-flex justify-center align-center mt-3 w-100"
      :style="{ maxWidth: playerMaxWidth, padding: '0 4px' }"
    >
      <div style="font-size: 11px; color: #94a3b8;">
        &copy; 2026 Talkiz.ai — 1 crédit = 1 minute
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import RealtimeBannerPlayer from '../avatar/RealtimeBannerPlayer.vue'
import LiveBannerPlayer from '../avatar/LiveBannerPlayer.vue'
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
  showShareActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['conversation-ended'])

const config = useRuntimeConfig()
const agentPlayer = ref(null)
const youtubeIframe = ref(null)
const copied = ref(false)
const embedBlocked = ref(false)

const playerMaxWidth = computed(() => props.project?.proj_link_width || '440px')

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

const shareUrl = computed(() => {
  const base = (config.public.SHARE_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://video.talkiz.ai')).replace(/\/$/, '')
  const slugOrId = props.project?.proj_slug || props.project?.proj_uid || ''
  return slugOrId ? `${base}/${slugOrId}` : base
})

const playerComponent = computed(() => {
  return props.project?.model_id === 3 ? LiveBannerPlayer : RealtimeBannerPlayer
})

const copyShareLink = async () => {
  if (!shareUrl.value || typeof navigator === 'undefined') return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.warn('Clipboard copy failed:', e)
  }
}

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

watch(() => props.project?.proj_uid, () => {
  clearYoutubeUserPauseTimer()
  isYoutubeCurrentlyPlaying = false
  embedBlocked.value = false
})

onMounted(() => {
  window.addEventListener('message', handleYoutubeMessage)
})

onBeforeUnmount(() => {
  clearYoutubeUserPauseTimer()
  window.removeEventListener('message', handleYoutubeMessage)
})
</script>
