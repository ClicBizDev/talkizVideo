<template>
  <div class="d-flex flex-column align-center px-4 py-8" style="max-width: 980px; margin: 0 auto;">
    <!-- Back link -->
    <div class="w-100 d-flex align-center justify-space-between mb-6 flex-wrap ga-2">
      <v-btn variant="text" color="grey-darken-2" class="text-none" to="/">
        <v-icon start>mdi-arrow-left</v-icon>
        {{ t('billing.backToVideos') }}
      </v-btn>

      <v-chip
        :color="authStore.hasCredits ? 'success' : 'error'"
        variant="tonal"
        class="font-weight-bold"
      >
        <v-icon start size="16">mdi-timer-outline</v-icon>
        {{ t('billing.currentBalance', { credits: authStore.formattedCredits }) }}
      </v-chip>
    </div>

    <!-- Header -->
    <div class="text-center mb-8" style="max-width: 600px;">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #0f172a;">
        {{ t('billing.title') }}
      </h1>
      <p class="text-body-1 text-grey-darken-1">
        <strong>{{ t('billing.subtitleStrong') }}</strong>{{ t('billing.subtitleAfter') }}
      </p>
    </div>

    <!-- Info alert if Stripe link not yet configured -->
    <v-alert
      v-if="stripeNotice"
      type="info"
      variant="tonal"
      closable
      class="mb-6 w-100"
      style="max-width: 680px;"
      @click:close="stripeNotice = ''"
    >
      {{ stripeNotice }}
    </v-alert>

    <!-- Pricing cards -->
    <v-row class="w-100" align="stretch">
      <v-col v-for="plan in plans" :key="plan.id" cols="12" md="4">
        <v-card
          class="pa-6 h-100 d-flex flex-column rounded-xl"
          :elevation="plan.popular ? 6 : 1"
          :style="{
            border: plan.popular ? '2px solid #2196F3' : '1px solid #e2e8f0',
            position: 'relative'
          }"
        >
          <v-chip
            v-if="plan.popular"
            color="#2196F3"
            size="small"
            class="text-white font-weight-bold mb-3 align-self-start"
          >
            {{ t('billing.popular') }}
          </v-chip>

          <div class="text-h6 font-weight-bold mb-1" style="color: #0f172a;">
            {{ plan.name }}
          </div>
          <div class="text-caption text-grey-darken-1 mb-4">
            {{ plan.tagline }}
          </div>

          <div class="d-flex align-baseline mb-1">
            <span class="text-h3 font-weight-bold" style="color: #0f172a;">{{ plan.price }}</span>
            <span class="text-body-2 text-grey-darken-1 ml-1">{{ t('billing.oneTime') }}</span>
          </div>

          <div class="text-subtitle-2 font-weight-bold mb-5" style="color: #2196F3;">
            {{ t('billing.creditsLine', { credits: plan.credits }) }}
          </div>

          <v-divider class="mb-4" />

          <div class="flex-grow-1 mb-6">
            <div v-for="(feat, idx) in plan.features" :key="idx" class="d-flex align-center mb-2 text-body-2">
              <v-icon size="18" color="success" class="mr-2 flex-shrink-0">mdi-check-circle-outline</v-icon>
              <span>{{ feat }}</span>
            </div>
          </div>

          <v-btn
            block
            :color="plan.popular ? '#2196F3' : '#0f172a'"
            class="text-white font-weight-bold text-none"
            height="44"
            rounded="lg"
            elevation="1"
            @click="startStripeCheckout(plan)"
          >
            <v-icon start size="18">mdi-lock-outline</v-icon>
            {{ t('billing.choosePlan', { name: plan.name }) }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-caption text-grey mt-8 d-flex align-center ga-2 text-center">
      <v-icon size="16">mdi-shield-check-outline</v-icon>
      {{ t('billing.securityFooter') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

definePageMeta({
  middleware: 'auth',
})

const config = useRuntimeConfig()
const authStore = useAuthStore()
const { t } = useI18n()
const stripeNotice = ref('')

const plans = computed(() => [
  {
    id: 'starter',
    name: t('billing.plans.starter.name'),
    tagline: t('billing.plans.starter.tagline'),
    price: '€9',
    credits: 30,
    popular: false,
    stripeLinkKey: 'STRIPE_LINK_STARTER',
    features: [
      '30 credits = 30 voice minutes',
      'YouTube audio + visual analysis',
      '100% private video library',
      'Full history of your videos',
    ],
  },
  {
    id: 'standard',
    name: t('billing.plans.standard.name'),
    tagline: t('billing.plans.standard.tagline'),
    price: '€19',
    credits: 100,
    popular: true,
    stripeLinkKey: 'STRIPE_LINK_STANDARD',
    features: [
      '100 credits = 100 voice minutes',
      'Long videos supported',
      '100% private video library',
      'Priority video analysis',
    ],
  },
  {
    id: 'pro',
    name: t('billing.plans.pro.name'),
    tagline: t('billing.plans.pro.tagline'),
    price: '€49',
    credits: 350,
    popular: false,
    stripeLinkKey: 'STRIPE_LINK_PRO',
    features: [
      '350 credits = 350 voice minutes',
      'Unlimited videos in your library',
      'Private and secure access',
      'Priority support',
    ],
  },
])

const startStripeCheckout = (plan) => {
  stripeNotice.value = ''
  const rawLink = config.public[plan.stripeLinkKey]

  if (!rawLink) {
    stripeNotice.value = t('billing.stripeNotConfigured', {
      name: plan.name,
      credits: plan.credits,
      key: plan.stripeLinkKey,
    })
    return
  }

  try {
    const url = new URL(rawLink)
    if (authStore.clientUid) {
      url.searchParams.set('client_reference_id', authStore.clientUid)
    }
    if (authStore.clientEmail) {
      url.searchParams.set('prefilled_email', authStore.clientEmail)
    }
    window.location.href = url.toString()
  } catch {
    window.location.href = rawLink
  }
}
</script>
