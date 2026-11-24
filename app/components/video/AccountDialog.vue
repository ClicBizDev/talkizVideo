<template>
  <v-dialog v-model="dialogModel" max-width="460">
    <v-card rounded="xl" class="pa-2">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pb-1">
        <span class="text-h6 font-weight-bold">Mon compte</span>
        <v-btn icon variant="text" size="small" @click="dialogModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-3">
        <!-- Identity -->
        <div class="d-flex align-center ga-3 mb-5 pa-3 rounded-lg" style="background: #f8fafc; border: 1px solid #e2e8f0;">
          <v-avatar size="48" color="primary">
            <v-img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" :alt="authStore.fullName" />
            <span v-else class="text-h6 font-weight-bold text-white">{{ authStore.initials }}</span>
          </v-avatar>
          <div style="min-width: 0;">
            <div class="text-subtitle-1 font-weight-bold text-truncate">
              {{ authStore.fullName || 'Utilisateur Talkiz' }}
            </div>
            <div class="text-caption text-grey-darken-1 text-truncate">
              {{ authStore.clientEmail }}
            </div>
            <v-chip size="x-small" variant="tonal" color="primary" class="mt-1 text-capitalize">
              <v-icon start size="12">
                {{ authStore.provider === 'google' ? 'mdi-google' : 'mdi-email-outline' }}
              </v-icon>
              Connexion {{ authStore.provider || 'email' }}
            </v-chip>
          </div>
        </div>

        <!-- Credits & Plan -->
        <v-list density="compact" class="rounded-lg mb-4" style="border: 1px solid #e2e8f0;">
          <v-list-item>
            <template #prepend>
              <v-icon color="primary" class="mr-2">mdi-timer-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">Crédits restants</v-list-item-title>
            <v-list-item-subtitle class="text-caption">1 crédit = 1 minute de conversation</v-list-item-subtitle>
            <template #append>
              <v-chip
                size="small"
                :color="creditChipColor"
                variant="flat"
                class="font-weight-bold"
              >
                {{ authStore.formattedCredits }} min
              </v-chip>
            </template>
          </v-list-item>

          <v-divider />

          <v-list-item>
            <template #prepend>
              <v-icon color="amber-darken-2" class="mr-2">mdi-crown-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">Formule en cours</v-list-item-title>
            <template #append>
              <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ authStore.planName }}</span>
            </template>
          </v-list-item>

          <v-divider />

          <v-list-item>
            <template #prepend>
              <v-icon color="primary" class="mr-2">mdi-play-box-multiple-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">Vidéos analysées</v-list-item-title>
            <template #append>
              <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ videosStore.videos.length }}</span>
            </template>
          </v-list-item>
        </v-list>

        <!-- Primary Actions -->
        <v-btn
          block
          color="var(--talkizColorBtn)"
          class="text-white font-weight-bold text-none mb-2"
          height="42"
          rounded="lg"
          elevation="1"
          @click="goToBilling"
        >
          <v-icon start>mdi-credit-card-plus-outline</v-icon>
          Recharger mes crédits / Formules
        </v-btn>

        <v-btn
          block
          variant="outlined"
          color="grey-darken-2"
          class="text-none mb-5"
          height="40"
          rounded="lg"
          @click="handleLogout"
        >
          <v-icon start>mdi-logout</v-icon>
          Se déconnecter
        </v-btn>

        <!-- Zone de danger (RGPD — Droit à l'effacement) -->
        <div class="pa-3 rounded-lg" style="background: #fef2f2; border: 1px solid #fecaca;">
          <div class="text-caption font-weight-bold text-red-darken-2 mb-1 d-flex align-center ga-1">
            <v-icon size="15" color="error">mdi-alert-outline</v-icon>
            Zone de danger
          </div>
          <div class="text-caption text-grey-darken-2 mb-3" style="line-height: 1.4;">
            La suppression de votre compte efface définitivement toutes vos vidéos, notes et historiques de conversations.
          </div>
          <v-btn
            block
            color="error"
            variant="flat"
            size="small"
            class="text-none font-weight-bold"
            height="38"
            rounded="lg"
            @click="openDeleteConfirm"
          >
            <v-icon start size="17">mdi-delete-forever-outline</v-icon>
            Supprimer mon compte et toutes mes données
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Modale de confirmation de suppression définitive -->
    <v-dialog v-model="showDeleteConfirm" max-width="430" persistent>
      <v-card rounded="xl" class="pa-3">
        <v-card-title class="d-flex align-center ga-2 text-subtitle-1 font-weight-bold text-red-darken-2 pb-1">
          <v-icon color="error">mdi-alert-circle-outline</v-icon>
          <span>Suppression définitive du compte</span>
        </v-card-title>

        <v-card-text class="text-body-2 text-grey-darken-2 pt-3" style="line-height: 1.55;">
          <p class="mb-3">
            Cette action est <strong>définitive et irréversible</strong>. Toutes vos vidéos analysées, notes associées, historiques de conversations et votre profil seront définitivement supprimés de nos serveurs.
          </p>
          <v-alert type="warning" variant="tonal" density="compact" class="mb-3">
            Vos crédits restants (<strong>{{ authStore.formattedCredits }} min</strong>) seront définitivement perdus et ne pourront pas être récupérés.
          </v-alert>
          <v-alert v-if="deleteError" type="error" variant="tonal" density="compact">
            {{ deleteError }}
          </v-alert>
        </v-card-text>

        <v-card-actions class="justify-end ga-2 pt-2">
          <v-btn
            variant="text"
            color="grey-darken-1"
            class="text-none"
            :disabled="deletingAccount"
            @click="showDeleteConfirm = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            rounded="pill"
            class="text-white text-none font-weight-bold px-4"
            :loading="deletingAccount"
            @click="executeAccountDeletion"
          >
            Confirmer la suppression
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useVideosStore } from '../../../stores/videos'
import videoService from '../../services/video.service.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const supabase = useSupabaseClient()
const authStore = useAuthStore()
const videosStore = useVideosStore()

const showDeleteConfirm = ref(false)
const deletingAccount = ref(false)
const deleteError = ref('')

const dialogModel = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const creditChipColor = computed(() => {
  const b = Number(authStore.creditBudget ?? 0)
  if (b <= 0) return 'error'
  if (b < 5) return 'orange'
  return 'success'
})

const goToBilling = () => {
  dialogModel.value = false
  navigateTo('/billing')
}

const handleLogout = async () => {
  dialogModel.value = false
  await supabase.auth.signOut()
  authStore.clearUser()
  videosStore.clearActiveVideo()
  navigateTo('/login')
}

const openDeleteConfirm = () => {
  deleteError.value = ''
  showDeleteConfirm.value = true
}

const executeAccountDeletion = async () => {
  if (deletingAccount.value) return
  deletingAccount.value = true
  deleteError.value = ''

  try {
    const uid = authStore.clientUid
    await videoService.deleteAccount()

    // Clear local consent flags & session immediately
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mic_consent_accepted')
      if (uid) localStorage.removeItem(`mic_consent_accepted_${uid}`)
    }

    try {
      await supabase.auth.signOut()
    } catch {
      // Auth user is already deleted server-side
    }

    authStore.clearUser()
    videosStore.videos = []
    videosStore.clearActiveVideo()
    showDeleteConfirm.value = false
    dialogModel.value = false
    navigateTo('/login')
  } catch (err) {
    console.error('[AccountDialog] Account deletion error:', err)
    deleteError.value = err?.response?.data?.message || err?.message || 'Impossible de supprimer le compte pour le moment.'
  } finally {
    deletingAccount.value = false
  }
}
</script>
