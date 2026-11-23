<template>
  <div class="login-backdrop d-flex align-center justify-center pa-4">
    <div class="login-card">
      <!-- Brand badge -->
      <div class="d-flex align-center justify-center ga-2 mb-5">
        <img
          src="/logo-talkiz-icon.svg"
          alt="Talkiz"
          style="height: 36px; width: 36px; background: #000; border-radius: 10px; padding: 5px; border: 1px solid rgba(255,255,255,0.14);"
        />
        <span style="font-size: 1.5rem; font-weight: 700; color: #3b82f6; letter-spacing: -0.025em;">
          Talkiz<span style="color: #ffffff;">.ai</span>
        </span>
        <v-chip size="x-small" color="red-darken-1" variant="flat" class="font-weight-bold">
          Video
        </v-chip>
      </div>

      <!-- Heading (OpusClip-inspired layout) -->
      <h1 class="login-title text-center mb-2">
        Connectez-vous pour discuter avec vos vidéos YouTube
      </h1>
      <p class="login-subtitle text-center mb-6">
        Forfait gratuit disponible. Aucune carte de crédit requise.
      </p>

      <!-- Feedback alerts -->
      <v-alert
        v-if="errorMsg"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4 text-left"
      >
        {{ errorMsg }}
      </v-alert>
      <v-alert
        v-if="successMsg"
        type="success"
        variant="tonal"
        density="compact"
        class="mb-4 text-left"
      >
        {{ successMsg }}
      </v-alert>

      <!-- Google OAuth button -->
      <button
        type="button"
        class="oauth-btn mb-3"
        :disabled="loadingGoogle"
        @click="loginWithGoogle"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" class="mr-3">
          <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.51-3.51C18.14 1.38 15.34 0 12 0 7.31 0 3.25 2.69 1.28 6.6l4.09 3.17C6.34 6.91 8.94 5.04 12 5.04z"/>
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.87 3c2.26-2.09 3.55-5.17 3.55-8.82z"/>
          <path fill="#FBBC05" d="M5.37 14.23a7.17 7.17 0 0 1 0-4.46L1.28 6.6a11.98 11.98 0 0 0 0 10.8l4.09-3.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3c-1.08.72-2.45 1.16-4.06 1.16-3.06 0-5.66-1.87-6.63-4.52l-4.09 3.17C3.25 21.31 7.31 24 12 24z"/>
        </svg>
        <span>{{ loadingGoogle ? 'Redirection vers Google...' : 'Continuer avec Google' }}</span>
      </button>

      <!-- Apple OAuth button (ready for when Apple provider is enabled in Supabase) -->
      <button
        type="button"
        class="oauth-btn mb-5"
        :disabled="loadingApple"
        @click="loginWithApple"
      >
        <v-icon size="22" color="white" class="mr-3">mdi-apple</v-icon>
        <span>Continuer avec Apple</span>
      </button>

      <!-- Separator -->
      <div class="divider-row mb-5">
        <span>ou continuez avec l'e-mail</span>
      </div>

      <!-- Email input + button -->
      <form @submit.prevent="loginWithEmail">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Entrez votre adresse e-mail"
          class="dark-input mb-3"
        />

        <input
          v-if="usePasswordMode"
          v-model="password"
          type="password"
          required
          placeholder="Mot de passe"
          class="dark-input mb-3"
        />

        <button
          type="submit"
          class="email-submit-btn"
          :disabled="loadingEmail"
        >
          {{ loadingEmail ? 'Connexion...' : (usePasswordMode ? 'Se connecter' : "Continuer avec l'e-mail") }}
        </button>
      </form>

      <div class="text-center mt-4">
        <button
          type="button"
          class="mode-toggle-link"
          @click="usePasswordMode = !usePasswordMode"
        >
          {{ usePasswordMode ? 'Recevoir un lien magique par e-mail' : 'Se connecter avec un mot de passe' }}
        </button>
      </div>

      <!-- Legal footer -->
      <p class="legal-note text-center mt-6 mb-0">
        En continuant, vous acceptez les conditions d'utilisation de Talkiz.ai et notre Politique de confidentialité.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const usePasswordMode = ref(false)
const loadingGoogle = ref(false)
const loadingApple = ref(false)
const loadingEmail = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (data?.session) {
    await authStore.hydrateFromSession(supabase, data.session)
    navigateTo('/')
  }
})

const loginWithGoogle = async () => {
  errorMsg.value = ''
  loadingGoogle.value = true
  try {
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      errorMsg.value = error.message
      loadingGoogle.value = false
    }
  } catch (err) {
    errorMsg.value = err?.message || 'Erreur lors de la connexion Google.'
    loadingGoogle.value = false
  }
}

const loginWithApple = async () => {
  errorMsg.value = ''
  loadingApple.value = true
  try {
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo },
    })
    if (error) {
      errorMsg.value = 'La connexion Apple sera disponible prochainement. Utilisez Google ou votre e-mail.'
      loadingApple.value = false
    }
  } catch {
    errorMsg.value = 'La connexion Apple sera disponible prochainement.'
    loadingApple.value = false
  }
}

const loginWithEmail = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  loadingEmail.value = true
  try {
    if (usePasswordMode.value) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value,
      })
      if (error) throw error
      if (data?.session) {
        await authStore.hydrateFromSession(supabase, data.session)
        navigateTo('/')
      }
    } else {
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOtp({
        email: email.value.trim(),
        options: { emailRedirectTo: redirectTo },
      })
      if (error) throw error
      successMsg.value = 'Un lien de connexion vient d’être envoyé à votre adresse e-mail.'
    }
  } catch (err) {
    errorMsg.value = err?.message || 'Erreur lors de la connexion.'
  } finally {
    loadingEmail.value = false
  }
}
</script>

<style scoped>
.login-backdrop {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1e293b 0%, #090d16 70%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #1c1e24;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 36px 30px 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  color: #ffffff;
}

.login-title {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 700;
  color: #ffffff;
}

.login-subtitle {
  font-size: 0.92rem;
  color: #9ca3af;
}

.oauth-btn {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #2f323b;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.18s ease, transform 0.12s ease;
}

.oauth-btn:hover:not(:disabled) {
  background: #3a3e49;
}

.oauth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 0.85rem;
}

.divider-row::before,
.divider-row::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.dark-input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #14161b;
  color: #ffffff;
  font-size: 0.94rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.dark-input:focus {
  border-color: #3b82f6;
}

.dark-input::placeholder {
  color: #6b7280;
}

.email-submit-btn {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.email-submit-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.email-submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.mode-toggle-link {
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 0.84rem;
  cursor: pointer;
  text-decoration: underline;
}

.mode-toggle-link:hover {
  color: #ffffff;
}

.legal-note {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.45;
}
</style>
