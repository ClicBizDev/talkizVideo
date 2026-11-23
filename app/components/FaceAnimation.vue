<template>
  <AiMicAnimation
    :isPulsing="isPulsing"
    :isListening="isListening"
    :isUserSpeaking="isUserSpeaking"
    :userAudioLevel="userAudioLevel"
    :isThinking="isThinking"
    :agentIsSpeaking="agentIsSpeaking"
    :agentAudioLevel="agentAudioLevel"
    :isSearchingWeb="isSearchingWeb"
    :colorText="colorText"
    :colorBg="colorBg"
  />
</template>

<script setup>
import AiMicAnimation from './AiMicAnimation.vue';

defineProps({
  isPulsing: { type: Boolean, default: false },
  isListening: { type: Boolean, default: false },
  isUserSpeaking: { type: Boolean, default: false },
  userAudioLevel: { type: Number, default: 0 },
  isThinking: { type: Boolean, default: false },
  agentIsSpeaking: { type: Boolean, default: false },
  agentAudioLevel: { type: Number, default: 0 },
  isSearchingWeb: { type: Boolean, default: false },
  colorText: { type: String, default: '' },
  colorBg: { type: String, default: '' },
});
</script>
