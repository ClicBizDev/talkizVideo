<template>
  <v-dialog v-model="dialogModel" max-width="440">
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
              <v-icon color="red-darken-1" class="mr-2">mdi-youtube</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">Vidéos analysées</v-list-item-title>
            <template #append>
              <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ videosStore.videos.length }}</span>
            </template>
          </v-list-item>
        </v-list>

        <!-- Actions -->
        <v-btn
          block
          color="var(--talkizColorBtn)"
          class="text-white font-weight-bold mb-2"
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
          color="error"
          height="40"
          rounded="lg"
          @click="handleLogout"
        >
          <v-icon start>mdi-logout</v-icon>
          Se déconnecter
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useVideosStore } from '../../../stores/videos'

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
</script>
