import { apiClient } from './api.js'

/**
 * Extract YouTube video ID from any standard YouTube URL
 */
export function extractYoutubeId(rawUrl = '') {
    if (!rawUrl) return ''
    const m = String(rawUrl).match(
        /(?:youtube\.com\/(?:watch\?.*?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
    )
    return m ? m[1] : ''
}

/**
 * Validate a YouTube URL
 */
export function isValidYoutubeUrl(rawUrl = '') {
    const trimmed = String(rawUrl).trim()
    return /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i.test(trimmed)
}

/**
 * Ensure client profile exists in public.clients (idempotent)
 */
async function createProfile({ client_uid, email }) {
    const { data } = await apiClient().post('/user/create', { client_uid, email })
    return data
}

/**
 * List all projects for a client, then filter to YouTube video projects only
 */
async function listVideos(clientUid) {
    const { data } = await apiClient().get('/project/list/', {
        params: { client_uid: clientUid, source: 'youtube' },
    })
    const rawList = data?.results?.result || data?.results?.data || data?.results || []
    if (!Array.isArray(rawList)) return []
    return rawList
}

/**
 * Load full project configuration (strictly private — verified via Supabase Bearer JWT)
 */
async function getPrivateProject(projUid) {
    const { data } = await apiClient().get('/project/private', {
        params: { proj_uid: projUid },
    })
    return data?.results?.data || null
}

/**
 * Step 1 of YouTube creation: create the YouTube commentator project shell
 */
async function createYoutubeProject({ clientUid, language = 'fr', projectName = 'YouTube Video' }) {
    const { data } = await apiClient().post('/project/create-from-pdf', {
        clientUid,
        language,
        projectName,
        sourceType: 'youtube',
    })
    return data
}

/**
 * Step 2 of YouTube creation: launch async YouTube multimodal analysis
 */
async function startYoutubeAnalysis({ projectUid, clientUid, youtubeUrl }) {
    const { data } = await apiClient().post('/pdf/upload-youtube', {
        projectUid,
        clientUid,
        youtubeUrl,
        updateProjectName: true,
        async: true,
    })
    return data
}

/**
 * Poll async YouTube analysis task status
 */
async function getYoutubeTaskStatus(taskId) {
    const { data } = await apiClient().get(`/pdf/youtube-status?taskId=${encodeURIComponent(taskId)}`)
    return data?.results || null
}

/**
 * Notify user by email when YouTube processing is complete (non-fatal)
 */
async function notifyComplete({ projectUid, clientUid, sourceLabel, language = 'fr' }) {
    const { data } = await apiClient().post('/pdf/notify-complete', {
        projectUid,
        clientUid,
        fileNames: [sourceLabel],
        language,
    })
    return data
}

/**
 * Delete a YouTube video project
 */
async function removeVideo(clientUid, projectUid) {
    const { data } = await apiClient().delete('/project/remove/', {
        params: { client_uid: clientUid, proj_uid: projectUid },
    })
    return data
}

/**
 * RGPD Right to Erasure: permanently delete account & all associated data
 */
async function deleteAccount() {
    const { data } = await apiClient().delete('/user/account')
    return data
}

export default {
    extractYoutubeId,
    isValidYoutubeUrl,
    createProfile,
    listVideos,
    getPrivateProject,
    createYoutubeProject,
    startYoutubeAnalysis,
    getYoutubeTaskStatus,
    notifyComplete,
    removeVideo,
    deleteAccount,
}
