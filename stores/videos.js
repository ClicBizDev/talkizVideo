import { defineStore } from 'pinia'
import videoService from '../app/services/video.service.js'

export const useVideosStore = defineStore('videos', {
    state: () => ({
        videos: [],
        loadingList: false,
        activeVideo: null,
        loadingActiveVideo: false,
        drawerOpen: false,
    }),

    actions: {
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
            this.loadingActiveVideo = true
            try {
                const fullProject = await videoService.getPublicProject(projUid)
                if (fullProject) {
                    this.activeVideo = fullProject
                }
                return fullProject
            } catch (err) {
                console.error('[VideosStore] Error loading video project:', err)
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
