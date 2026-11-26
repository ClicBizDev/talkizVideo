<template>
  <div
    class="gemini-live-banner-player"
    :style="bannerStyle"
    @click="handleBannerClick"
  >
    <!-- Top Right Controls (Visible during conversation) -->
    <div
      v-if="hasSessionStarted"
      style="position: absolute; top: 6px; right: 6px; display: flex; gap: 8px; z-index: 20;"
    >
      <!-- Play / Pause Button -->
      <button
        @click.stop="togglePause"
        style="color: white; background-color: rgba(0,0,0,0.6); border-radius: 50%; width: 36px; height: 36px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: background-color 0.2s;"
        :title="conversationEnded ? 'New question' : (isPaused ? 'Resume' : 'Pause')"
      >
        <svg v-if="isPaused || conversationEnded" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </button>

      <!-- Close / Reset Button -->
      <button
        @click.stop="abortConversation"
        style="color: white; background-color: rgba(0,0,0,0.6); border-radius: 50%; width: 36px; height: 36px; border: none; cursor: pointer; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: background-color 0.2s;"
        title="Stop and reset"
      >
        ✖
      </button>
    </div>

    <div class="banner-top-section" :style="topSectionStyle">
      <!-- Left Zone: Suggested Questions & Invitation -->
      <div class="banner-content" :style="contentStyle">
        <div v-if="bannerState === 'initial'" style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto;">
          <div v-if="activeSuggestedQuestions.length > 0" class="suggested-questions">
            <button
              v-for="(q, idx) in activeSuggestedQuestions"
              :key="idx"
              class="suggested-question-btn"
              :style="suggestedQuestionBtnStyle"
              @click.stop="handleSuggestedQuestion(q)"
            >
              <svg class="btn-sparkle-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10 4.5C10.6 9.3 13.7 12.4 18.5 13C13.7 13.6 10.6 16.7 10 21.5C9.4 16.7 6.3 13.6 1.5 13C6.3 12.4 9.4 9.3 10 4.5Z" />
                <path d="M19 1.7C19.3 3.9 20.6 5.2 22.8 5.5C20.6 5.8 19.3 7.1 19 9.3C18.7 7.1 17.4 5.8 15.2 5.5C17.4 5.2 18.7 3.9 19 1.7Z" />
              </svg>
              <span>{{ q }}</span>
            </button>
          </div>

          <button
            v-if="invitationText"
            class="invitation-text-btn"
            :style="suggestedQuestionBtnStyle"
            @click.stop="handleBannerClick()"
          >
            <svg class="btn-sparkle-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 4.5C10.6 9.3 13.7 12.4 18.5 13C13.7 13.6 10.6 16.7 10 21.5C9.4 16.7 6.3 13.6 1.5 13C6.3 12.4 9.4 9.3 10 4.5Z" />
              <path d="M19 1.7C19.3 3.9 20.6 5.2 22.8 5.5C20.6 5.8 19.3 7.1 19 9.3C18.7 7.1 17.4 5.8 15.2 5.5C17.4 5.2 18.7 3.9 19 1.7Z" />
            </svg>
            <span v-html="invitationText"></span>
          </button>
        </div>

        <div v-else-if="bannerState === 'connecting'" class="connecting-display">
          <div class="connecting-spinner" :style="{ borderTopColor: effectiveTextColor }"></div>
        </div>

        <div v-else-if="bannerState === 'conversation' && errorMessage" class="text-caption" style="color: #dc2626; padding: 6px 8px;">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Right Zone: Animated Mic Avatar -->
      <div
        class="banner-avatar"
        :style="{
          order: (bannerState === 'conversation' || (bannerState === 'initial' && activeSuggestedQuestions.length > 0)) ? 1 : 2,
        }"
      >
        <div class="avatar-wrapper" style="width: 82px; height: 82px; position: relative;">
          <AiMicAnimation
            :isPulsing="bannerState === 'initial'"
            :isListening="!isPaused && !isMuted && bannerState === 'conversation' && speakerState === 'listening'"
            :isUserSpeaking="isUserSpeaking && !isPaused && !isMuted"
            :userAudioLevel="userAudioLevel"
            :isThinking="speakerState === 'thinking' && !isPaused"
            :agentIsSpeaking="speakerState === 'speaking' && !isPaused"
            :agentAudioLevel="agentAudioLevel"
            :isSearchingWeb="isSearchingWeb && !isPaused"
            :colorText="effectiveTextColor"
            :colorBg="effectiveBgColor"
          />
        </div>
      </div>
    </div>

    <!-- Clickable YouTube Moment Buttons (shown during conversation) -->
    <div
      v-if="hasSessionStarted && timestampActions.length > 0"
      class="timestamp-actions-box"
      @click.stop
    >
      <button
        v-for="(item, idx) in timestampActions"
        :key="`${item.seconds}-${idx}`"
        type="button"
        class="timestamp-action-btn"
        :title="item.clock"
        @click="jumpToTimestamp(item.seconds)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#2196F3" style="flex-shrink: 0;">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span class="timestamp-label">{{ item.label }}</span>
      </button>
    </div>

    <div v-if="errorMessage && bannerState === 'initial'" class="text-caption mt-2 text-center" style="color: #dc2626;">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import AiMicAnimation from '../AiMicAnimation.vue'
import { apiClient } from '../../services/api.js'

const props = defineProps({
  projectConfig: { type: Object, default: null },
  clientUid: { type: String, default: '' },
  projectUid: { type: String, default: '' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '150px' },
  bgColor: { type: String, default: 'white' },
  bgCustom: { type: String, default: '#FFFFFF' },
  textColor: { type: String, default: 'black' },
  textCustom: { type: String, default: '#000000' },
  borderRadius: { type: String, default: '12px' },
  invitationText: { type: String, default: 'Ask a question about this video' },
  voiceType: { type: String, default: 'Aoede' },
  voiceSpeed: { type: Number, default: 1.0 },
  temperature: { type: Number, default: 0.7 },
  suggestedQuestions: { type: Array, default: () => [] },
  autoStart: { type: Boolean, default: false },
  hasEmbeddedYoutubePlayer: { type: Boolean, default: false },
})

const emit = defineEmits(['conversation-started', 'seek-youtube', 'close'])

const bannerState = ref('initial') // 'initial' | 'connecting' | 'conversation' | 'ended'
const speakerState = ref('idle') // 'idle' | 'listening' | 'thinking' | 'speaking'
const isPaused = ref(false)
const isMuted = ref(false)
const isUserSpeaking = ref(false)
const isSearchingWeb = ref(false)
const userAudioLevel = ref(0)
const agentAudioLevel = ref(0)
const conversationEnded = ref(false)
const hasSessionStarted = ref(false)
const errorMessage = ref('')
const timestampActions = ref([])

const activeSuggestedQuestions = computed(() =>
  (props.suggestedQuestions || []).filter((q) => typeof q === 'string' && q.trim().length > 0)
)

const effectiveBgColor = computed(() => {
  if (props.bgColor === 'custom') return props.bgCustom || '#FFFFFF'
  if (props.bgColor === 'black') return '#111827'
  return '#FFFFFF'
})

const effectiveTextColor = computed(() => {
  if (props.textColor === 'custom') return props.textCustom || '#000000'
  if (props.textColor === 'white') return '#FFFFFF'
  return '#0f172a'
})

const bannerStyle = computed(() => ({
  width: props.width,
  minHeight: props.height,
  backgroundColor: effectiveBgColor.value,
  color: effectiveTextColor.value,
  borderRadius: props.borderRadius,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
  padding: '14px 16px',
  position: 'relative',
  cursor: bannerState.value === 'initial' ? 'pointer' : 'default',
  boxSizing: 'border-box',
}))

const topSectionStyle = computed(() => ({
  display: 'flex',
  flexDirection: (bannerState.value === 'conversation' || activeSuggestedQuestions.value.length > 0) ? 'column' : 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  width: '100%',
}))

const contentStyle = computed(() => ({
  width: (bannerState.value === 'conversation' || activeSuggestedQuestions.value.length > 0) ? '100%' : 'auto',
  order: (bannerState.value === 'conversation' || activeSuggestedQuestions.value.length > 0) ? 2 : 1,
}))

const suggestedQuestionBtnStyle = computed(() => ({
  color: effectiveTextColor.value,
  borderColor: effectiveTextColor.value === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.14)',
  backgroundColor: effectiveTextColor.value === '#FFFFFF' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.03)',
}))

// ── Gemini Live WebSocket & Audio State ────────────────────────────────────
// All 30 Google Gemini Live HD prebuilt voices + smart mapping from OpenAI voice names
const GEMINI_VOICES = [
  'Aoede', 'Charon', 'Fenrir', 'Kore', 'Puck', 'Leda', 'Orus', 'Zephyr',
  'Achernar', 'Achird', 'Algenib', 'Algieba', 'Alnilam', 'Autonoe',
  'Callirrhoe', 'Despina', 'Enceladus', 'Erinome', 'Gacrux', 'Iapetus',
  'Laomedeia', 'Pulcherrima', 'Rasalgethi', 'Sadachbia', 'Sadaltager',
  'Schedar', 'Sulafat', 'Umbriel', 'Vindemiatrix', 'Zubenelgenubi',
]

const OPENAI_TO_GEMINI_VOICE_MAP = {
  // Feminine / warm / bright
  shimmer: 'Aoede',
  coral: 'Kore',
  sage: 'Leda',
  gleam: 'Zephyr',
  marin: 'Aoede',
  alloy: 'Kore',
  // Masculine / calm / deep
  echo: 'Puck',
  ash: 'Charon',
  verse: 'Fenrir',
  ballad: 'Orus',
  cedar: 'Charon',
  vale: 'Puck',
}

const resolveGeminiVoice = (rawVoice) => {
  if (!rawVoice || typeof rawVoice !== 'string') return 'Aoede'
  const trimmed = rawVoice.trim()
  const exact = GEMINI_VOICES.find((v) => v.toLowerCase() === trimmed.toLowerCase())
  if (exact) return exact
  const mapped = OPENAI_TO_GEMINI_VOICE_MAP[trimmed.toLowerCase()]
  if (mapped) return mapped
  return 'Aoede'
}

let ws = null
let captureContext = null
let captureStream = null
let captureProcessor = null
let captureSource = null
let playbackContext = null
let nextPlaybackTime = 0
let activePlaybackSources = []
let sessionStartTimeMs = 0
let pausedTotalMs = 0
let pauseStartedAtMs = 0
let transcriptEntries = []
let currentUserTranscript = ''
let currentAiTranscript = ''
let pendingInitialQuestion = null
let isExternalMediaPlaying = false
let hasSavedConversation = false
let setupCompleted = false
let retriedWithFallbackVoice = false
let pendingSeekSeconds = null
let pendingSeekFallbackTimer = null
let turnCompletedForPendingSeek = false
let userSpokeSinceLastTurn = false
let lastUserSpeechAtMs = 0

const formatClock = (totalSeconds) => {
  const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const findBestLabelFromKb = (targetSeconds) => {
  const kb = props.projectConfig?.proj_kb_content || ''
  if (!kb) return ''
  // Scan timestamped lines in KB (e.g. "[03:15] Tour n°2 : ...") and pick the closest match within +-15s
  const lineRe = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]\s*([^\n]{4,100})/g
  let bestLabel = ''
  let bestDiff = 20
  let m
  while ((m = lineRe.exec(kb)) !== null) {
    const sec = m[3]
      ? parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseInt(m[3], 10)
      : parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
    const diff = Math.abs(sec - targetSeconds)
    if (diff < bestDiff) {
      bestDiff = diff
      bestLabel = m[4].replace(/^[\s\-–—•:*#]+/, '').replace(/\*+/g, '').trim()
    }
  }
  if (bestLabel.length > 64) {
    bestLabel = bestLabel.slice(0, 61).trim() + '…'
  }
  return bestLabel
}

const addTimestampAction = (seconds, label = '') => {
  const sec = Math.max(0, Math.floor(Number(seconds) || 0))
  const clock = formatClock(sec)
  let cleanLabel = (label || '').replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, '').replace(/^[\s\-–—:]+|[\s\-–—:]+$/g, '').trim()
  if (!cleanLabel) {
    cleanLabel = findBestLabelFromKb(sec) || 'Voir ce passage'
  }
  const existingIdx = timestampActions.value.findIndex((a) => Math.abs(a.seconds - sec) <= 3)
  if (existingIdx !== -1) {
    // Upgrade label if a richer explicit label arrives
    if (label && cleanLabel && timestampActions.value[existingIdx].label !== cleanLabel) {
      const updated = [...timestampActions.value]
      updated[existingIdx] = { seconds: sec, clock, label: cleanLabel }
      timestampActions.value = updated
    }
    return
  }
  timestampActions.value = [...timestampActions.value, { seconds: sec, clock, label: cleanLabel }].slice(-6)
}

const jumpToTimestamp = (seconds) => {
  const sec = Math.max(0, Math.floor(Number(seconds) || 0))
  emit('seek-youtube', sec)
}

const extractTimestampsFromText = (text) => {
  if (!text) return []
  const found = []
  // 1. Digital clock formats: HH:MM:SS or MM:SS (e.g. 02:15, 1:05:30)
  const clockRe = /\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/g
  let m
  while ((m = clockRe.exec(text)) !== null) {
    const h = m[1] ? parseInt(m[1], 10) : 0
    const min = parseInt(m[2], 10)
    const sec = parseInt(m[3], 10)
    if (min < 60 && sec < 60) {
      found.push(h * 3600 + min * 60 + sec)
    }
  }
  // 2. Spoken minutes + optional seconds (FR/EN): "2 minutes 15", "2 minutes et 15 secondes", "1 minute 30"
  const spokenMinRe = /\b(\d{1,2})\s*(?:minutes?|mins?)\s*(?:(?:et|and)\s*)?(?:(\d{1,2})\s*(?:secondes?|seconds?|secs?)?)?/gi
  while ((m = spokenMinRe.exec(text)) !== null) {
    const min = parseInt(m[1], 10)
    const sec = m[2] ? parseInt(m[2], 10) : 0
    if (min < 180 && sec < 60) {
      found.push(min * 60 + sec)
    }
  }
  return found
}

const flushPendingSeekIfReady = () => {
  if (pendingSeekSeconds === null) return
  if (activePlaybackSources.length > 0) return
  const sec = pendingSeekSeconds
  pendingSeekSeconds = null
  turnCompletedForPendingSeek = false
  if (pendingSeekFallbackTimer) {
    clearInterval(pendingSeekFallbackTimer)
    pendingSeekFallbackTimer = null
  }
  emit('seek-youtube', sec)
}

const scheduleSeekAfterSpeech = (sec) => {
  pendingSeekSeconds = sec
  turnCompletedForPendingSeek = false
  const scheduledAt = Date.now()
  if (pendingSeekFallbackTimer) clearInterval(pendingSeekFallbackTimer)
  pendingSeekFallbackTimer = setInterval(() => {
    if (pendingSeekSeconds === null) {
      clearInterval(pendingSeekFallbackTimer)
      pendingSeekFallbackTimer = null
      return
    }
    const elapsed = Date.now() - scheduledAt
    // Trigger as soon as speech ends (after a minimum 900ms grace period) or hard cap at 12s
    if ((elapsed >= 900 && activePlaybackSources.length === 0) || elapsed >= 12000) {
      const target = pendingSeekSeconds
      pendingSeekSeconds = null
      turnCompletedForPendingSeek = false
      clearInterval(pendingSeekFallbackTimer)
      pendingSeekFallbackTimer = null
      emit('seek-youtube', target)
    }
  }, 300)
}

const usageTotals = {
  provider: 'gemini-live',
  input_text_tokens: 0,
  output_text_tokens: 0,
  input_audio_tokens: 0,
  output_audio_tokens: 0,
}

const useRag = computed(() => {
  const tokenCount = props.projectConfig?.proj_kb_content_tokens || 0
  const rawKbLen = (props.projectConfig?.proj_kb_content || '').length
  return props.projectConfig?.proj_use_rag === true || tokenCount > 24000 || rawKbLen > 96000
})

const buildSystemInstruction = () => {
  const title = props.projectConfig?.proj_youtube_title || props.projectConfig?.proj_name || 'YouTube Video'
  const lang = props.projectConfig?.proj_admin_language || 'en'
  const inlineKb = !useRag.value ? (props.projectConfig?.proj_kb_content || '') : ''

  let prompt = `You are a friendly, concise voice assistant helping the user discuss the YouTube video "${title}".
Respond naturally in the user's spoken language (default language: ${lang}).
STRICT GROUNDING & WEB SEARCH RULES:
- Base every answer strictly on the video content provided below${useRag.value ? ' or retrieved via search_video_knowledge' : ''}.
- NEVER invent facts, quotes, or details not present in the video.
- If the user asks something that is NOT mentioned in the video:
  1. Clearly state that this information is not in the video.
  2. Politely ask if they would like you to search the web for the answer (in the user's language, e.g. "Souhaitez-vous que je fasse une recherche sur internet ?" or "Would you like me to search the web for this?").
  3. NEVER use Google Search until the user explicitly agrees ("yes", "oui", "go ahead", etc.).
  4. Once the user explicitly agrees, use Google Search to answer and clearly mention that the answer comes from a web search.
- Keep spoken replies concise, conversational, and direct (2 to 4 sentences unless the user asks for details).`

  if (props.hasEmbeddedYoutubePlayer) {
    prompt += `
VIDEO TIMESTAMP & PLAYBACK RULES (CRITICAL):
- FULL-VIDEO SCAN RULE: Most YouTube videos begin with a short intro or table of contents (e.g. first 0:00–0:45) that merely previews or lists the topics. NEVER point to the intro/teaser timestamps when the user asks for the passages, steps, tricks, or sections! ALWAYS read through the ENTIRE transcript/knowledge base to the very end to find the ACTUAL timestamps where each topic is fully developed, demonstrated, or explained.
- CLICKABLE BUTTONS RULE: Whenever you identify one or more relevant moments/sections in the video (e.g. the 3 tricks, the 3 topics, a specific explanation), ALWAYS call display_video_buttons(moments) with a clear, natural title for each moment (in the user's language, e.g. "La pièce qui traverse le verre", NEVER a timestamp like "Watch at 02:15").
- DIRECT PLAYBACK RULE: Whenever the user explicitly asks to watch, play, show, or jump to a specific moment in the video, call seek_youtube_video(seconds, label) with the ACTUAL development timestamp (not the intro) and give a brief confirmation — the video will start automatically right after you finish speaking.`
  }

  if (useRag.value) {
    prompt += `
- For any question about the video's content, facts, timestamps, or quotes, ALWAYS call search_video_knowledge first before answering.`
  } else if (inlineKb) {
    prompt += `

<video_knowledge_base>
${inlineKb}
</video_knowledge_base>`
  }

  return prompt
}

const buildToolDeclarations = () => {
  const decls = [
    {
      name: 'end_conversation',
      description: 'Call this when the user says goodbye or wants to end the voice conversation.',
      parameters: { type: 'OBJECT', properties: {} },
    },
  ]

  if (useRag.value) {
    decls.push({
      name: 'search_video_knowledge',
      description: 'Search the YouTube video transcript and visual summary for facts, quotes, or timestamps.',
      parameters: {
        type: 'OBJECT',
        properties: {
          query: { type: 'STRING', description: 'Search query in the video language' },
        },
        required: ['query'],
      },
    })
  }

  if (props.hasEmbeddedYoutubePlayer) {
    decls.push({
      name: 'display_video_buttons',
      description: 'Display clickable buttons for one or more moments/sections of the video so the user can jump directly to any of them. Use the ACTUAL timestamps where each topic is developed (NOT the intro teaser).',
      parameters: {
        type: 'OBJECT',
        properties: {
          moments: {
            type: 'ARRAY',
            description: 'Ordered list of video moments to display as buttons',
            items: {
              type: 'OBJECT',
              properties: {
                seconds: { type: 'NUMBER', description: 'Exact timestamp in seconds where the topic is actually explained/developed' },
                label: { type: 'STRING', description: 'Clear descriptive title of this moment in the user language (NO timestamp numbers in the label)' },
              },
              required: ['seconds', 'label'],
            },
          },
        },
        required: ['moments'],
      },
    })
    decls.push({
      name: 'seek_youtube_video',
      description: 'Jump and play the embedded YouTube video at a specific timestamp in seconds. MUST be called when the user explicitly asks to watch, play, or jump to a specific moment.',
      parameters: {
        type: 'OBJECT',
        properties: {
          seconds: { type: 'NUMBER', description: 'Timestamp in seconds where the topic is actually explained/developed (NOT the intro)' },
          label: { type: 'STRING', description: 'Clear descriptive title of this moment in the user language (NO timestamp numbers)' },
        },
        required: ['seconds', 'label'],
      },
    })
  }

  return [
    { googleSearch: {} },
    { functionDeclarations: decls },
  ]
}

// ── PCM Encoding / Decoding Helpers ────────────────────────────────────────
const float32ToInt16Base64 = (float32Array) => {
  const int16 = new Int16Array(float32Array.length)
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]))
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  const bytes = new Uint8Array(int16.buffer)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

const stopScheduledAudio = () => {
  for (const src of activePlaybackSources) {
    try { src.stop() } catch (_) {}
  }
  activePlaybackSources = []
  if (playbackContext) {
    nextPlaybackTime = playbackContext.currentTime
  }
  agentAudioLevel.value = 0
}

const enqueuePcm24kAudio = (base64Data) => {
  if (isPaused.value || isMuted.value) return
  if (!playbackContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    playbackContext = new AudioCtx({ sampleRate: 24000 })
    nextPlaybackTime = playbackContext.currentTime
  }
  if (playbackContext.state === 'suspended') {
    playbackContext.resume().catch(() => {})
  }

  const binary = atob(base64Data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const int16 = new Int16Array(bytes.buffer)
  const float32 = new Float32Array(int16.length)
  let sumSq = 0
  for (let i = 0; i < int16.length; i++) {
    const v = int16[i] / 32768
    float32[i] = v
    sumSq += v * v
  }

  const rms = Math.sqrt(sumSq / Math.max(1, float32.length))
  agentAudioLevel.value = Math.min(1, rms * 4.5)
  speakerState.value = 'speaking'

  const buffer = playbackContext.createBuffer(1, float32.length, 24000)
  buffer.getChannelData(0).set(float32)

  const source = playbackContext.createBufferSource()
  source.buffer = buffer
  source.connect(playbackContext.destination)

  const now = playbackContext.currentTime
  const startAt = Math.max(now + 0.02, nextPlaybackTime)
  source.start(startAt)
  nextPlaybackTime = startAt + buffer.duration
  activePlaybackSources.push(source)

  source.onended = () => {
    activePlaybackSources = activePlaybackSources.filter((s) => s !== source)
    if (activePlaybackSources.length === 0) {
      agentAudioLevel.value = 0
      isSearchingWeb.value = false
      if (turnCompletedForPendingSeek && pendingSeekSeconds !== null) {
        flushPendingSeekIfReady()
        return
      }
      if (bannerState.value === 'conversation' && !isPaused.value) {
        speakerState.value = 'listening'
      }
    }
  }
}

// ── Microphone Capture (16kHz PCM via AudioWorkletNode) ────────────────────
const PCM_WORKLET_CODE = `
class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = new Float32Array(2048);
    this._offset = 0;
  }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      this._buffer[this._offset++] = channel[i];
      if (this._offset >= this._buffer.length) {
        this.port.postMessage(this._buffer.slice(0));
        this._offset = 0;
      }
    }
    return true;
  }
}
registerProcessor('pcm-capture-processor', PcmCaptureProcessor);
`

const handleCapturedPcmChunk = (input) => {
  if (!ws || ws.readyState !== WebSocket.OPEN || isPaused.value || isMuted.value) {
    userAudioLevel.value = 0
    isUserSpeaking.value = false
    return
  }
  let sumSq = 0
  for (let i = 0; i < input.length; i++) sumSq += input[i] * input[i]
  const rms = Math.sqrt(sumSq / Math.max(1, input.length))
  userAudioLevel.value = Math.min(1, rms * 5)
  const speakingNow = rms > 0.015
  isUserSpeaking.value = speakingNow

  if (speakingNow) {
    userSpokeSinceLastTurn = true
    lastUserSpeechAtMs = Date.now()
    if (speakerState.value === 'thinking') {
      speakerState.value = 'listening'
    }
  } else if (
    userSpokeSinceLastTurn &&
    speakerState.value === 'listening' &&
    activePlaybackSources.length === 0 &&
    Date.now() - lastUserSpeechAtMs >= 450
  ) {
    // Show thinking animation while Gemini processes the user's utterance
    speakerState.value = 'thinking'
    userSpokeSinceLastTurn = false
  }

  const b64 = float32ToInt16Base64(input)
  ws.send(JSON.stringify({
    realtimeInput: {
      mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: b64 }],
    },
  }))
}

const startMicCapture = async () => {
  captureStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  })

  const AudioCtx = window.AudioContext || window.webkitAudioContext
  captureContext = new AudioCtx({ sampleRate: 16000 })
  captureSource = captureContext.createMediaStreamSource(captureStream)

  if (captureContext.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
    const blobUrl = URL.createObjectURL(new Blob([PCM_WORKLET_CODE], { type: 'application/javascript' }))
    try {
      await captureContext.audioWorklet.addModule(blobUrl)
    } finally {
      URL.revokeObjectURL(blobUrl)
    }
    captureProcessor = new AudioWorkletNode(captureContext, 'pcm-capture-processor')
    captureProcessor.port.onmessage = (evt) => {
      if (evt.data instanceof Float32Array) {
        handleCapturedPcmChunk(evt.data)
      }
    }
    captureSource.connect(captureProcessor)
    // Keep node alive without routing mic audio to speakers
    const silentGain = captureContext.createGain()
    silentGain.gain.value = 0
    captureProcessor.connect(silentGain)
    silentGain.connect(captureContext.destination)
  } else {
    captureProcessor = captureContext.createScriptProcessor(4096, 1, 1)
    captureProcessor.onaudioprocess = (e) => handleCapturedPcmChunk(e.inputBuffer.getChannelData(0))
    captureSource.connect(captureProcessor)
    captureProcessor.connect(captureContext.destination)
  }
}

const stopMicCapture = () => {
  try { captureProcessor?.disconnect() } catch (_) {}
  try { captureSource?.disconnect() } catch (_) {}
  try { captureContext?.close() } catch (_) {}
  if (captureStream) {
    captureStream.getTracks().forEach((t) => { try { t.stop() } catch (_) {} })
  }
  captureProcessor = null
  captureSource = null
  captureContext = null
  captureStream = null
  userAudioLevel.value = 0
  isUserSpeaking.value = false
}

// ── Tool Execution ─────────────────────────────────────────────────────────
const handleToolCall = async (toolCall) => {
  const calls = toolCall?.functionCalls || []
  if (!calls.length || !ws || ws.readyState !== WebSocket.OPEN) return

  speakerState.value = 'thinking'
  const responses = []

  for (const call of calls) {
    const fnName = call.name
    const args = call.args || {}
    let result = { ok: true }

    try {
      if (fnName === 'search_video_knowledge') {
        const res = await apiClient().post('/project/rag-search', {
          projectUid: props.projectUid,
          query: args.query || '',
          topK: 8,
        })
        const chunks = res.data?.results?.chunks || res.data?.chunks || []
        result = {
          context: chunks.map((c) => c.content || c).join('\n\n') || 'No matching passage found in the video.',
        }
      } else if (fnName === 'display_video_buttons') {
        const moments = Array.isArray(args.moments) ? args.moments : []
        if (moments.length > 0) {
          timestampActions.value = []
          for (const item of moments) {
            if (item && item.seconds !== undefined) {
              addTimestampAction(item.seconds, item.label || '')
            }
          }
        }
        result = { status: 'displayed', count: timestampActions.value.length }
      } else if (fnName === 'seek_youtube_video') {
        const sec = Math.max(0, Math.floor(Number(args.seconds) || 0))
        addTimestampAction(sec, args.label || '')
        // Defer video start until Gemini finishes speaking its current sentence
        scheduleSeekAfterSpeech(sec)
        result = { status: 'scheduled_after_speech', seconds: sec, clock: formatClock(sec) }
      } else if (fnName === 'end_conversation') {
        result = { status: 'closing' }
        setTimeout(() => abortConversation(), 1800)
      }
    } catch (err) {
      result = { error: err?.message || 'Tool execution failed' }
    }

    responses.push({
      id: call.id,
      name: fnName,
      response: result,
    })
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ toolResponse: { functionResponses: responses } }))
  }
}

// ── WebSocket Lifecycle ────────────────────────────────────────────────────
const sendTextTurn = (text) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  ws.send(JSON.stringify({
    clientContent: {
      turns: [{ role: 'user', parts: [{ text }] }],
      turnComplete: true,
    },
  }))
}

const handleServerMessage = async (rawData) => {
  let text = ''
  try {
    text = rawData instanceof Blob ? await rawData.text() : String(rawData)
  } catch {
    return
  }
  let msg = null
  try { msg = JSON.parse(text) } catch { return }

  if (msg.setupComplete) {
    setupCompleted = true
    bannerState.value = 'conversation'
    speakerState.value = 'listening'
    hasSessionStarted.value = true
    sessionStartTimeMs = Date.now()
    emit('conversation-started')

    await startMicCapture()

    if (pendingInitialQuestion) {
      const q = pendingInitialQuestion
      pendingInitialQuestion = null
      sendTextTurn(q)
    } else {
      sendTextTurn('Greet the user briefly in 1 short sentence and invite them to ask any question about this video.')
    }
    return
  }

  if (msg.usageMetadata) {
    const u = msg.usageMetadata
    usageTotals.input_text_tokens = Math.max(usageTotals.input_text_tokens, u.promptTokenCount || 0)
    usageTotals.output_text_tokens = Math.max(usageTotals.output_text_tokens, u.responseTokenCount || 0)
  }

  if (msg.toolCall) {
    await handleToolCall(msg.toolCall)
    return
  }

  const sc = msg.serverContent
  if (!sc) return

  if (sc.interrupted) {
    stopScheduledAudio()
    speakerState.value = 'listening'
    return
  }

  if (sc.inputTranscription?.text) {
    currentUserTranscript += sc.inputTranscription.text
  }
  if (sc.outputTranscription?.text) {
    currentAiTranscript += sc.outputTranscription.text
    if (props.hasEmbeddedYoutubePlayer) {
      const detected = extractTimestampsFromText(currentAiTranscript)
      for (const sec of detected) {
        addTimestampAction(sec)
      }
    }
  }

  if (sc.groundingMetadata) {
    isSearchingWeb.value = true
  }

  if (sc.modelTurn?.parts) {
    for (const part of sc.modelTurn.parts) {
      if (part.inlineData?.mimeType?.startsWith('audio/') && part.inlineData?.data) {
        enqueuePcm24kAudio(part.inlineData.data)
      }
    }
  }

  if (sc.turnComplete) {
    userSpokeSinceLastTurn = false
    const lastUserText = currentUserTranscript.trim()
    const lastAiText = currentAiTranscript.trim()
    if (lastUserText) {
      transcriptEntries.push({ role: 'user', text: lastUserText })
      currentUserTranscript = ''
    }
    if (lastAiText) {
      transcriptEntries.push({ role: 'assistant', text: lastAiText })
      currentAiTranscript = ''
      // Always extract any spoken timestamps into clickable jump buttons
      if (props.hasEmbeddedYoutubePlayer) {
        const detected = extractTimestampsFromText(lastAiText)
        for (const sec of detected) {
          addTimestampAction(sec)
        }
        // Fallback: if user explicitly asked to show/watch/play and Gemini spoke a timestamp without calling seek_youtube_video
        if (
          pendingSeekSeconds === null &&
          detected.length > 0 &&
          /\b(montre|montrer|regarde|regarder|voir|lance|lancer|mets|mettre|aller|show|watch|play|jump|go to)\b/i.test(lastUserText)
        ) {
          scheduleSeekAfterSpeech(detected[0])
        }
      }
    }
    if (pendingSeekSeconds !== null) {
      turnCompletedForPendingSeek = true
      if (activePlaybackSources.length === 0) {
        flushPendingSeekIfReady()
      }
    } else if (activePlaybackSources.length === 0 && !isPaused.value) {
      isSearchingWeb.value = false
      speakerState.value = 'listening'
    }
  }
}

const startSession = async (initialQuestion = null, forcedVoice = null) => {
  if (bannerState.value === 'connecting' || bannerState.value === 'conversation') return
  errorMessage.value = ''
  conversationEnded.value = false
  hasSavedConversation = false
  setupCompleted = false
  if (!forcedVoice) {
    retriedWithFallbackVoice = false
  }
  isPaused.value = false
  isMuted.value = false
  pausedTotalMs = 0
  pauseStartedAtMs = 0
  transcriptEntries = []
  timestampActions.value = []
  pendingSeekSeconds = null
  turnCompletedForPendingSeek = false
  if (pendingSeekFallbackTimer) {
    clearInterval(pendingSeekFallbackTimer)
    pendingSeekFallbackTimer = null
  }
  userSpokeSinceLastTurn = false
  isSearchingWeb.value = false
  pendingInitialQuestion = initialQuestion
  bannerState.value = 'connecting'

  const voiceToUse = forcedVoice || resolveGeminiVoice(props.voiceType)

  try {
    const { data } = await apiClient().post('/openai/gemini-live-session', {
      projectUid: props.projectUid,
    })

    if (!data?.wsUrl || !data?.model) {
      throw new Error('Could not initialize Gemini Live session')
    }

    ws = new WebSocket(data.wsUrl)

    ws.onopen = () => {
      const setupPayload = {
        setup: {
          model: data.model,
          generationConfig: {
            responseModalities: ['AUDIO'],
            temperature: props.temperature ?? 0.7,
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceToUse,
                },
              },
            },
          },
          contextWindowCompression: {
            slidingWindow: {},
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: {
            parts: [{ text: buildSystemInstruction() }],
          },
          tools: buildToolDeclarations(),
        },
      }
      ws.send(JSON.stringify(setupPayload))
    }

    ws.onmessage = (evt) => handleServerMessage(evt.data)

    ws.onerror = (err) => {
      console.error('[GeminiLive] WebSocket error:', err)
    }

    ws.onclose = (evt) => {
      // If Gemini rejected the requested voice (or setup) before setupComplete, auto-retry once with safe fallback voice "Aoede"
      if (!setupCompleted && !retriedWithFallbackVoice && voiceToUse !== 'Aoede') {
        console.warn(`[GeminiLive] Setup closed before ready with voice "${voiceToUse}" (code=${evt?.code}, reason="${evt?.reason || ''}"). Retrying with fallback voice "Aoede"...`)
        retriedWithFallbackVoice = true
        ws = null
        bannerState.value = 'initial'
        startSession(pendingInitialQuestion, 'Aoede')
        return
      }
      if (!setupCompleted && evt?.reason) {
        errorMessage.value = `Voice setup error: ${evt.reason}`
      }
      if (bannerState.value === 'conversation' || bannerState.value === 'connecting') {
        cleanupAndPersist()
      }
    }
  } catch (err) {
    console.error('[GeminiLive] Failed to start session:', err)
    errorMessage.value = err?.response?.data?.error || err?.message || 'Unable to start voice session.'
    bannerState.value = 'initial'
    hasSessionStarted.value = false
  }
}

const cleanupAndPersist = async () => {
  stopMicCapture()
  stopScheduledAudio()
  try { playbackContext?.close() } catch (_) {}
  playbackContext = null

  if (ws) {
    const oldWs = ws
    ws = null
    try { oldWs.close() } catch (_) {}
  }

  const activeDurationMs = sessionStartTimeMs
    ? Math.max(0, Date.now() - sessionStartTimeMs - pausedTotalMs)
    : 0
  sessionStartTimeMs = 0

  bannerState.value = 'initial'
  speakerState.value = 'idle'
  hasSessionStarted.value = false
  conversationEnded.value = true
  isPaused.value = false

  if (!hasSavedConversation && activeDurationMs >= 2000 && props.projectUid) {
    hasSavedConversation = true
    const durationSec = Math.round(activeDurationMs / 1000)
    try {
      await apiClient().post('/conversations/save', {
        projectUid: props.projectUid,
        transcript: transcriptEntries,
        duration: activeDurationMs,
        timestamp: new Date().toISOString(),
        tokenUsage: usageTotals,
      })
    } catch (e) {
      console.warn('[GeminiLive] Failed to save conversation:', e?.message || e)
    }

    if (props.projectUid && durationSec > 0) {
      try {
        const decRes = await apiClient().post('/project/decrement-budget', {
          proj_uid: props.projectUid,
        })
        if (decRes.data?.success && props.projectConfig && decRes.data?.results?.newBudget !== undefined) {
          props.projectConfig.client_credit_budget = decRes.data.results.newBudget
        }
      } catch (e) {
        console.warn('[GeminiLive] Failed to decrement budget:', e?.message || e)
      }
    }
  }

  emit('close')
}

// ── Public Controls (compatible with VideoPlayerCard) ──────────────────────
const handleBannerClick = () => {
  if (bannerState.value === 'initial') {
    startSession(null)
  }
}

const handleSuggestedQuestion = (q) => {
  if (bannerState.value === 'initial') {
    startSession(q)
  } else if (bannerState.value === 'conversation') {
    sendTextTurn(q)
  }
}

const pauseAgent = () => {
  if (bannerState.value !== 'conversation' || isPaused.value) return
  isPaused.value = true
  isMuted.value = true
  pauseStartedAtMs = Date.now()
  stopScheduledAudio()
  speakerState.value = 'idle'
}

const resumeAgent = ({ pauseExternalMedia = true } = {}) => {
  if (bannerState.value !== 'conversation') return
  if (pauseStartedAtMs) {
    pausedTotalMs += Date.now() - pauseStartedAtMs
    pauseStartedAtMs = 0
  }
  isPaused.value = false
  isMuted.value = false
  speakerState.value = 'listening'
  if (pauseExternalMedia) {
    emit('conversation-started')
  }
}

const togglePause = () => {
  if (bannerState.value === 'initial') {
    startSession(null)
    return
  }
  if (isPaused.value) resumeAgent({ pauseExternalMedia: true })
  else pauseAgent()
}

const abortConversation = () => {
  cleanupAndPersist()
}

const setExternalMediaPlaying = (playing) => {
  isExternalMediaPlaying = !!playing
}

const onExternalMediaStoppedByUser = () => {
  if (bannerState.value === 'conversation' && isPaused.value) {
    resumeAgent({ pauseExternalMedia: false })
  }
}

onBeforeUnmount(() => {
  if (ws || captureStream || playbackContext) {
    cleanupAndPersist()
  }
})

defineExpose({
  bannerState,
  isPaused,
  handleBannerClick,
  pauseAgent,
  resumeAgent,
  togglePause,
  setExternalMediaPlaying,
  onExternalMediaStoppedByUser,
})
</script>

<style scoped>
.suggested-questions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.suggested-question-btn,
.invitation-text-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.35;
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.15s ease;
}

.suggested-question-btn:hover,
.invitation-text-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.btn-sparkle-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.connecting-display {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.connecting-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
  animation: gemini-spin 0.8s linear infinite;
}

@keyframes gemini-spin {
  to { transform: rotate(360deg); }
}

.timestamp-actions-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  max-height: 140px;
  overflow-y: auto;
}

.timestamp-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border-radius: 10px;
  border: 1px solid rgba(33, 150, 243, 0.25);
  background: rgba(33, 150, 243, 0.08);
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.12s ease;
}

.timestamp-action-btn:hover {
  background: rgba(33, 150, 243, 0.16);
  transform: translateY(-1px);
}

.timestamp-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 6px;
  background: #2196F3;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.timestamp-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
