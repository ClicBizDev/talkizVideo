<template>
  <div class="legal-page mx-auto px-4 py-8" style="max-width: 860px;">
    <v-btn variant="text" color="grey-darken-2" class="text-none mb-4 px-0" @click="goBack">
      <v-icon start>mdi-arrow-left</v-icon>
      Retour
    </v-btn>

    <v-card class="pa-6 pa-sm-8 rounded-xl" elevation="1" style="border: 1px solid #e2e8f0;">
      <div class="d-flex align-center ga-2 mb-2">
        <v-icon color="primary">mdi-file-document-outline</v-icon>
        <span class="text-overline font-weight-bold text-primary">Talkiz Video</span>
      </div>
      <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2" style="color: #0f172a;">
        Conditions Générales d'Utilisation et de Vente (CGU / CGV)
      </h1>
      <p class="text-caption text-grey-darken-1 mb-6">
        Service : Talkiz Video (<a href="https://video.talkiz.ai" class="text-primary">https://video.talkiz.ai</a>) &bull; Dernière mise à jour : [Date]
      </p>

      <v-divider class="mb-6" />

      <!-- Article 1 -->
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

      <!-- Article 2 -->
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

      <!-- Article 3 -->
      <section class="legal-section mb-7">
        <h2 class="text-h6 font-weight-bold mb-3">Article 3 – Accès, compte utilisateur et sécurité</h2>
        <p>
          L’accès au Service nécessite la création d’un compte personnel via un fournisseur d’authentification tiers (actuellement Google OAuth, et ultérieurement Apple ou lien magique par e-mail). L’Utilisateur garantit l’exactitude des informations associées à son compte et demeure responsable de la confidentialité de ses accès.
        </p>
        <p>
          L’Éditeur se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU/CGV, d’usage frauduleux ou de tentative de contournement des limitations techniques.
        </p>
      </section>

      <!-- Article 4 -->
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

      <!-- Article 5 -->
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

      <!-- Article 6 -->
      <section class="legal-section mb-7">
        <h2 class="text-h6 font-weight-bold mb-3">Article 6 – Propriété intellectuelle et procédure de retrait</h2>
        <p>
          La marque Talkiz Video, l’interface, les logiciels, les bases de données et les textes du site sont la propriété exclusive de l’Éditeur. Les vidéos accessibles via le lecteur YouTube intégré demeurent la propriété exclusive de leurs titulaires de droits respectifs.
        </p>
        <p>
          Tout ayant droit estimant qu’un contenu ou une analyse porte atteinte à ses droits peut notifier l’Éditeur à l’adresse <a href="mailto:legal@talkiz.ai" class="text-primary">[legal@talkiz.ai]</a> en précisant l’URL YouTube concernée et les motifs de sa demande. L’Éditeur s’engage à traiter la demande dans les meilleurs délais et peut bloquer techniquement l’analyse de toute URL signalée.
        </p>
      </section>

      <!-- Article 7 -->
      <section class="legal-section mb-7">
        <h2 class="text-h6 font-weight-bold mb-3">Article 7 – Disponibilité et limitation de responsabilité</h2>
        <p>
          Le Service repose sur des services tiers essentiels (YouTube IFrame, API Google Gemini, API OpenAI, Stripe). L’Éditeur est tenu à une obligation de moyens et ne saurait être tenu responsable en cas d’interruption, de modification ou de restriction technique décidée par ces plateformes tierces.
        </p>
        <p>
          La responsabilité de l’Éditeur ne pourra être engagée pour les dommages indirects (perte de chance, perte de données, préjudice commercial) ni au-delà du montant total payé par l’Utilisateur au cours des douze (12) derniers mois.
        </p>
      </section>

      <!-- Article 8 -->
      <section class="legal-section">
        <h2 class="text-h6 font-weight-bold mb-3">Article 8 – Droit applicable, médiation et litiges</h2>
        <p>
          Les présentes CGU/CGV sont soumises au droit français.
        </p>
        <p>
          Conformément aux articles L.612-1 et suivants du Code de la consommation, l’Utilisateur consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un litige après réclamation écrite préalable auprès de l’Éditeur : [Nom, adresse postale et site web du médiateur choisi, ex. CM2C ou Médiation de la Consommation].
        </p>
        <p class="mb-0">
          À défaut d’accord amiable, les litiges avec un consommateur relèvent des juridictions compétentes en application du Code de procédure civile et du Code de la consommation ; les litiges avec un professionnel relèvent de la compétence exclusive du Tribunal de commerce de [Nanterre / Paris].
        </p>
      </section>
    </v-card>
  </div>
</template>

<script setup>
useHead({
  title: "Conditions Générales d'Utilisation et de Vente — Talkiz Video",
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
