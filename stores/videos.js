import { defineStore } from 'pinia'
import videoService from '../app/services/video.service.js'
import { useAuthStore } from './auth'

export const useVideosStore = defineStore('videos', {
    state: () => ({
        videos: [],
        recentVideos: [],
        loadingList: false,
        activeVideo: null,
        loadingActiveVideo: false,
        drawerOpen: false,
        youtubeUrlInput: '',
        isProcessingUrl: false,
        submitNonce: 0,
    }),

    actions: {
        triggerUrlSubmit() {
            this.submitNonce++
        },

        async fetchRecentVideos(limit = 10) {
            try {
                const list = await videoService.getRecentVideos(limit)
                this.recentVideos = list
            } catch (err) {
                console.warn('[VideosStore] Error fetching recent videos:', err)
            }
        },

        async fetchVideos(clientUid) {
            if (!clientUid) return
            this.loadingList = true
            try {
                const list = await videoService.listVideos(clientUid)
                this.videos = list
            } catch (err) {
                console.error('[VideosStore] Error fetching videos:', err)
            } finally {
                this.loadingList = false
            }
        },

        async selectVideo(projUid) {
            if (!projUid) return null
            const authStore = useAuthStore()
            this.loadingActiveVideo = true
            try {
                const fullProject = await videoService.getPrivateProject(projUid)
                if (fullProject && (!authStore.clientUid || fullProject.client_uid === authStore.clientUid)) {
                    this.activeVideo = fullProject
                    return fullProject
                }
                return null
            } catch (err) {
                console.error('[VideosStore] Error loading private video project:', err)
                return null
            } finally {
                this.loadingActiveVideo = false
            }
        },

        async deleteVideo(clientUid, projUid) {
            if (!clientUid || !projUid) return false
            try {
                await videoService.removeVideo(clientUid, projUid)
                this.videos = this.videos.filter((v) => v.proj_uid !== projUid)
                if (this.activeVideo?.proj_uid === projUid) {
                    this.activeVideo = null
                }
                return true
            } catch (err) {
                console.error('[VideosStore] Error deleting video:', err)
                return false
            }
        },

        clearActiveVideo() {
            this.activeVideo = null
        },
    },
})
