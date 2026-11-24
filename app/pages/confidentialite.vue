<template>
  <div class="legal-page mx-auto px-4 py-8" style="max-width: 860px;">
    <v-btn variant="text" color="grey-darken-2" class="text-none mb-4 px-0" @click="goBack">
      <v-icon start>mdi-arrow-left</v-icon>
      Retour
    </v-btn>

    <v-card class="pa-6 pa-sm-8 rounded-xl" elevation="1" style="border: 1px solid #e2e8f0;">
      <div class="d-flex align-center ga-2 mb-2">
        <v-icon color="primary">mdi-shield-lock-outline</v-icon>
        <span class="text-overline font-weight-bold text-primary">Talkiz Video</span>
      </div>
      <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
        Politique de Confidentialité (RGPD)
      </h1>
      <p class="text-caption text-grey-darken-1 mb-6">
        Service : Talkiz Video (<a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a>) &bull; Dernière mise à jour : [Date]
      </p>

      <v-divider class="mb-6" />

      <!-- 1. Responsable de traitement -->
      <section class="legal-section mb-7">
        <h2 class="text-h6 font-weight-bold mb-3">1. Responsable de traitement</h2>
        <p>
          Le responsable du traitement des données personnelles collectées sur <a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a> est la société <strong>[Dénomination sociale de votre SAS]</strong>, domiciliée au [Adresse complète].
        </p>
        <p class="mb-0">
          Pour toute question relative à vos données personnelles ou pour exercer vos droits : <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a>.
        </p>
      </section>

      <!-- 2. Données collectées, finalités et bases légales -->
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

      <!-- 3. Destinataires, sous-traitants et transferts hors UE -->
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

      <!-- 4. Durées de conservation -->
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

      <!-- 5. Cookies et traceurs -->
      <section class="legal-section mb-7">
        <h2 class="text-h6 font-weight-bold mb-3">5. Cookies et traceurs</h2>
        <p class="mb-0">
          Talkiz Video utilise exclusivement des cookies strictement nécessaires au fonctionnement technique du Service (maintien de la session d’authentification Supabase/OAuth et sécurisation du paiement Stripe). Conformément aux lignes directrices de la CNIL, ces traceurs techniques sont dispensés de recueil de consentement. Aucun cookie publicitaire ou de suivi analytique tiers n’est déposé sur votre terminal.
        </p>
      </section>

      <!-- 6. Vos droits et suppression de compte -->
      <section class="legal-section">
        <h2 class="text-h6 font-weight-bold mb-3">6. Vos droits et suppression de compte</h2>
        <p>
          Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données, ainsi que du droit de définir des directives post-mortem.
        </p>
        <p class="mb-0">
          Vous pouvez supprimer à tout moment une vidéo de votre bibliothèque ou supprimer intégralement votre compte et toutes les données associées directement depuis le panneau <strong>Mon compte</strong>, ou en écrivant à <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a>. Vous disposez également du droit d’introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-primary">www.cnil.fr</a>).
        </p>
      </section>
    </v-card>
  </div>
</template>

<script setup>
useHead({
  title: 'Politique de confidentialité (RGPD) — Talkiz Video',
})

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
