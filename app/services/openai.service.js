// ============================================================================
// openai.service.js — Service OpenAI (avec token Supabase)
// ============================================================================
// CHANGEMENT : Remplacement de axios direct par apiClient() centralisé
// Chaque requête injecte automatiquement le token Supabase
// ============================================================================

import { apiClient } from './api.js'

//=======================================================================

/**
 * Generate an ephemeral key for OpenAI Realtime API
 * Calls the backend server which securely handles the OpenAI API key
 * @param {Object} options - Configuration options
 * @param {string} options.model - OpenAI model to use
 * @param {string} options.voice - Voice type to use
 * @returns {Promise} Promise with the session data including client_secret
 */
async function generateEphemeralKey(options = {}) {

  try {
    const response = await apiClient().post('/openai/session', {
      model: options.model,
      voice: options.voice || 'sage',
    });

    return response.data;

  } catch (error) {
    console.error('[OpenAI Service] Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Generate TTS audio using OpenAI Realtime API
 * Uses WebSocket connection for accurate voice preview with real Realtime voices
 * @param {Object} options - TTS options
 * @param {string} options.model - Realtime model (gpt-4o-realtime-preview-2024-10-01)
 * @param {string} options.voice - Voice type (ash, ballad, coral, echo, sage, verse, alloy, shimmer)
 * @param {string} options.input - Text to convert to speech
 * @param {number} options.speed - Speech speed (default: 1.0)
 * @returns {Promise<Blob>} Promise with audio blob
 */
async function generateTTS(options = {}) {

  try {
    const response = await apiClient().post('/openai/tts', {
      model: options.model,
      voice: options.voice || 'sage',
      ...(options.rawVoice ? { rawVoice: options.rawVoice } : {}),
      ...(options.instructions ? { instructions: options.instructions } : {}),
      input: options.input,
      speed: options.speed || 1.0,
    }, {
      responseType: 'blob'
    });

    return response.data;

  } catch (error) {
    console.error('[OpenAI Service] TTS Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Translate text from one language to another using OpenAI
 * @param {Object} options - Translation options
 * @param {string} options.text - Text to translate
 * @param {string} options.sourceLanguage - Source language code (e.g., 'fr', 'en')
 * @param {string} options.targetLanguage - Target language code (e.g., 'en', 'fr')
 * @returns {Promise<string>} Promise with translated text
 */
async function translateText(options = {}) {
  try {
    const response = await apiClient().post('/openai/translate', {
      text: options.text,
      sourceLanguage: options.sourceLanguage,
      targetLanguage: options.targetLanguage,
    });

    if (typeof options.onUsage === 'function' && response.data?.usage) {
      options.onUsage(response.data.usage);
    }
    return response.data.translatedText;

  } catch (error) {
    console.error('[OpenAI Service] Translation Error:', error.response?.data || error.message);
    // Return original text if translation fails
    return options.text;
  }
}

/**
 * Create a GPT-Live session with WebRTC transport
 * Unlike Realtime (ephemeral key + separate SDP), GPT-Live sends everything in one POST.
 * The backend proxies this to OpenAI since it holds the API key.
 * @param {Object} options - Session options
 * @param {string} options.sdp - SDP offer from the browser
 * @param {string} options.voice - Voice name (e.g., 'gleam')
 * @param {string} options.voiceInstructions - Voice personality prompt (session.instructions)
 * @param {string} options.backendInstructions - Business logic prompt (delegation.responses.instructions)
 * @param {string} options.backendModel - Backend model (e.g., 'gpt-5.6-terra')
 * @param {Array} options.tools - Tool definitions for delegation.responses.tools
 * @returns {Promise} Promise with session data including SDP answer
 */
async function createLiveSession(options = {}) {
  try {
    const response = await apiClient().post('/openai/live-session', {
      sdp: options.sdp,
      voice: options.voice || 'gleam',
      ...(options.lang ? { lang: options.lang } : {}),
      voiceInstructions: options.voiceInstructions,
      backendInstructions: options.backendInstructions,
      backendModel: options.backendModel || 'gpt-5.6-terra',
      tools: options.tools || [],
      ...(options.triggers?.length ? { triggers: options.triggers } : {}),
    });

    return response.data;

  } catch (error) {
    console.error('[OpenAI Service] GPT-Live Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Answer a suggested-question button outside of GPT-Live (no delegation).
 * The spoken answer is then handed to the voice model via session.commentary.append.
 * @param {Object} options
 * @param {string} options.instructions - Backend prompt (same as GPT-Live delegation)
 * @param {string} options.question - The suggested question clicked by the user
 * @param {string} [options.model] - Backend model (default gpt-5.6-terra)
 * @param {string} [options.languageName] - Language to answer in (e.g. 'French')
 * @returns {Promise<{speech: string, source_urls: Array<{url: string, title: string}>}>}
 */
async function answerLiveQuestion(options = {}) {
  const response = await apiClient().post('/openai/live-answer', {
    instructions: options.instructions,
    question: options.question,
    model: options.model,
    languageName: options.languageName,
    projectUrl: options.projectUrl,
    projectYoutubeUrl: options.projectYoutubeUrl,
    isPremium: !!options.isPremium,
    isYoutubeSector: !!options.isYoutubeSector,
  }, { timeout: 15000 });
  return response.data;
}

export default {
  generateEphemeralKey,
  createLiveSession,
  answerLiveQuestion,
  generateTTS,
  translateText,
};
