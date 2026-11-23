<template>
  <div v-if="loading" class="d-flex align-center justify-center" style="height: 100vh;">
    <v-progress-circular indeterminate color="#2196F3" />
  </div>

  <div v-else-if="error" class="d-flex flex-column align-center justify-center pa-6 text-center" style="height: 100vh;">
    <v-icon size="48" color="error" class="mb-3">mdi-alert-circle-outline</v-icon>
    <div class="text-h6 text-grey-darken-3 mb-2">{{ error }}</div>
    <v-btn variant="tonal" color="primary" to="/" class="mt-2 text-none">
      Aller sur Talkiz Video
    </v-btn>
  </div>

  <div
    v-else-if="project"
    class="d-flex flex-column align-center pa-3"
    style="min-height: 100vh; background: #f8fafc; box-sizing: border-box;"
  >
    <VideoPlayerCard
      :project="project"
      :creditsDepleted="false"
      :showShareActions="true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import videoService from '../services/video.service.js'
import VideoPlayerCard from '../components/video/VideoPlayerCard.vue'

definePageMeta({
  layout: false,
})

const route = useRoute()
const projectId = String(route.params.id || '')

const loading = ref(true)
const error = ref('')
const project = ref(null)

onMounted(async () => {
  try {
    const data = await videoService.getPublicProject(projectId)
    if (data) {
      project.value = data
      const title = data.proj_youtube_title || data.proj_name
      if (title) {
        try { document.title = `Talkiz Video - ${title}` } catch {}
      }
    } else {
      error.value = 'Vidéo non trouvée ou lien invalide.'
    }
  } catch (err) {
    console.error('[Public Video] Load error:', err)
    error.value = 'Impossible de charger cette vidéo.'
  } finally {
    loading.value = false
  }
})
</script>
