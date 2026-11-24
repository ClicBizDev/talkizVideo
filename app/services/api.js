import axios from 'axios'

let cachedApiUrl = ''

const getHost = () => {
    if (cachedApiUrl) return cachedApiUrl
    try {
        const config = useRuntimeConfig()
        cachedApiUrl = config.public.API_URL
    } catch {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            cachedApiUrl = 'http://localhost:3091/api'
        } else {
            cachedApiUrl = 'https://studio.talkiz.ai/api'
        }
    }
    return cachedApiUrl
}

let currentAccessToken = ''

export function setAccessToken(token) {
    currentAccessToken = token || ''
}

export function getAccessToken() {
    return currentAccessToken
}

export function apiClient() {
    const instance = axios.create({
        baseURL: getHost(),
    })

    instance.interceptors.request.use(async (config) => {
        if (!currentAccessToken && typeof window !== 'undefined') {
            try {
                const supabase = useSupabaseClient()
                const { data } = await supabase.auth.getSession()
                if (data?.session?.access_token) {
                    currentAccessToken = data.session.access_token
                }
            } catch {
                // Public context (e.g. shared video page) without Supabase session
            }
        }
        if (currentAccessToken) {
            config.headers.Authorization = `Bearer ${currentAccessToken}`
        }
        return config
    })

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status
            const errCode = error.response?.data?.code
            // Do not treat business 403 errors (e.g. EMBED_DISABLED) as expired sessions
            if (status === 401 || (status === 403 && errCode !== 'EMBED_DISABLED')) {
                console.warn(`[API] Session expirée (${status} sur ${error.config?.url})`)
                setAccessToken('')
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
            }
            return Promise.reject(error)
        }
    )

    return instance
}

export default { apiClient, setAccessToken, getAccessToken, getHost }
