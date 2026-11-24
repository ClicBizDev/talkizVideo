import { useAuthStore } from '../../stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const supabase = useSupabaseClient()
    const authStore = useAuthStore()

    const { data } = await supabase.auth.getSession()
    const session = data?.session

    if (!session) {
        return navigateTo('/login')
    }

    if (!authStore.isAuthenticated) {
        const ok = await authStore.hydrateFromSession(supabase, session)
        if (!ok) {
            return navigateTo('/login')
        }
    }
})
