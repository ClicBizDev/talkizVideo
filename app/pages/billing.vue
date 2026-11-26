<template>
  <div class="d-flex flex-column align-center px-3 py-5 px-sm-4 py-sm-8" style="max-width: 980px; margin: 0 auto;">
    <!-- Back link -->
    <div class="w-100 d-flex align-center justify-space-between mb-5 mb-sm-6 flex-wrap ga-2">
      <v-btn variant="text" color="grey-darken-2" class="text-none px-1" to="/">
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
    <div class="text-center mb-5 mb-sm-6" style="max-width: 640px;">
      <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
        {{ t('billing.title') }}
      </h1>
      <p class="text-body-2 text-sm-body-1 text-grey-darken-2 mb-4">
        <strong>{{ t('billing.subtitleStrong') }}</strong>{{ t('billing.subtitleAfter') }}
      </p>
      <v-chip color="white" variant="flat" class="px-4 py-2 text-caption font-weight-medium" style="border: 1px solid #cbd5e1; color: #334155;">
        <v-icon start size="16" color="success">mdi-gift-outline</v-icon>
        {{ t('billing.freePlanBanner') }}
      </v-chip>
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
      <v-col v-for="plan in plans" :key="plan.id" cols="12" sm="6" md="4">
        <v-card
          class="pa-5 pa-sm-6 h-100 d-flex flex-column rounded-xl"
          :elevation="plan.popular ? 6 : 1"
          :style="{
            border: plan.popular ? '2px solid #2196F3' : '1px solid #e2e8f0',
            position: 'relative',
            background: '#ffffff'
          }"
        >
          <v-chip
            v-if="plan.popular"
            color="primary"
            variant="flat"
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

          <div class="d-flex align-baseline mb-1 flex-wrap">
            <span class="text-h3 font-weight-bold" style="color: #0f172a;">{{ plan.price }}</span>
            <span class="text-caption text-grey-darken-1 ml-2">{{ plan.billingPeriod }}</span>
          </div>

          <div class="text-subtitle-2 font-weight-bold mb-5" style="color: #2196F3;">
            {{ plan.durationLine }}
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
            :color="plan.comingSoon ? 'grey-lighten-2' : (plan.popular ? 'primary' : '#0f172a')"
            variant="flat"
            :class="plan.comingSoon ? 'text-grey-darken-2 font-weight-bold text-none' : 'text-white font-weight-bold text-none'"
            height="44"
            rounded="lg"
            :elevation="plan.comingSoon ? 0 : 1"
            :disabled="plan.comingSoon"
            @click="startStripeCheckout(plan)"
          >
            <v-icon start size="18">{{ plan.comingSoon ? 'mdi-clock-outline' : 'mdi-lock-outline' }}</v-icon>
            {{ plan.comingSoon ? t('billing.comingSoon') : plan.ctaLabel }}
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
    id: 'standard',
    name: t('billing.plans.standard.name'),
    tagline: t('billing.plans.standard.tagline'),
    price: '€9',
    billingPeriod: t('billing.perMonth'),
    durationLine: t('billing.plans.standard.durationLine'),
    credits: 60,
    popular: true,
    stripeLinkKey: 'STRIPE_LINK_STANDARD',
    comingSoon: !config.public.STRIPE_LINK_STANDARD,
    ctaLabel: t('billing.subscribePlan', { name: t('billing.plans.standard.name') }),
    features: [
      '60 minutes of voice chat every month',
      'YouTube audio + visual analysis',
      '100% private video library',
      'Cancel anytime in one click',
    ],
  },
  {
    id: 'pack5h',
    name: t('billing.plans.pack5h.name'),
    tagline: t('billing.plans.pack5h.tagline'),
    price: '€39',
    billingPeriod: t('billing.oneTimeInclVat'),
    durationLine: t('billing.plans.pack5h.durationLine'),
    credits: 300,
    popular: false,
    stripeLinkKey: 'STRIPE_LINK_PACK_5H',
    comingSoon: !config.public.STRIPE_LINK_PACK_5H,
    ctaLabel: t('billing.buyPack', { name: t('billing.plans.pack5h.name') }),
    features: [
      '5 hours (300 min) of voice conversation',
      'Credits never expire',
      'Long YouTube videos supported',
      '100% private video library',
    ],
  },
  {
    id: 'pack10h',
    name: t('billing.plans.pack10h.name'),
    tagline: t('billing.plans.pack10h.tagline'),
    price: '€69',
    billingPeriod: t('billing.oneTimeInclVat'),
    durationLine: t('billing.plans.pack10h.durationLine'),
    credits: 600,
    popular: false,
    stripeLinkKey: 'STRIPE_LINK_PACK_10H',
    comingSoon: !config.public.STRIPE_LINK_PACK_10H,
    ctaLabel: t('billing.buyPack', { name: t('billing.plans.pack10h.name') }),
    features: [
      '10 hours (600 min) of voice conversation',
      'Best per-hour rate (€6.90 / hour)',
      'Credits never expire',
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
