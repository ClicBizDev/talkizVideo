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
        <v-icon color="primary">mdi-scale-balance</v-icon>
        <span class="text-overline font-weight-bold text-primary">Talkiz Video</span>
      </div>

      <!-- ======================== FRENCH VERSION ======================== -->
      <template v-if="isFrench">
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
          Mentions Légales
        </h1>
        <p class="text-caption text-grey-darken-1 mb-6">
          Site : <a href="https://talkiz.yt" class="text-primary">https://talkiz.yt</a> &bull; Dernière mise à jour : [Date]
        </p>

        <v-divider class="mb-6" />

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">1. Éditeur du site</h2>
          <p>
            Le site <a href="https://talkiz.yt" class="text-primary">https://talkiz.yt</a> (service <strong>Talkiz Video</strong>) est édité par :
          </p>
          <ul class="legal-list mb-0">
            <li><strong>Raison sociale :</strong> [Dénomination sociale de votre SAS]</li>
            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS) au capital social de [Montant] euros</li>
            <li><strong>Siège social :</strong> [Adresse complète]</li>
            <li><strong>Immatriculation :</strong> RCS [Ville] n° [Numéro SIREN] – SIRET [Numéro SIRET]</li>
            <li><strong>Numéro de TVA intracommunautaire :</strong> [FR XX XXXXXXXXX]</li>
            <li><strong>E-mail de contact :</strong> <a href="mailto:contact@talkiz.ai" class="text-primary">[contact@talkiz.ai]</a></li>
            <li><strong>Téléphone :</strong> [Numéro de téléphone professionnel]</li>
            <li><strong>Directeur de la publication :</strong> [Prénom Nom], en qualité de Président de la société</li>
          </ul>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">2. Hébergement</h2>

          <p class="mb-1"><strong>Hébergeur applicatif (site web et serveur) :</strong></p>
          <p>
            OVH SAS<br />
            2 rue Kellermann – 59100 Roubaix – France<br />
            Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" class="text-primary">https://www.ovhcloud.com</a> – Téléphone : 1007 (ou +33 9 72 10 10 07)
          </p>

          <p class="mb-1"><strong>Hébergement de la base de données :</strong></p>
          <p class="mb-0">
            Supabase, Inc. (infrastructure hébergée en Union européenne – Irlande, région <code>eu-west-1</code>)<br />
            970 Toa Payoh North #07-04, Singapore 318992 – Site web : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" class="text-primary">https://supabase.com</a>
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">3. Propriété intellectuelle et non-affiliation</h2>
          <p>
            L’ensemble des éléments composant le site <a href="https://talkiz.yt" class="text-primary">https://talkiz.yt</a> (marque Talkiz Video, logo, interface, textes, codes sources, architecture logicielle) est la propriété exclusive de [Dénomination sociale de votre SAS], protégé par le Code de la propriété intellectuelle. Toute reproduction ou représentation totale ou partielle sans autorisation écrite préalable est interdite.
          </p>
          <div class="legal-callout">
            <strong>Clause de non-affiliation :</strong> Talkiz Video est un service indépendant. Il n’est ni affilié, ni sponsorisé, ni approuvé par YouTube ou Google LLC. YouTube est une marque déposée de Google LLC. Les vidéos visionnées via le lecteur officiel YouTube intégré demeurent la propriété exclusive de leurs titulaires de droits respectifs.
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">4. Signalement de contenu et droits d’auteur</h2>
          <p class="mb-0">
            Tout créateur de contenu, ayant droit ou tiers souhaitant signaler un contenu ou demander le blocage de l’analyse d’une URL YouTube sur le Service peut contacter l’Éditeur à l’adresse : <a href="mailto:legal@talkiz.ai" class="text-primary">[legal@talkiz.ai]</a>, en précisant l’URL YouTube concernée et les motifs de sa demande.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">5. Données personnelles et cookies</h2>
          <p class="mb-0">
            Les modalités de collecte, de traitement et de conservation des données personnelles ainsi que l’usage des cookies strictement nécessaires sont détaillés dans notre <NuxtLink to="/confidentialite?lang=fr" class="text-primary font-weight-medium">Politique de Confidentialité</NuxtLink>. Pour exercer vos droits (RGPD), vous pouvez nous écrire à <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a> ou supprimer directement votre compte depuis votre espace personnel.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="text-h6 font-weight-bold mb-3">6. Médiation de la consommation</h2>
          <p>
            Conformément aux articles L.612-1 et suivants du Code de la consommation, tout utilisateur consommateur dispose du droit de recourir gratuitement à un médiateur de la consommation en cas de litige non résolu amiablement avec l’Éditeur :
          </p>
          <ul class="legal-list mb-0">
            <li><strong>Médiateur désigné :</strong> [Nom du médiateur agréé, ex. CM2C]</li>
            <li><strong>Adresse :</strong> [Adresse postale du médiateur]</li>
            <li><strong>Site web :</strong> [URL du médiateur]</li>
          </ul>
        </section>
      </template>

      <!-- ======================== ENGLISH VERSION ======================== -->
      <template v-else>
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
          Legal Notice
        </h1>
        <p class="text-caption text-grey-darken-1 mb-6">
          Website: <a href="https://talkiz.yt" class="text-primary">https://talkiz.yt</a> &bull; Last updated: [Date]
        </p>

        <v-divider class="mb-6" />

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">1. Website Publisher</h2>
          <p>
            The website <a href="https://talkiz.yt" class="text-primary">https://talkiz.yt</a> (<strong>Talkiz Video</strong> service) is published by:
          </p>
          <ul class="legal-list mb-0">
            <li><strong>Company name:</strong> [Company Name]</li>
            <li><strong>Legal form:</strong> French Simplified Joint-Stock Company (SAS) with share capital of €[Amount]</li>
            <li><strong>Registered office:</strong> [Full Address]</li>
            <li><strong>Registration:</strong> Trade &amp; Companies Register (RCS) of [City] No. [SIREN] – SIRET [SIRET]</li>
            <li><strong>EU VAT number:</strong> [FR XX XXXXXXXXX]</li>
            <li><strong>Contact email:</strong> <a href="mailto:contact@talkiz.ai" class="text-primary">[contact@talkiz.ai]</a></li>
            <li><strong>Phone:</strong> [Business Phone Number]</li>
            <li><strong>Publication Director:</strong> [First Name Last Name], President of the company</li>
          </ul>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">2. Hosting</h2>

          <p class="mb-1"><strong>Application host (website and server):</strong></p>
          <p>
            OVH SAS<br />
            2 rue Kellermann – 59100 Roubaix – France<br />
            Website: <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" class="text-primary">https://www.ovhcloud.com</a> – Phone: +33 9 72 10 10 07
          </p>

          <p class="mb-1"><strong>Database hosting:</strong></p>
          <p class="mb-0">
            Supabase, Inc. (infrastructure hosted in the European Union – Ireland, region <code>eu-west-1</code>)<br />
            970 Toa Payoh North #07-04, Singapore 318992 – Website: <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" class="text-primary">https://supabase.com</a>
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">3. Intellectual Property and Non-Affiliation</h2>
          <p>
            All elements comprising the website <a href="https://talkiz.yt" class="text-primary">https://talkiz.yt</a> (Talkiz Video trademark, logo, interface, texts, source code, software architecture) are the exclusive property of [Company Name] and are protected under intellectual property law. Any total or partial reproduction or representation without prior written authorization is prohibited.
          </p>
          <div class="legal-callout">
            <strong>Non-affiliation clause:</strong> Talkiz Video is an independent service. It is not affiliated with, sponsored by, or endorsed by YouTube or Google LLC. YouTube is a registered trademark of Google LLC. Videos viewed through the embedded official YouTube player remain the exclusive property of their respective rights holders.
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">4. Content Reporting and Copyright</h2>
          <p class="mb-0">
            Any content creator, rights holder, or third party wishing to report content or request the blocking of analysis of a YouTube URL on the Service may contact the Publisher at <a href="mailto:legal@talkiz.ai" class="text-primary">[legal@talkiz.ai]</a>, specifying the YouTube URL concerned and the reasons for the request.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">5. Personal Data and Cookies</h2>
          <p class="mb-0">
            Details regarding the collection, processing, and retention of personal data as well as strictly necessary cookies are set out in our <NuxtLink to="/confidentialite?lang=en" class="text-primary font-weight-medium">Privacy Policy</NuxtLink>. To exercise your GDPR rights, you may email us at <a href="mailto:privacy@talkiz.ai" class="text-primary">[privacy@talkiz.ai]</a> or delete your account directly from your personal space.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="text-h6 font-weight-bold mb-3">6. Consumer Mediation</h2>
          <p>
            In accordance with Articles L.612-1 et seq. of the French Consumer Code, any consumer User has the right to have free recourse to a consumer mediator in the event of a dispute not resolved amicably with the Publisher:
          </p>
          <ul class="legal-list mb-0">
            <li><strong>Appointed mediator:</strong> [Name of approved mediator, e.g., CM2C]</li>
            <li><strong>Address:</strong> [Mediator postal address]</li>
            <li><strong>Website:</strong> [Mediator URL]</li>
          </ul>
        </section>
      </template>
    </v-card>
  </div>
</template>

<script setup>
const { isFrench, switchToFrench, switchToEnglish } = useLegalLang()

useHead(() => ({
  title: isFrench.value ? 'Mentions légales — Talkiz Video' : 'Legal Notice — Talkiz Video',
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

.legal-callout {
  background: #f8fafc;
  border-left: 3px solid #2196F3;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.6;
}
</style>
