import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    future: {
        compatibilityVersion: 4,
    },
    ssr: false,

    app: {
        head: {
            title: 'Talkiz Video',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
                { name: 'description', content: 'Talk to any YouTube video with Talkiz Video AI' }
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ]
        }
    },

    modules: [
        '@pinia/nuxt',
        '@nuxtjs/supabase',
    ],

    supabase: {
        redirect: false,
        types: false,
        useSsrCookies: false,
    },

    build: {
        transpile: ['vuetify'],
    },

    css: [
        '~/assets/css/main.css',
        'vuetify/styles',
        '@mdi/font/css/materialdesignicons.css',
    ],

    runtimeConfig: {
        public: {
            API_URL: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3091/api',
            SHARE_BASE_URL: process.env.NUXT_PUBLIC_SHARE_BASE_URL || 'https://video.talkiz.ai',
            STRIPE_LINK_STARTER: process.env.NUXT_PUBLIC_STRIPE_LINK_STARTER || '',
            STRIPE_LINK_STANDARD: process.env.NUXT_PUBLIC_STRIPE_LINK_STANDARD || '',
            STRIPE_LINK_PRO: process.env.NUXT_PUBLIC_STRIPE_LINK_PRO || '',
        }
    },

    devServer: {
        host: '0.0.0.0',
        port: 3006
    },

    devtools: { enabled: false },
})
