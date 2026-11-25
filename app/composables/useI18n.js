import { ref } from 'vue'
import en from '../locales/en.js'

// Add additional locale dictionaries here later (e.g. fr, es, de, it, pt)
const messages = {
  en,
}

// Set to true once additional locale files (fr.js, etc.) are added
const AUTO_DETECT_BROWSER_LOCALE = false

const detectBrowserLocale = () => {
  if (!AUTO_DETECT_BROWSER_LOCALE || typeof navigator === 'undefined') return 'en'
  const raw = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase()
  return messages[raw] ? raw : 'en'
}

const currentLocale = ref('en')
let initialized = false

export function useI18n() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    const saved = localStorage.getItem('talkiz_video_locale')
    if (saved && messages[saved]) {
      currentLocale.value = saved
    } else {
      currentLocale.value = detectBrowserLocale()
    }
  }

  const setLocale = (lang) => {
    if (messages[lang]) {
      currentLocale.value = lang
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('talkiz_video_locale', lang)
      }
    }
  }

  const t = (key, params = {}) => {
    const dict = messages[currentLocale.value] || messages.en
    let value = key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict)

    if (value === undefined) {
      value = key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), messages.en)
    }

    if (typeof value !== 'string') return key

    return value.replace(/\{\{(\w+)\}\}/g, (_, k) => (params[k] !== undefined ? String(params[k]) : ''))
  }

  return {
    t,
    locale: currentLocale,
    setLocale,
    availableLocales: Object.keys(messages),
  }
}
