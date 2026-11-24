<template>
  <v-navigation-drawer
    v-model="drawerModel"
    temporary
    width="330"
    style="border-right: 1px solid #e2e8f0;"
  >
    <!-- Header -->
    <div class="d-flex align-center justify-space-between px-4 py-3" style="border-bottom: 1px solid #e2e8f0;">
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="22">mdi-play-box-multiple-outline</v-icon>
        <span class="text-subtitle-1 font-weight-bold">Mes vidéos</span>
        <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold">
          {{ videosStore.videos.length }}
        </v-chip>
      </div>
      <div class="d-flex align-center">
        <v-btn
          icon
          size="small"
          variant="text"
          :loading="videosStore.loadingList"
          title="Actualiser"
          @click="refresh"
        >
          <v-icon size="20">mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          variant="text"
          title="Fermer"
          @click="drawerModel = false"
        >
          <v-icon size="20">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Search box -->
    <div class="pa-3">
      <v-text-field
        v-model="searchQuery"
        placeholder="Rechercher une vidéo..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        rounded="lg"
      />
    </div>

    <!-- Loading state -->
    <div v-if="videosStore.loadingList && videosStore.videos.length === 0" class="pa-6 text-center">
      <v-progress-circular indeterminate color="primary" size="28" width="3" />
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredVideos.length === 0" class="pa-6 text-center text-grey">
      <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-video-off-outline</v-icon>
      <div class="text-body-2">
        {{ searchQuery ? 'Aucune vidéo trouvée' : 'Aucune vidéo ajoutée pour le moment' }}
      </div>
    </div>

    <!-- Video list -->
    <v-list v-else density="compact" class="px-2">
      <v-list-item
        v-for="video in filteredVideos"
        :key="video.proj_uid"
        rounded="lg"
        class="mb-1 video-drawer-item"
        :active="videosStore.activeVideo?.proj_uid === video.proj_uid"
        color="primary"
        @click="handleSelect(video)"
      >
        <template #prepend>
          <v-icon size="18" color="primary" class="mr-2">mdi-play-circle-outline</v-icon>
        </template>

        <v-list-item-title class="text-body-2 font-weight-medium text-truncate">
          {{ video.proj_youtube_title || video.proj_name || 'Vidéo YouTube' }}
        </v-list-item-title>

        <template #append>
          <div class="d-flex align-center">
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="grey-darken-1"
              title="Supprimer cette vidéo"
              @click.stop="confirmDelete(video)"
            >
              <v-icon size="16" color="error">mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-list-item>
    </v-list>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl" class="pa-2">
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Supprimer cette vidéo ?
        </v-card-title>
        <v-card-text class="text-body-2 text-grey-darken-1">
          La vidéo <strong>{{ videoToDelete?.proj_youtube_title || videoToDelete?.proj_name }}</strong> sera définitivement supprimée de votre liste.
        </v-card-text>
        <v-card-actions class="justify-end ga-2">
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="executeDelete">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVideosStore } from '../../../stores/videos'
import { useAuthStore } from '../../../stores/auth'

const videosStore = useVideosStore()
const authStore = useAuthStore()
const route = useRoute()

const searchQuery = ref('')
const deleteDialog = ref(false)
const videoToDelete = ref(null)
const deleting = ref(false)

const drawerModel = computed({
  get: () => videosStore.drawerOpen,
  set: (val) => { videosStore.drawerOpen = val },
})

const filteredVideos = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  if (!q) return videosStore.videos
  return videosStore.videos.filter((v) => {
    const title = (v.proj_youtube_title || v.proj_name || '').toLowerCase()
    const url = (v.proj_youtube_url || '').toLowerCase()
    return title.includes(q) || url.includes(q)
  })
})

const refresh = () => {
  if (authStore.clientUid) {
    videosStore.fetchVideos(authStore.clientUid)
  }
}

const handleSelect = async (video) => {
  drawerModel.value = false
  await videosStore.selectVideo(video.proj_uid)
  if (route.path !== '/') {
    navigateTo('/')
  }
}

const confirmDelete = (video) => {
  videoToDelete.value = video
  deleteDialog.value = true
}

const executeDelete = async () => {
  if (!videoToDelete.value || !authStore.clientUid) return
  deleting.value = true
  await videosStore.deleteVideo(authStore.clientUid, videoToDelete.value.proj_uid)
  deleting.value = false
  deleteDialog.value = false
  videoToDelete.value = null
}
</script>

<style scoped>
.video-drawer-item {
  transition: background-color 0.15s ease;
}
</style>
