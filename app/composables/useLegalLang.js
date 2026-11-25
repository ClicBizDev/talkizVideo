import { computed } from 'vue'

/**
 * Resolves whether to display the French or English legal document:
 * - Explicit `?lang=fr` or `?lang=en` query parameter takes precedence.
 * - Otherwise auto-detects from the browser language (`fr*` -> French, any other -> English).
 */
export function useLegalLang() {
  const route = useRoute()
  const router = useRouter()

  const isFrench = computed(() => {
    const q = String(route.query.lang || '').toLowerCase()
    if (q === 'fr') return true
    if (q === 'en') return false
    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase()
      return browserLang.startsWith('fr')
    }
    return false
  })

  const switchToFrench = () => {
    router.replace({ query: { ...route.query, lang: 'fr' } })
  }

  const switchToEnglish = () => {
    router.replace({ query: { ...route.query, lang: 'en' } })
  }

  return {
    isFrench,
    switchToFrench,
    switchToEnglish,
  }
}
