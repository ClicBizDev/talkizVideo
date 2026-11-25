<template>
  <div class="legal-page mx-auto px-4 py-8" style="max-width: 860px;">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn variant="text" color="grey-darken-2" class="text-none px-0" @click="goBack">
        <v-icon start>mdi-arrow-left</v-icon>
        {{ isFrench ? 'Retour' : 'Back' }}
      </v-btn>

      <v-btn
        variant="tonal"
        size="small"
        color="primary"
        rounded="pill"
        class="text-none"
        @click="isFrench ? switchToEnglish() : switchToFrench()"
      >
        <v-icon start size="16">mdi-translate</v-icon>
        {{ isFrench ? 'English version' : 'Version française' }}
      </v-btn>
    </div>

    <v-card class="pa-6 pa-sm-8 rounded-xl" elevation="1" style="border: 1px solid #e2e8f0;">
      <!-- Prevalence Banner (shown only on English version) -->
      <v-alert
        v-if="!isFrench"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-6 text-body-2"
      >
        <div>
          This translation is provided for informational purposes only. In case of any discrepancy in interpretation or dispute, only the French version shall prevail.
        </div>
        <div class="mt-1">
          <a
            href="?lang=fr"
            class="font-weight-bold text-primary"
            style="text-decoration: underline;"
            @click.prevent="switchToFrench"
          >
            View the official French version (Version française)
          </a>
        </div>
      </v-alert>

      <div class="d-flex align-center ga-2 mb-2">
        <v-icon color="primary">mdi-shield-lock-outline</v-icon>
        <span class="text-overline font-weight-bold text-primary">Talkiz Video</span>
      </div>

      <!-- ======================== FRENCH VERSION ======================== -->
      <template v-if="isFrench">
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
          Politique de Confidentialité (RGPD)
        </h1>
        <p class="text-caption text-grey-darken-1 mb-6">
          Service : Talkiz Video (<a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a>) &bull; Dernière mise à jour : [Date]
        </p>

        <v-divider class="mb-6" />

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">1. Responsable de traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées sur <a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a> est la société <strong>[Dénomination sociale de votre SAS]</strong>, domiciliée au [Adresse complète].
          </p>
          <p class="mb-0">
            Pour toute question relative à vos données personnelles ou pour exercer vos droits : <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a>.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">2. Données collectées, finalités et bases légales</h2>
          <div class="table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Catégorie de données</th>
                  <th>Finalité du traitement</th>
                  <th>Base légale (RGPD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Identité et compte</strong> (e-mail, nom complet, photo de profil via Google OAuth, UUID)</td>
                  <td>Création et gestion du compte, authentification, envoi des notifications de service</td>
                  <td>Exécution du contrat (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td><strong>Données d’usage vidéo</strong> (URLs YouTube soumises, titres, notes/résumés dérivés, embeddings)</td>
                  <td>Fourniture de l’analyse et de la bibliothèque privée <em>Mes vidéos</em></td>
                  <td>Exécution du contrat (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td><strong>Flux audio vocal</strong> (microphone en temps réel)</td>
                  <td>Interaction vocale avec l’assistant IA (transmis en temps réel, non enregistré en fichier audio sur nos serveurs)</td>
                  <td>Consentement / Exécution du contrat (art. 6.1.a / 6.1.b)</td>
                </tr>
                <tr>
                  <td><strong>Historiques/transcriptions et durées des conversations</strong></td>
                  <td>Affichage de l’historique à l’Utilisateur, décompte exact des crédits, prévention de la fraude</td>
                  <td>Exécution du contrat (art. 6.1.b) et intérêt légitime (art. 6.1.f)</td>
                </tr>
                <tr>
                  <td><strong>Données de facturation et transactions</strong></td>
                  <td>Achat de packs de crédits via Stripe, obligations comptables et fiscales (aucune donnée CB stockée par Talkiz)</td>
                  <td>Exécution du contrat (art. 6.1.b) et obligation légale (art. 6.1.c)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">3. Destinataires, sous-traitants et transferts hors UE</h2>
          <p>
            Vos données ne sont jamais vendues à des tiers. Elles sont traitées uniquement par les sous-traitants techniques nécessaires au fonctionnement du Service, liés par des engagements contractuels conformes à l’article 28 du RGPD :
          </p>
          <div class="table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Sous-traitant</th>
                  <th>Rôle</th>
                  <th>Localisation et garanties de transfert</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>OVHcloud</strong></td>
                  <td>Hébergement applicatif (frontend &amp; backend)</td>
                  <td>France (Union européenne)</td>
                </tr>
                <tr>
                  <td><strong>Supabase</strong></td>
                  <td>Base de données PostgreSQL et authentification</td>
                  <td>Irlande – <code>eu-west-1</code> (Union européenne)</td>
                </tr>
                <tr>
                  <td><strong>Google LLC</strong> (OAuth, Gemini API, Gmail/SMTP)</td>
                  <td>Authentification, analyse multimodale des URLs YouTube (API payante sans entraînement), e-mails de notification</td>
                  <td>UE / États-Unis (EU-US Data Privacy Framework et Clauses Contractuelles Types)</td>
                </tr>
                <tr>
                  <td><strong>OpenAI</strong> (Realtime / GPT-Live API)</td>
                  <td>Traitement du flux vocal en temps réel (WebRTC) et génération des réponses (API sans entraînement par défaut)</td>
                  <td>États-Unis (DPA et Clauses Contractuelles Types)</td>
                </tr>
                <tr>
                  <td><strong>Stripe</strong></td>
                  <td>Paiement en ligne sécurisé (certifié PCI-DSS)</td>
                  <td>UE / États-Unis (DPF et Clauses Contractuelles Types)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">4. Durées de conservation</h2>
          <ul class="legal-list">
            <li><strong>Données de compte :</strong> conservées pendant toute la durée d’activation du compte, puis supprimées au bout de 3 ans d’inactivité (après notification préalable).</li>
            <li><strong>Projets vidéo (notes, résumés, embeddings) :</strong> conservés tant que l’Utilisateur les maintient dans <em>Mes vidéos</em> ; supprimés immédiatement et définitivement lorsque l’Utilisateur supprime une vidéo ou son compte.</li>
            <li><strong>Flux audio vocal :</strong> non conservé sur nos serveurs (traitement exclusivement en temps réel).</li>
            <li><strong>Historiques/transcriptions des conversations :</strong> conservés pendant 12 mois glissants ou supprimés immédiatement sur demande de l’Utilisateur / suppression du projet.</li>
            <li><strong>Données de facturation et comptables :</strong> conservées 10 ans conformément aux obligations légales françaises (Code de commerce).</li>
          </ul>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">5. Cookies et traceurs</h2>
          <p class="mb-0">
            Talkiz Video utilise exclusivement des cookies strictement nécessaires au fonctionnement technique du Service (maintien de la session d’authentification Supabase/OAuth et sécurisation du paiement Stripe). Conformément aux lignes directrices de la CNIL, ces traceurs techniques sont dispensés de recueil de consentement. Aucun cookie publicitaire ou de suivi analytique tiers n’est déposé sur votre terminal.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="text-h6 font-weight-bold mb-3">6. Vos droits et suppression de compte</h2>
          <p>
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données, ainsi que du droit de définir des directives post-mortem.
          </p>
          <p class="mb-0">
            Vous pouvez supprimer à tout moment une vidéo de votre bibliothèque ou supprimer intégralement votre compte et toutes les données associées directement depuis le panneau <strong>Mon compte</strong>, ou en écrivant à <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a>. Vous disposez également du droit d’introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-primary">www.cnil.fr</a>).
          </p>
        </section>
      </template>

      <!-- ======================== ENGLISH VERSION ======================== -->
      <template v-else>
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
          Privacy Policy (GDPR)
        </h1>
        <p class="text-caption text-grey-darken-1 mb-6">
          Service: Talkiz Video (<a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a>) &bull; Last updated: [Date]
        </p>

        <v-divider class="mb-6" />

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">1. Data Controller</h2>
          <p>
            The data controller for personal data collected on <a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a> is <strong>[Company Name]</strong>, located at [Full Address].
          </p>
          <p class="mb-0">
            For any questions regarding your personal data or to exercise your rights: <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a>.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">2. Data Collected, Purposes, and Legal Bases</h2>
          <div class="table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Data Category</th>
                  <th>Processing Purpose</th>
                  <th>Legal Basis (GDPR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Identity and account</strong> (email, full name, profile picture via Google OAuth, UUID)</td>
                  <td>Account creation and management, authentication, service notifications</td>
                  <td>Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td><strong>Video usage data</strong> (submitted YouTube URLs, titles, derived notes/summaries, embeddings)</td>
                  <td>Delivery of video analysis and the private <em>My Videos</em> library</td>
                  <td>Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td><strong>Voice audio stream</strong> (real-time microphone)</td>
                  <td>Voice interaction with the AI assistant (streamed in real time, not stored as an audio file on our servers)</td>
                  <td>Consent / Performance of a contract (Art. 6(1)(a) / 6(1)(b))</td>
                </tr>
                <tr>
                  <td><strong>Conversation history/transcripts and durations</strong></td>
                  <td>Displaying history to the User, accurate credit deduction, fraud prevention</td>
                  <td>Performance of a contract (Art. 6(1)(b)) and legitimate interest (Art. 6(1)(f))</td>
                </tr>
                <tr>
                  <td><strong>Billing and transaction data</strong></td>
                  <td>Purchase of credit packs via Stripe, accounting and tax obligations (no card data stored by Talkiz)</td>
                  <td>Performance of a contract (Art. 6(1)(b)) and legal obligation (Art. 6(1)(c))</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">3. Recipients, Sub-processors, and International Transfers</h2>
          <p>
            Your data is never sold to third parties. It is processed exclusively by the technical sub-processors required to operate the Service, bound by contractual commitments compliant with Article 28 of the GDPR:
          </p>
          <div class="table-wrapper">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Sub-processor</th>
                  <th>Role</th>
                  <th>Location &amp; Transfer Safeguards</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>OVHcloud</strong></td>
                  <td>Application hosting (frontend &amp; backend)</td>
                  <td>France (European Union)</td>
                </tr>
                <tr>
                  <td><strong>Supabase</strong></td>
                  <td>PostgreSQL database and authentication</td>
                  <td>Ireland – <code>eu-west-1</code> (European Union)</td>
                </tr>
                <tr>
                  <td><strong>Google LLC</strong> (OAuth, Gemini API, Gmail/SMTP)</td>
                  <td>Authentication, multimodal analysis of YouTube URLs (paid API, no training), notification emails</td>
                  <td>EU / United States (EU-US Data Privacy Framework &amp; Standard Contractual Clauses)</td>
                </tr>
                <tr>
                  <td><strong>OpenAI</strong> (Realtime / GPT-Live API)</td>
                  <td>Real-time voice stream processing (WebRTC) and response generation (API without training by default)</td>
                  <td>United States (DPA &amp; Standard Contractual Clauses)</td>
                </tr>
                <tr>
                  <td><strong>Stripe</strong></td>
                  <td>Secure online payment (PCI-DSS certified)</td>
                  <td>EU / United States (DPF &amp; Standard Contractual Clauses)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">4. Data Retention Periods</h2>
          <ul class="legal-list">
            <li><strong>Account data:</strong> retained for as long as the account remains active, then deleted after 3 years of inactivity (following prior notice).</li>
            <li><strong>Video projects (notes, summaries, embeddings):</strong> retained while kept by the User in <em>My Videos</em>; deleted immediately and permanently when the User deletes a video or their account.</li>
            <li><strong>Voice audio stream:</strong> not stored on our servers (processed strictly in real time).</li>
            <li><strong>Conversation history/transcripts:</strong> retained for 12 rolling months or deleted immediately upon User request / project deletion.</li>
            <li><strong>Billing and accounting records:</strong> retained for 10 years in accordance with French statutory obligations (Commercial Code).</li>
          </ul>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">5. Cookies and Trackers</h2>
          <p class="mb-0">
            Talkiz Video exclusively uses technical storage/cookies strictly necessary for the operation of the Service (maintaining the Supabase/OAuth authentication session and securing Stripe payments). In accordance with CNIL guidelines, these strictly necessary technical mechanisms are exempt from prior consent. No third-party advertising or analytics tracking cookies are placed on your device.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="text-h6 font-weight-bold mb-3">6. Your Rights and Account Deletion</h2>
          <p>
            Under the GDPR and the French Data Protection Act, you have the right to access, rectify, erase, restrict, object to, and port your personal data, as well as the right to define post-mortem directives.
          </p>
          <p class="mb-0">
            You may delete any video from your library at any time or permanently delete your entire account and all associated data directly from the <strong>My Account</strong> panel, or by writing to <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a>. You also have the right to lodge a complaint with the French supervisory authority (CNIL – <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-primary">www.cnil.fr</a>).
          </p>
        </section>
      </template>
    </v-card>
  </div>
</template>

<script setup>
const { isFrench, switchToFrench, switchToEnglish } = useLegalLang()

useHead(() => ({
  title: isFrench.value
    ? 'Politique de confidentialité (RGPD) — Talkiz Video'
    : 'Privacy Policy (GDPR) — Talkiz Video',
}))

const router = useRouter()
const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
}
</script>

<style scoped>
.legal-section p {
  font-size: 0.92rem;
  color: #334155;
  line-height: 1.7;
  margin-bottom: 12px;
}

.legal-section h2 {
  color: #0f172a;
}

.legal-list {
  padding-left: 1.25rem;
  font-size: 0.92rem;
  color: #334155;
  line-height: 1.65;
}

.legal-list li {
  margin-bottom: 8px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.legal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.86rem;
  color: #334155;
  min-width: 540px;
}

.legal-table th {
  background: #f8fafc;
  color: #0f172a;
  font-weight: 700;
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.legal-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
  line-height: 1.5;
}

.legal-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
