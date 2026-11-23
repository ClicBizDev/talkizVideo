<template>
  <div
    class="ai-mic-animation-container"
    :class="{
      'state-pulsing': isPulsing && currentState === 'idle' && !isSearchingWeb,
      'state-speaking': currentState === 'speaking' && !isSearchingWeb,
      'state-listening': currentState === 'listening' && !isSearchingWeb,
      'state-thinking': currentState === 'thinking' && !isSearchingWeb,
      'state-web-searching': isSearchingWeb,
    }"
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="geometricPrecision"
    >
      <g class="mic-root">
        <!-- Sparkles IA externes : visibles en Attente et en Recherche Web / Réflexion -->
        <g v-if="showSparkles" class="sparkles-group" :fill="iconColor">
          <path class="sp-main" :d="sparkleMainPath" />
          <path class="sp-mini" :d="sparkleMiniPath" />
          <path class="sp-left" :d="sparkleLeftPath" />
        </g>

        <!-- Onde vocale verticale au-dessus du micro : visible en continu en mode Écoute / Utilisateur parle -->
        <g
          v-if="showUserWaveform"
          class="user-waveform"
          :stroke="iconColor"
          stroke-width="3.2"
          stroke-linecap="round"
        >
          <line
            v-for="(bar, idx) in userWaveBars"
            :key="idx"
            :x1="bar.x"
            :y1="bar.y1"
            :x2="bar.x"
            :y2="bar.y2"
            :opacity="bar.opacity"
          />
        </g>

        <!-- 3 paires d'ondes acoustiques courbes organiques : visibles uniquement quand l'agent parle -->
        <g
          v-if="showSpeakingWaves"
          class="speaking-waves"
          fill="none"
          :stroke="iconColor"
          stroke-width="3.0"
          stroke-linecap="round"
        >
          <path
            v-for="(arc, idx) in speakingWaveArcs"
            :key="idx"
            :d="arc.d"
            :opacity="arc.opacity"
          />
        </g>

        <!-- Micro Version 2 : capsule en contour + petit sparkle interne en bas + berceau en U + socle arrondi -->
        <rect
          x="45"
          y="20"
          width="30"
          height="50"
          rx="15"
          fill="none"
          :stroke="iconColor"
          stroke-width="6.4"
        />
        <path :d="sparkleInnerPath" :fill="iconColor" />
        <path
          d="M 34.5 51.5 L 34.5 54.5 A 25.5 25.5 0 0 0 85.5 54.5 L 85.5 51.5"
          fill="none"
          :stroke="iconColor"
          stroke-width="6.4"
          stroke-linecap="round"
        />
        <line
          x1="60"
          y1="80"
          x2="60"
          y2="96"
          :stroke="iconColor"
          stroke-width="6.4"
        />
        <line
          x1="43"
          y1="96.5"
          x2="77"
          y2="96.5"
          :stroke="iconColor"
          stroke-width="6.4"
          stroke-linecap="round"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  isPulsing: {
    type: Boolean,
    default: false,
  },
  isListening: {
    type: Boolean,
    default: false,
  },
  isUserSpeaking: {
    type: Boolean,
    default: false,
  },
  userAudioLevel: {
    type: Number,
    default: 0,
  },
  isThinking: {
    type: Boolean,
    default: false,
  },
  agentIsSpeaking: {
    type: Boolean,
    default: false,
  },
  agentAudioLevel: {
    type: Number,
    default: 0,
  },
  isSearchingWeb: {
    type: Boolean,
    default: false,
  },
  colorText: {
    type: String,
    default: '',
  },
  colorBg: {
    type: String,
    default: '',
  },
});

const currentState = computed(() => {
  if (props.agentIsSpeaking) return 'speaking';
  if (props.isThinking) return 'thinking';
  if (props.isListening || props.isUserSpeaking) return 'listening';
  return 'idle';
});

// Toute l'animation prend directement la couleur du texte configurée (Noir, Blanc ou Custom)
const iconColor = computed(() => {
  const raw = (props.colorText || '').trim();
  return raw || '#18181b';
});

// Sparkles externes affichés en Attente et en mode Web / Réflexion (masqués en Parle et en Écoute)
const showSparkles = computed(() => {
  if (props.isSearchingWeb) return true;
  return currentState.value === 'idle' || currentState.value === 'thinking';
});

// 3 ondes courbes organiques affichées uniquement quand l'agent parle (et hors recherche web)
const showSpeakingWaves = computed(() => {
  return !props.isSearchingWeb && currentState.value === 'speaking';
});

// Onde verticale unique au-dessus du micro affichée pendant toute la phase Écoute / Utilisateur parle
const showUserWaveform = computed(() => {
  return !props.isSearchingWeb && currentState.value === 'listening';
});

// --- Animation Écoute / Utilisateur parle (11 barres verticales au-dessus du micro) ---
const BAR_COUNT = 11;
const WAVE_X_START = 26;
const WAVE_X_END = 94;
const WAVE_CENTER_Y = 4.6;
const BAR_TEXTURE = [
  0.14, 0.42, 0.74, 0.56, 0.92,
  1.0,
  0.90, 0.58, 0.72, 0.40, 0.14,
];

const wavePhase = ref(0);
const renderedLevel = ref(0.16);
let waveRafId = null;
let lastFrameTs = 0;

const stopWaveformLoop = () => {
  if (waveRafId !== null) {
    cancelAnimationFrame(waveRafId);
    waveRafId = null;
  }
  lastFrameTs = 0;
};

const tickWaveform = (ts) => {
  if (!showUserWaveform.value) {
    stopWaveformLoop();
    return;
  }
  const dt = lastFrameTs ? Math.min(0.05, (ts - lastFrameTs) / 1000) : 0.016;
  lastFrameTs = ts;

  const speakingActive = props.isUserSpeaking || props.userAudioLevel > 0.03;
  const targetLevel = speakingActive
    ? (props.userAudioLevel > 0.03 ? Math.min(1, Math.max(0.38, props.userAudioLevel)) : 0.65)
    : 0.16;

  const lerpAlpha = targetLevel > renderedLevel.value ? 0.28 : 0.12;
  renderedLevel.value = renderedLevel.value + (targetLevel - renderedLevel.value) * lerpAlpha;

  const speed = 3.0 + renderedLevel.value * 6.5;
  wavePhase.value += dt * speed;
  waveRafId = requestAnimationFrame(tickWaveform);
};

watch(showUserWaveform, (active) => {
  if (active) {
    if (waveRafId === null && typeof requestAnimationFrame === 'function') {
      renderedLevel.value = props.isUserSpeaking ? Math.max(0.45, props.userAudioLevel) : 0.16;
      waveRafId = requestAnimationFrame(tickWaveform);
    }
  } else {
    stopWaveformLoop();
  }
}, { immediate: true });

// --- Animation Agent parle : 3 paires d'ondes courbes latérales à modulation vocale organique ---
const SPEAK_RINGS = [
  { xL: 35.8, xR: 84.2, r: 19, minH: 4.4, maxH: 10.2, lag: 0.0,  minOp: 0.48, maxOp: 1.0,  thresh: 0.0  },
  { xL: 28.4, xR: 91.6, r: 27, minH: 5.0, maxH: 14.0, lag: 0.55, minOp: 0.18, maxOp: 0.95, thresh: 0.12 },
  { xL: 21.0, xR: 99.0, r: 35, minH: 5.6, maxH: 17.6, lag: 1.10, minOp: 0.06, maxOp: 0.88, thresh: 0.26 },
];
const SPEAK_CENTER_Y = 30.0;

const speakPhase = ref(0);
const renderedSpeakLevel = ref(0.55);
let speakRafId = null;
let lastSpeakTs = 0;

const stopSpeakingLoop = () => {
  if (speakRafId !== null) {
    cancelAnimationFrame(speakRafId);
    speakRafId = null;
  }
  lastSpeakTs = 0;
};

const tickSpeakingWaves = (ts) => {
  if (!showSpeakingWaves.value) {
    stopSpeakingLoop();
    return;
  }
  const dt = lastSpeakTs ? Math.min(0.05, (ts - lastSpeakTs) / 1000) : 0.016;
  lastSpeakTs = ts;

  const p = speakPhase.value;
  // Enveloppe syllabique irrégulière (utilisée en autonome ou combinée au vrai volume WebRTC)
  const syntheticSyllable =
    0.52 +
    0.22 * Math.sin(p * 0.73) +
    0.16 * Math.sin(p * 1.37 + 1.1) +
    0.14 * Math.sin(p * 2.29 - 0.7);
  const clampedSynth = Math.min(1, Math.max(0.14, syntheticSyllable));

  const targetLevel = props.agentAudioLevel > 0.02
    ? Math.min(1, Math.max(0.16, props.agentAudioLevel * 0.78 + clampedSynth * 0.28))
    : clampedSynth;

  const alpha = targetLevel > renderedSpeakLevel.value ? 0.32 : 0.16;
  renderedSpeakLevel.value = renderedSpeakLevel.value + (targetLevel - renderedSpeakLevel.value) * alpha;

  speakPhase.value += dt * (5.2 + renderedSpeakLevel.value * 4.6);
  speakRafId = requestAnimationFrame(tickSpeakingWaves);
};

watch(showSpeakingWaves, (active) => {
  if (active) {
    if (speakRafId === null && typeof requestAnimationFrame === 'function') {
      renderedSpeakLevel.value = props.agentAudioLevel > 0.02 ? props.agentAudioLevel : 0.52;
      speakRafId = requestAnimationFrame(tickSpeakingWaves);
    }
  } else {
    stopSpeakingLoop();
  }
}, { immediate: true });

onBeforeUnmount(() => {
  stopWaveformLoop();
  stopSpeakingLoop();
});

const speakingWaveArcs = computed(() => {
  const t = speakPhase.value;
  const lvl = renderedSpeakLevel.value;
  const arcs = [];

  for (let k = 0; k < SPEAK_RINGS.length; k++) {
    const ring = SPEAK_RINGS[k];
    const tp = t - ring.lag;

    // Modulation organique par anneau avec légère micro-asymétrie gauche / droite
    for (const side of [-1, 1]) {
      const sideShift = side === -1 ? 0 : 0.38;
      const oscA = 0.5 + 0.5 * Math.sin(tp * (1.18 + k * 0.19) + k * 1.3 + sideShift);
      const oscB = 0.5 + 0.5 * Math.sin(tp * (2.07 - k * 0.14) - k * 0.9 - sideShift * 0.7);
      const jitter = 0.34 + 0.66 * (oscA * 0.6 + oscB * 0.4);

      const effectiveEnergy = Math.max(0, (lvl - ring.thresh) / (1 - ring.thresh));
      const drive = Math.min(1, effectiveEnergy * jitter * 1.22);

      const h = +(ring.minH + (ring.maxH - ring.minH) * drive).toFixed(2);
      const y1 = +(SPEAK_CENTER_Y - h).toFixed(2);
      const y2 = +(SPEAK_CENTER_Y + h).toFixed(2);
      const opacity = +(ring.minOp + (ring.maxOp - ring.minOp) * Math.pow(drive, 0.82)).toFixed(2);

      if (side === -1) {
        arcs.push({
          d: `M ${ring.xL} ${y1} A ${ring.r} ${ring.r} 0 0 0 ${ring.xL} ${y2}`,
          opacity,
        });
      } else {
        arcs.push({
          d: `M ${ring.xR} ${y1} A ${ring.r} ${ring.r} 0 0 1 ${ring.xR} ${y2}`,
          opacity,
        });
      }
    }
  }

  return arcs;
});

const userWaveBars = computed(() => {
  const t = wavePhase.value;
  const lvl = renderedLevel.value;
  const step = (WAVE_X_END - WAVE_X_START) / (BAR_COUNT - 1);
  const bars = [];

  for (let i = 0; i < BAR_COUNT; i++) {
    const norm = i / (BAR_COUNT - 1);
    const x = +(WAVE_X_START + i * step).toFixed(2);
    const bell = Math.pow(Math.sin(norm * Math.PI), 1.35);
    const tex = BAR_TEXTURE[i] ?? 0.5;

    // Extrémités en points arrondis
    if (i === 0 || i === BAR_COUNT - 1) {
      const tinyHalf = 0.25 + 0.3 * lvl * Math.abs(Math.sin(t * 0.9 + i));
      bars.push({
        x,
        y1: +(WAVE_CENTER_Y - tinyHalf).toFixed(2),
        y2: +(WAVE_CENTER_Y + tinyHalf).toFixed(2),
        opacity: +(0.58 + 0.22 * lvl).toFixed(2),
      });
      continue;
    }

    const osc1 = 0.5 + 0.5 * Math.sin(t * 1.15 + i * 1.1);
    const osc2 = 0.5 + 0.5 * Math.sin(t * 1.85 - i * 1.6);
    const dynamicFactor = 0.36 + 0.64 * (osc1 * 0.58 + osc2 * 0.42);
    const maxHalf = 5.8;
    const idleBase = 0.42 + 0.55 * bell * tex;
    const speechBoost = bell * tex * maxHalf * lvl * dynamicFactor;
    const halfH = Math.max(0.45, idleBase + speechBoost);

    bars.push({
      x,
      y1: +(WAVE_CENTER_Y - halfH).toFixed(2),
      y2: +(WAVE_CENTER_Y + halfH).toFixed(2),
      opacity: +(0.68 + 0.32 * Math.min(1, bell * (0.45 + lvl * 0.8))).toFixed(2),
    });
  }
  return bars;
});

const buildStarPath = (cx, cy, r, pinch = 0.24) => {
  const k = +(r * pinch).toFixed(2);
  return `M ${cx} ${cy - r} C ${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy} C ${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r} C ${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy} C ${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r} Z`;
};

const sparkleMainPath = buildStarPath(90, 25, 10);
const sparkleMiniPath = buildStarPath(101, 14.5, 4.6);
const sparkleLeftPath = buildStarPath(27, 34, 6);
// Petit sparkle remplaçant le point rond bas dans la capsule (même gabarit que sparkleLeftPath)
const sparkleInnerPath = buildStarPath(60, 56, 6.3, 0.26);
</script>

<style scoped>
.ai-mic-animation-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.mic-root {
  transform-origin: 60px 60px;
}

.user-waveform,
.speaking-waves {
  animation: waveformFadeIn 0.18s ease-out;
}

@keyframes waveformFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.sp-main {
  transform-origin: 90px 25px;
}
.sp-mini {
  transform-origin: 101px 14.5px;
}
.sp-left {
  transform-origin: 27px 34px;
}

/* État Attente : pulsion douce toutes les 3s + éclat léger des sparkles */
.state-pulsing .mic-root {
  animation: micPulseBeat 1s cubic-bezier(0.22, 1, 0.36, 1);
}
.state-pulsing .sp-main {
  animation: sparklePop 1s ease-in-out;
}
.state-pulsing .sp-mini {
  animation: sparklePop 1s ease-in-out 0.08s;
}
.state-pulsing .sp-left {
  animation: sparklePop 1s ease-in-out 0.14s;
}

@keyframes micPulseBeat {
  0%, 100% { transform: scale(1); }
  45% { transform: scale(1.07); }
  78% { transform: scale(0.995); }
}

@keyframes sparklePop {
  0%, 100% { transform: scale(1); }
  48% { transform: scale(1.24); }
}

/* État Réflexion & Recherche Web : micro fixe, sparkles externes clignotants */
.state-thinking .sp-main,
.state-thinking .sp-mini,
.state-thinking .sp-left,
.state-web-searching .sp-main,
.state-web-searching .sp-mini,
.state-web-searching .sp-left {
  animation: webSearchBlink 0.45s ease-in-out infinite;
}

@keyframes webSearchBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.14; }
}
</style>
