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
        <v-icon color="primary">mdi-file-document-outline</v-icon>
        <span class="text-overline font-weight-bold text-primary">Talkiz Video</span>
      </div>

      <!-- ======================== FRENCH VERSION ======================== -->
      <template v-if="isFrench">
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
          Conditions Générales d'Utilisation et de Vente (CGU / CGV)
        </h1>
        <p class="text-caption text-grey-darken-1 mb-6">
          Service : Talkiz Video (<a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a>) &bull; Dernière mise à jour : [Date]
        </p>

        <v-divider class="mb-6" />

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 1 – Objet et mentions légales</h2>
          <p>
            Les présentes Conditions Générales d’Utilisation et de Vente (ci-après les « CGU/CGV ») régissent l’accès et l’utilisation du service en ligne <strong>Talkiz Video</strong>, accessible à l’adresse <a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a> (ci-après le « Service »), édité par :
          </p>
          <ul class="legal-list mb-3">
            <li><strong>Société</strong> : [Dénomination sociale de votre SAS], SAS au capital de [Montant] €, immatriculée au RCS de [Ville] sous le numéro [SIRET/SIREN], TVA intracommunautaire [Numéro].</li>
            <li><strong>Siège social</strong> : [Adresse complète].</li>
            <li><strong>Directeur de la publication</strong> : [Prénom Nom].</li>
            <li><strong>Contact</strong> : <a href="mailto:contact@talkiz.ai" class="text-primary">[contact@talkiz.ai]</a>.</li>
            <li><strong>Hébergeur applicatif</strong> : OVHcloud (2 rue Kellermann, 59100 Roubaix, France) ; base de données hébergée par Supabase (Irlande, Union européenne).</li>
          </ul>
          <div class="legal-callout">
            <strong>Mention de non-affiliation :</strong> Talkiz Video est un service indépendant. Il n’est ni affilié, ni sponsorisé, ni approuvé par YouTube ou Google LLC. YouTube est une marque déposée de Google LLC.
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 2 – Description du Service et transparence IA</h2>
          <p>
            Talkiz Video est un outil de productivité permettant à un utilisateur inscrit de soumettre l’URL d’une vidéo YouTube publique afin de générer un assistant vocal d’intelligence artificielle interactif capable de répondre à l’oral à ses questions sur le contenu de la vidéo et de piloter la lecture du lecteur officiel YouTube intégré (mise en pause, repositionnement à un instant précis).
          </p>
          <p>
            Le Service ne télécharge, n’héberge et ne redistribue aucun fichier vidéo ou audio issu de YouTube. La lecture s’effectue exclusivement via le lecteur officiel YouTube IFrame.
          </p>
          <div class="legal-callout">
            <strong>Information relative à l’intelligence artificielle (Règlement UE 2024/1689 – AI Act) :</strong> L’Utilisateur est expressément informé qu’il interagit avec un système d’intelligence artificielle. Les réponses vocales, notes et résumés générés sont produits automatiquement et peuvent contenir des inexactitudes, omissions ou approximations. L’Utilisateur s’engage à vérifier toute information importante directement dans la vidéo d’origine.
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 3 – Accès, compte utilisateur et sécurité</h2>
          <p>
            L’accès au Service nécessite la création d’un compte personnel via un fournisseur d’authentification tiers (actuellement Google OAuth, et ultérieurement Apple ou lien magique par e-mail). L’Utilisateur garantit l’exactitude des informations associées à son compte et demeure responsable de la confidentialité de ses accès.
          </p>
          <p>
            L’Éditeur se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU/CGV, d’usage frauduleux ou de tentative de contournement des limitations techniques.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 4 – Modèle économique, crédits et paiement (CGV)</h2>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.1. Nature de la prestation facturée</h3>
          <p>
            Le Service repose sur un modèle freemium : l’Utilisateur bénéficie de crédits gratuits à l’inscription (10 crédits offerts sans carte bancaire) et peut acquérir des packs de crédits complémentaires par paiement unique. Un (1) crédit correspond à une (1) minute de conversation vocale avec l’assistant IA.
          </p>
          <p>
            Il est expressément précisé que l’Utilisateur rémunère exclusivement la mise à disposition d’une capacité de calcul et d’interaction vocale par intelligence artificielle. L’Éditeur ne vend en aucun cas l’accès aux vidéos YouTube, lesquelles restent gratuitement accessibles sur YouTube et lues via son lecteur officiel.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.2. Tarifs et paiement</h3>
          <p>
            Les tarifs des packs de crédits (ex. Starter, Standard, Pro) sont indiqués en euros toutes taxes comprises (TTC) sur la page des formules avant validation de la commande. Les paiements sont sécurisés et traités intégralement par le prestataire Stripe ; l’Éditeur ne stocke aucune donnée bancaire. Lorsque le solde atteint zéro (0) crédit, l’accès à la conversation vocale est suspendu jusqu’au rechargement du compte.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.3. Durée de validité des crédits</h3>
          <p>
            Les crédits achetés sont valables pendant une durée de [12 ou 24 mois] à compter de leur date d’achat. Sauf disposition légale impérative contraire, les crédits consommés ou expirés ne sont ni remboursables ni échangeables. En cas de suppression volontaire du compte par l’Utilisateur, les crédits restants sont définitivement perdus.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.4. Droit de rétractation (Utilisateurs consommateurs – B2C)</h3>
          <p>
            Conformément à l’article L.221-28, 13° du Code de la consommation, le droit de rétractation de quatorze (14) jours ne peut être exercé pour la fourniture d’un contenu numérique sans support matériel dont l’exécution a commencé avec l’accord préalable exprès du consommateur.
          </p>
          <p>
            En cochant la case dédiée avant la validation du paiement sur Stripe, l’Utilisateur consommateur demande l’attribution immédiate de ses crédits dès la confirmation du paiement et reconnaît expressément renoncer à son droit de rétractation.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 5 – Responsabilité de l’Utilisateur : URLs YouTube et partage externe</h2>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">5.1. Soumission des URLs YouTube</h3>
          <p>
            L’Utilisateur s’engage à ne soumettre au Service que des URLs de vidéos YouTube publiques accessibles librement, dans le respect des Conditions d’Utilisation de YouTube et des droits de propriété intellectuelle des tiers.
          </p>
          <p class="mb-2">Il est strictement interdit à l’Utilisateur :</p>
          <ul class="legal-list mb-3">
            <li>de soumettre des contenus illicites, contrefaisants, diffamatoires, haineux ou portant atteinte à la vie privée de tiers ;</li>
            <li>de tenter de contourner les restrictions techniques mises en place par YouTube ou par les créateurs de contenu (notamment lorsque le titulaire des droits a désactivé l’intégration de la vidéo sur des sites tiers, auquel cas le Service bloque l’analyse de la vidéo) ;</li>
            <li>d’utiliser l’assistant IA dans le but d’extraire ou de reconstituer la transcription intégrale mot à mot d’une œuvre protégée.</li>
          </ul>
          <p>
            L’espace <em>Mes vidéos</em> de l’Utilisateur est strictement privé. Le Service ne propose aucune indexation publique ni aucun lien public d’accès aux analyses réalisées.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">5.2. Export et partage externe des conversations</h3>
          <p>
            Le Service permet à l’Utilisateur d’afficher le texte de ses échanges avec l’assistant IA et, s’il le souhaite, de le copier ou de le partager par ses propres moyens (e-mail, messagerie, réseaux sociaux), éventuellement accompagné de liens hypertextes horodatés renvoyant vers les passages correspondants sur YouTube.
          </p>
          <p class="mb-2">L’Utilisateur reconnaît et accepte que :</p>
          <ul class="legal-list">
            <li><strong>Responsabilité éditoriale exclusive :</strong> Tout partage externe s’effectue sous sa seule et entière responsabilité. Il lui appartient de vérifier l’exactitude des propos générés par l’IA avant toute diffusion, afin d’éviter toute attribution erronée, dénaturation ou atteinte à la réputation de l’auteur de la vidéo.</li>
            <li><strong>Respect du droit d’auteur :</strong> L’Utilisateur s’interdit d’utiliser le partage de conversation pour diffuser publiquement des reproductions substantielles de contenus protégés en dehors des exceptions légales (telles que la courte citation ou l’usage privé).</li>
            <li><strong>Maintien de l’attribution et de l’avertissement IA :</strong> L’Utilisateur s’engage à ne pas supprimer la mention d’origine indiquant que le texte a été généré par une intelligence artificielle ainsi que le lien renvoyant vers la vidéo YouTube originale.</li>
            <li><strong>Garantie :</strong> L’Utilisateur garantit l’Éditeur contre toute réclamation, action ou condamnation émanant d’un tiers (notamment un créateur de contenu ou un ayant droit) résultant d’un usage ou d’un partage illicite effectué depuis son compte.</li>
          </ul>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 6 – Propriété intellectuelle et procédure de retrait</h2>
          <p>
            La marque Talkiz Video, l’interface, les logiciels, les bases de données et les textes du site sont la propriété exclusive de l’Éditeur. Les vidéos accessibles via le lecteur YouTube intégré demeurent la propriété exclusive de leurs titulaires de droits respectifs.
          </p>
          <p>
            Tout ayant droit estimant qu’un contenu ou une analyse porte atteinte à ses droits peut notifier l’Éditeur à l’adresse <a href="mailto:legal@talkiz.ai" class="text-primary">[legal@talkiz.ai]</a> en précisant l’URL YouTube concernée et les motifs de sa demande. L’Éditeur s’engage à traiter la demande dans les meilleurs délais et peut bloquer techniquement l’analyse de toute URL signalée.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 7 – Disponibilité et limitation de responsabilité</h2>
          <p>
            Le Service repose sur des services tiers essentiels (YouTube IFrame, API Google Gemini, API OpenAI, Stripe). L’Éditeur est tenu à une obligation de moyens et ne saurait être tenu responsable en cas d’interruption, de modification ou de restriction technique décidée par ces plateformes tierces.
          </p>
          <p>
            La responsabilité de l’Éditeur ne pourra être engagée pour les dommages indirects (perte de chance, perte de données, préjudice commercial) ni au-delà du montant total payé par l’Utilisateur au cours des douze (12) derniers mois.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="text-h6 font-weight-bold mb-3">Article 8 – Droit applicable, médiation et litiges</h2>
          <p>Les présentes CGU/CGV sont soumises au droit français.</p>
          <p>
            Conformément aux articles L.612-1 et suivants du Code de la consommation, l’Utilisateur consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un litige après réclamation écrite préalable auprès de l’Éditeur : [Nom, adresse postale et site web du médiateur choisi, ex. CM2C ou Médiation de la Consommation].
          </p>
          <p class="mb-0">
            À défaut d’accord amiable, les litiges avec un consommateur relèvent des juridictions compétentes en application du Code de procédure civile et du Code de la consommation ; les litiges avec un professionnel relèvent de la compétence exclusive du Tribunal de commerce de [Nanterre / Paris].
          </p>
        </section>
      </template>

      <!-- ======================== ENGLISH VERSION ======================== -->
      <template v-else>
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
          Terms of Use and Sale
        </h1>
        <p class="text-caption text-grey-darken-1 mb-6">
          Service: Talkiz Video (<a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a>) &bull; Last updated: [Date]
        </p>

        <v-divider class="mb-6" />

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 1 – Purpose and Legal Information</h2>
          <p>
            These General Terms of Use and Sale (hereinafter the "Terms") govern access to and use of the online service <strong>Talkiz Video</strong>, accessible at <a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a> (hereinafter the "Service"), published by:
          </p>
          <ul class="legal-list mb-3">
            <li><strong>Company</strong>: [Company Name], French SAS with share capital of €[Amount], registered with the Trade and Companies Register of [City] under number [SIRET/SIREN], EU VAT number [VAT Number].</li>
            <li><strong>Registered office</strong>: [Full Address].</li>
            <li><strong>Publication Director</strong>: [First Name Last Name].</li>
            <li><strong>Contact</strong>: <a href="mailto:contact@talkiz.ai" class="text-primary">[contact@talkiz.ai]</a>.</li>
            <li><strong>Application host</strong>: OVHcloud (2 rue Kellermann, 59100 Roubaix, France); database hosted by Supabase (Ireland, European Union).</li>
          </ul>
          <div class="legal-callout">
            <strong>Non-affiliation notice:</strong> Talkiz Video is an independent service. It is not affiliated with, sponsored by, or endorsed by YouTube or Google LLC. YouTube is a registered trademark of Google LLC.
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 2 – Description of the Service and AI Transparency</h2>
          <p>
            Talkiz Video is a productivity tool allowing a registered user to submit the URL of a public YouTube video in order to generate an interactive AI voice assistant capable of answering spoken questions about the video's content and controlling playback of the embedded official YouTube player (pausing, seeking to a specific timestamp).
          </p>
          <p>
            The Service does not download, host, or redistribute any video or audio file from YouTube. Playback takes place exclusively through the official YouTube IFrame player.
          </p>
          <div class="legal-callout">
            <strong>Artificial Intelligence Disclosure (EU Regulation 2024/1689 – AI Act):</strong> The User is expressly informed that they are interacting with an artificial intelligence system. Generated voice responses, notes, and summaries are produced automatically and may contain inaccuracies, omissions, or approximations. The User agrees to verify any important information directly in the original video.
          </div>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 3 – Access, User Account, and Security</h2>
          <p>
            Access to the Service requires creating a personal account via a third-party authentication provider (currently Google OAuth, and subsequently Apple or email magic link). The User guarantees the accuracy of their account information and remains responsible for keeping their credentials confidential.
          </p>
          <p>
            The Publisher reserves the right to suspend or delete any account in the event of a breach of these Terms, fraudulent use, or any attempt to bypass technical limitations.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 4 – Business Model, Credits, and Payment (Terms of Sale)</h2>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.1. Nature of the Billed Service</h3>
          <p>
            The Service operates on a freemium model: the User receives free credits upon registration (10 free credits, no credit card required) and may purchase additional credit packs via a one-time payment. One (1) credit corresponds to one (1) minute of voice conversation with the AI assistant.
          </p>
          <p>
            It is expressly specified that the User pays exclusively for the provision of AI computing capacity and voice interaction. Under no circumstances does the Publisher sell access to YouTube videos, which remain freely accessible on YouTube and played via its official player.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.2. Pricing and Payment</h3>
          <p>
            Prices of credit packs (e.g., Starter, Standard, Pro) are displayed in euros including all taxes (VAT included) on the pricing page prior to order confirmation. Payments are secured and processed entirely by Stripe; the Publisher stores no payment card data. When the balance reaches zero (0) credits, voice conversation access is suspended until the account is topped up.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.3. Credit Validity</h3>
          <p>
            Purchased credits are valid for [12 or 24 months] from the date of purchase. Unless otherwise required by mandatory law, consumed or expired credits are non-refundable and non-exchangeable. Upon voluntary account deletion by the User, any remaining credits are permanently forfeited.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">4.4. Right of Withdrawal (Consumer Users – B2C)</h3>
          <p>
            In accordance with Article L.221-28, 13° of the French Consumer Code, the fourteen (14) day right of withdrawal cannot be exercised for the supply of digital content not supplied on a tangible medium whose performance has begun with the consumer's prior express consent.
          </p>
          <p>
            By checking the dedicated box prior to payment confirmation on Stripe, the consumer User requests immediate allocation of their credits upon payment confirmation and expressly acknowledges waiving their right of withdrawal.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 5 – User Responsibility: YouTube URLs and External Sharing</h2>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">5.1. Submission of YouTube URLs</h3>
          <p>
            The User undertakes to submit to the Service only URLs of freely accessible public YouTube videos, in compliance with YouTube's Terms of Service and third-party intellectual property rights.
          </p>
          <p class="mb-2">The User is strictly prohibited from:</p>
          <ul class="legal-list mb-3">
            <li>submitting unlawful, infringing, defamatory, hateful content, or content violating third-party privacy;</li>
            <li>attempting to circumvent technical restrictions set by YouTube or content creators (in particular when the rights holder has disabled embedding on third-party websites, in which case the Service blocks analysis of the video);</li>
            <li>using the AI assistant for the purpose of extracting or reconstructing a verbatim full transcript of a protected work.</li>
          </ul>
          <p>
            The User's <em>My Videos</em> workspace is strictly private. The Service provides no public indexing and no public sharing link to generated analyses.
          </p>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">5.2. Export and External Sharing of Conversations</h3>
          <p>
            The Service allows the User to view the text of their exchanges with the AI assistant and, if desired, copy or share it by their own means (email, messaging, social media), possibly accompanied by timestamped hyperlinks pointing to the corresponding segments on YouTube.
          </p>
          <p class="mb-2">The User acknowledges and agrees that:</p>
          <ul class="legal-list">
            <li><strong>Sole editorial responsibility:</strong> Any external sharing is carried out under their sole and full responsibility. They must verify the accuracy of AI-generated statements before any dissemination to avoid misattribution, distortion, or harm to the video author's reputation.</li>
            <li><strong>Copyright compliance:</strong> The User shall not use conversation sharing to publicly distribute substantial reproductions of protected content outside legal exceptions (such as short quotation or private use).</li>
            <li><strong>Retention of attribution and AI notice:</strong> The User agrees not to remove the notice indicating that the text was generated by artificial intelligence or the link to the original YouTube video.</li>
            <li><strong>Indemnification:</strong> The User shall indemnify and hold harmless the Publisher against any claim, action, or judgment brought by a third party (including a content creator or rights holder) arising from unlawful use or sharing conducted from their account.</li>
          </ul>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 6 – Intellectual Property and Takedown Procedure</h2>
          <p>
            The Talkiz Video brand, interface, software, databases, and website texts are the exclusive property of the Publisher. Videos accessed via the embedded YouTube player remain the exclusive property of their respective rights holders.
          </p>
          <p>
            Any rights holder who believes that content or an analysis infringes their rights may notify the Publisher at <a href="mailto:legal@talkiz.ai" class="text-primary">[legal@talkiz.ai]</a> specifying the relevant YouTube URL and the grounds for their request. The Publisher undertakes to process the request promptly and may technically block analysis of any reported URL.
          </p>
        </section>

        <section class="legal-section mb-7">
          <h2 class="text-h6 font-weight-bold mb-3">Article 7 – Availability and Limitation of Liability</h2>
          <p>
            The Service relies on essential third-party services (YouTube IFrame, Google Gemini API, OpenAI API, Stripe). The Publisher is bound by a best-efforts obligation and cannot be held liable for any interruption, modification, or technical restriction decided by these third-party platforms.
          </p>
          <p>
            The Publisher shall not be liable for indirect damages (loss of opportunity, loss of data, commercial loss) nor beyond the total amount paid by the User over the preceding twelve (12) months.
          </p>
        </section>

        <section class="legal-section">
          <h2 class="text-h6 font-weight-bold mb-3">Article 8 – Governing Law, Mediation, and Disputes</h2>
          <p>These Terms are governed by French law.</p>
          <p>
            In accordance with Articles L.612-1 et seq. of the French Consumer Code, consumer Users have the right to use a consumer mediator free of charge to seek an amicable resolution of a dispute following a prior written complaint to the Publisher: [Name, postal address, and website of the appointed mediator, e.g., CM2C].
          </p>
          <p class="mb-0">
            Failing amicable settlement, disputes with a consumer shall fall under the jurisdiction of the competent courts pursuant to the French Code of Civil Procedure and Consumer Code; disputes with a business User shall fall under the exclusive jurisdiction of the Commercial Court of [Nanterre / Paris].
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
    ? "Conditions Générales d'Utilisation et de Vente — Talkiz Video"
    : 'Terms of Use and Sale — Talkiz Video',
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

.legal-section h3 {
  color: #1e293b;
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
