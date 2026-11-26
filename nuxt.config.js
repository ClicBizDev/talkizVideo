import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    future: {
        compatibilityVersion: 4,
    },
    ssr: false,
    spaLoadingTemplate: 'spa-loading-template.html',

    app: {
        head: {
            htmlAttrs: { lang: 'en' },
            title: 'Talkiz.yt — Have a Voice Chat with Any YouTube Video',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
                { name: 'description', content: 'Paste any public YouTube link and have a real-time AI voice conversation about the video. Ask questions out loud and jump directly to exact timestamps.' },
                { name: 'theme-color', content: '#DCEBFE' },
                // Open Graph (LinkedIn, Facebook, WhatsApp, Slack, Discord)
                { property: 'og:type', content: 'website' },
                { property: 'og:site_name', content: 'Talkiz.yt' },
                { property: 'og:url', content: 'https://talkiz.yt' },
                { property: 'og:title', content: 'Talkiz.yt — Have a Voice Chat with Any YouTube Video' },
                { property: 'og:description', content: 'Paste any public YouTube link, ask questions out loud, and jump straight to the exact moment in the video. Free to start.' },
                { property: 'og:image', content: 'https://talkiz.yt/og-talkiz-yt.png' },
                { property: 'og:image:width', content: '1200' },
                { property: 'og:image:height', content: '630' },
                { property: 'og:image:alt', content: 'Talkiz.yt — Have a voice chat with any YouTube video' },
                // Twitter / X Card
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'Talkiz.yt — Have a Voice Chat with Any YouTube Video' },
                { name: 'twitter:description', content: 'Paste any public YouTube link, ask questions out loud, and jump straight to the exact moment in the video.' },
                { name: 'twitter:image', content: 'https://talkiz.yt/og-talkiz-yt.png' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=6' },
                { rel: 'apple-touch-icon', href: '/logo-talkiz-yt-square.png' },
                { rel: 'canonical', href: 'https://talkiz.yt' },
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
            SHARE_BASE_URL: process.env.NUXT_PUBLIC_SHARE_BASE_URL || 'https://talkiz.yt',
            STRIPE_LINK_STANDARD: process.env.NUXT_PUBLIC_STRIPE_LINK_STANDARD || '',
            STRIPE_LINK_PACK_5H: process.env.NUXT_PUBLIC_STRIPE_LINK_PACK_5H || process.env.NUXT_PUBLIC_STRIPE_LINK_STARTER || '',
            STRIPE_LINK_PACK_10H: process.env.NUXT_PUBLIC_STRIPE_LINK_PACK_10H || process.env.NUXT_PUBLIC_STRIPE_LINK_PRO || '',
        }
    },

    devServer: {
        host: '0.0.0.0',
        port: 3006
    },

    devtools: { enabled: false },
})
