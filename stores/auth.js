import { defineStore } from 'pinia'
import videoService from '../app/services/video.service.js'
import { setAccessToken } from '../app/services/api.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        clientUid: '',
        clientEmail: '',
        fullName: '',
        avatarUrl: '',
        provider: '',
        clientActive: true,
        creditBudget: null, // 1 crédit = 1 minute
        planName: 'Free',
        isRefreshingCredits: false,
        profileReady: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.clientUid && state.clientUid !== 'undefined',
        hasCredits: (state) => state.creditBudget === null || Number(state.creditBudget) > 0,
        formattedCredits: (state) => {
            if (state.creditBudget === null || state.creditBudget === undefined) return '—'
            const val = Number(state.creditBudget)
            return Number.isInteger(val) ? String(val) : val.toFixed(1)
        },
        initials: (state) => {
            const source = state.fullName || state.clientEmail || 'U'
            return source.trim().charAt(0).toUpperCase()
        },
    },

    actions: {
        async hydrateFromSession(supabase, session) {
                if (!session) {
                    this.clearUser()
                    return false
                }

                if (session.access_token) {
                    setAccessToken(session.access_token)
                }

                let user = session.user || null
                let resolvedUid = user?.id || user?.sub || ''

                if (!resolvedUid || !user?.email) {
                    try {
                        const { data: userData } = await supabase.auth.getUser()
                        if (userData?.user) {
                            user = userData.user
                            resolvedUid = user.id || user.sub || ''
                        }
                    } catch (err) {
                        console.warn('[AuthStore] getUser fallback warning:', err?.message || err)
                    }
                }

                if (!resolvedUid) {
                    this.clearUser()
                    return false
                }

                this.clientUid = resolvedUid
                this.clientEmail = user?.email || ''
                this.fullName =
                    user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    this.clientEmail.split('@')[0] ||
                    ''
                this.avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
                this.provider = user?.app_metadata?.provider || 'email'

                // Ensure profile exists in public.clients (idempotent)
                if (!this.profileReady && this.clientUid && this.clientEmail) {
                    try {
                        await videoService.createProfile({
                            client_uid: this.clientUid,
                            email: this.clientEmail,
                        })
                        this.profileReady = true
                    } catch (err) {
                        console.warn('[AuthStore] createProfile warning:', err?.message || err)
                    }
                }

                await this.refreshCredits(supabase)
                return true
            },

        async refreshCredits(supabase) {
                if (!this.clientUid) return
                this.isRefreshingCredits = true
                try {
                    const { data, error } = await supabase
                        .from('clients')
                        .select('client_credit_budget, client_active, client_email')
                        .eq('client_uid', this.clientUid)
                        .single()

                    if (!error && data) {
                        this.creditBudget = data.client_credit_budget ?? 0
                        this.clientActive = data.client_active ?? true
                        if (data.client_email) this.clientEmail = data.client_email
                        // Derive display plan label from budget tier until Stripe subscription column is added
                        if (this.creditBudget >= 300) {
                            this.planName = 'Pro'
                        } else if (this.creditBudget >= 60) {
                            this.planName = 'Standard'
                        } else if (this.creditBudget > 0) {
                            this.planName = 'Starter / Free'
                        } else {
                            this.planName = 'Out of credits'
                        }
                    }
                } catch (err) {
                    console.error('[AuthStore] Failed to fetch credits:', err)
                } finally {
                    this.isRefreshingCredits = false
                }
            },

            clearUser() {
                this.clientUid = ''
                this.clientEmail = ''
                this.fullName = ''
                this.avatarUrl = ''
                this.provider = ''
                this.clientActive = true
                this.creditBudget = null
                this.planName = 'Free'
                this.profileReady = false
                setAccessToken('')
            },
        },
    })
