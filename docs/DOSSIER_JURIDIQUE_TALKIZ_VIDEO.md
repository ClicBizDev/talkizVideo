# Dossier de présentation juridique — Projet **Talkiz Video** (`video.talkiz.ai`)

> **Objet** : Présentation fonctionnelle, technique et économique du service **Talkiz Video** à destination de notre conseil juridique, en vue de :
> 1. Évaluer la conformité du service vis-à-vis des **Conditions d'Utilisation de YouTube** et du **droit d'auteur / propriété intellectuelle** ;
> 2. Identifier les **bonnes pratiques et limites à respecter** (« choses à faire / ne pas faire ») ;
> 3. Rédiger les **Conditions Générales d'Utilisation et de Vente (CGU / CGV)**, la **Politique de Confidentialité (RGPD)** et les **Mentions Légales**.

---

## 1. Présentation générale du service

- **Nom du service** : Talkiz Video
- **Domaine** : `https://video.talkiz.ai`
- **Concept** : Application web permettant à un utilisateur de coller l’URL d’une vidéo YouTube publique afin de générer un **assistant vocal IA interactif** capable de répondre à l’oral à ses questions sur le contenu de la vidéo et de piloter la lecture de la vidéo intégrée (ex. se positionner à un passage précis, mettre en pause la vidéo lorsque l’utilisateur parle à l’assistant).
- **Public cible** : Grand public, étudiants, professionnels (veille, formation, analyse de conférences/podcasts/tutoriels).
- **Modèle économique** :
  - **Freemium** : attribution de crédits gratuits à l’inscription (actuellement 10 crédits offerts, sans carte bancaire requise).
  - **Achat de packs de crédits** (paiement unique via **Stripe**) : **1 crédit = 1 minute** de conversation vocale avec l’assistant (ex. packs Starter 30 min / Standard 100 min / Pro 350 min).
  - À `0` crédit, la conversation vocale est bloquée et l’utilisateur est redirigé vers la page des formules.

---

## 2. Parcours utilisateur détaillé

1. **Inscription / Connexion** :
   - Authentification via **Google OAuth** (prévu prochainement : Apple et lien magique e-mail).
   - Création automatique d’un compte utilisateur dans notre base de données dédiée avec 10 crédits offerts.
2. **Soumission d’une vidéo YouTube** :
   - L’utilisateur colle l’URL d’une vidéo YouTube publique dans le champ dédié et clique sur **`+`**.
   - Un écran d’attente affiche l’avancement de l’analyse (notification par e-mail lorsque l’analyse est terminée).
3. **Consultation & interaction vocale** :
   - Dès l’analyse terminée, la page affiche :
     - Le **lecteur officiel YouTube intégré (IFrame)** avec le titre de la vidéo ;
     - Des **boutons de questions suggérées** générées automatiquement ;
     - L’**assistant vocal Talkiz** permettant de poser des questions au microphone.
   - Interactions entre le lecteur YouTube et l’assistant :
     - Lorsque l’utilisateur lance une conversation vocale, le lecteur YouTube est mis en pause via l’API officielle YouTube IFrame ;
     - Lorsque l’utilisateur demande un passage précis, l’assistant peut repositionner le lecteur YouTube officiel au bon timestamp (`seekTo`) ;
     - Lorsque l’utilisateur relance manuellement la vidéo YouTube, l’assistant vocal se met automatiquement en pause.
4. **Bibliothèque personnelle & partage** :
   - L’utilisateur accède à la liste de ses vidéos analysées (tiroir *Mes vidéos*), peut les rouvrir dans le player, les **supprimer définitivement**, ou **copier un lien de partage** (`https://video.talkiz.ai/<identifiant>`) donnant accès au player intégré + assistant vocal.
5. **Gestion du compte & crédits** :
   - L’utilisateur consulte son identité, son solde de crédits restants (mis à jour en fin de conversation) et sa formule, et peut recharger via Stripe.

---

## 3. Fonctionnement technique exact vis-à-vis de YouTube *(point clé juridique)*

Pour permettre une analyse juridique précise des **Conditions d'Utilisation de YouTube** et du **droit d'auteur**, voici exactement ce que fait — et ne fait **pas** — notre architecture technique :

### Ce que Talkiz Video NE FAIT PAS :
- **Aucun téléchargement ni extraction du flux vidéo ou audio** : nous n’utilisons ni `yt-dlp`, ni extracteur de flux, ni copie locale de fichiers MP4/MP3 YouTube.
- **Aucun hébergement ni redistribution de la vidéo ou de l’audio** : aucun fichier média YouTube n’est stocké sur nos serveurs ni dans notre base de données.
- **Aucun contournement des restrictions YouTube ou de la publicité** :
  - La lecture s’effectue exclusivement via le **lecteur officiel YouTube IFrame** (`https://www.youtube.com/embed/<videoId>?enablejsapi=1`), qui conserve l’interface YouTube, le comptage des vues et les publicités YouTube.
  - Si le propriétaire de la chaîne YouTube a **désactivé l’intégration sur des sites tiers** (erreurs YouTube `101` / `150`), Talkiz Video **ne tente aucun contournement** : le lecteur est remplacé par la miniature officielle YouTube, un message indiquant que les fonctions sont limitées et un lien direct **« Regarder sur YouTube »**.
- **Aucun entraînement de modèle d'IA** sur les vidéos YouTube.

### Ce que Talkiz Video FAIT :
1. **Métadonnées** : récupération du titre via l’endpoint public `youtube.com/oembed` et de la durée publique.
2. **Analyse multimodale via l’API officielle Google Gemini** : notre serveur transmet uniquement l’**URL YouTube publique** (`fileData.fileUri`) à l’**API officielle Google Gemini** (service de Google LLC, maison mère de YouTube, qui propose nativement le traitement d’URL YouTube dans sa documentation officielle).
3. **Stockage dérivé uniquement** : nous enregistrons dans notre base de données uniquement :
   - Les notes/résumés textuels structurés et horodatés produits par Gemini ;
   - Des vecteurs mathématiques (embeddings RAG) servant à la recherche sémantique lors de la conversation ;
   - L’URL YouTube publique et le titre, associés au compte de l’utilisateur.
4. **Suppression** : lorsque l’utilisateur supprime une vidéo de sa bibliothèque, le projet et ses données dérivées associées sont supprimés.

---

## 4. Architecture, hébergement et flux de données personnelles (RGPD)

### Données personnelles collectées
- **Compte utilisateur** : adresse e-mail, nom complet et photo de profil (fournis via Google OAuth), identifiant technique UUID, fournisseur d’authentification, solde de crédits.
- **Usage du service** : liste des URLs YouTube soumises par l’utilisateur, historiques/transcriptions et durées des conversations vocales (nécessaires au décompte des crédits et au fonctionnement du service), flux audio en temps réel lors de l’utilisation du microphone (non conservé sous forme de fichier audio sur nos serveurs).
- **Paiement** : géré intégralement par **Stripe** (nous ne stockons aucune donnée de carte bancaire).

### Sous-traitants & localisation des données

| Sous-traitant | Rôle | Localisation / Transfert |
|---|---|---|
| **OVHcloud** | Hébergement serveur applicatif (frontend Nuxt + backend Node.js) | **France (UE)** |
| **Supabase** | Base de données PostgreSQL dédiée (`ymdhiynwxmmsxyonzpti`) & Authentification | **Irlande — `eu-west-1` (UE)** |
| **Google (OAuth & Gemini API)** | Authentification Google + Analyse multimodale des URLs YouTube via API Gemini | États-Unis / UE (DPF / Clauses Contractuelles Types) |
| **OpenAI (Realtime / GPT-Live API)** | Conversation vocale en temps réel (WebRTC) et génération de réponses | États-Unis (DPA / CCT, API sans entraînement par défaut) |
| **Stripe** | Paiement en ligne des packs de crédits | UE / États-Unis (certifié PCI-DSS) |
| **Google Gmail / SMTP** | Envoi des e-mails de notification (fin d’analyse vidéo, alerte crédits épuisés) | UE / États-Unis |

---

## 5. Points et questions clés à soumettre à l’avocat

### A. Conformité juridique vis-à-vis de YouTube & Droit d’auteur
1. **CGU YouTube & API Google Gemini** : le fait d’envoyer une URL YouTube publique à l’API officielle Google Gemini (qui le propose nativement) et d’afficher la vidéo via le lecteur officiel YouTube IFrame présente-t-il un risque au regard des *YouTube Terms of Service* (interdiction d’accès automatisé / scraping, utilisation commerciale) ?
2. **Partage public (`video.talkiz.ai/<slug>`) vs usage privé** :
   - La fonction actuelle permet à un utilisateur de copier un lien public partageable vers son assistant dédié à une vidéo YouTube.
   - Est-il préférable de **restreindre l’accès aux seules vidéos privées de l’utilisateur connecté** (pas de lien public), ou le partage public est-il acceptable sous certaines conditions (ex. absence de référencement SEO `noindex`, attribution claire à la chaîne YouTube, procédure de retrait / *notice & takedown* pour les ayants droit) ?
3. **Chaînes ayant bloqué l’intégration (erreurs 101/150)** : faut-il également bloquer l’analyse ou l’usage de l’assistant vocal lorsque le propriétaire a désactivé l’embed YouTube, ou l’affichage actuel avec mention « fonctions limitées » + lien vers YouTube suffit-il ?
4. **Responsabilité de l’utilisateur** : quelles clauses insérer dans les CGU pour encadrer les URLs soumises par l’utilisateur (vidéos publiques uniquement, respect des droits tiers, interdiction d’usage illicite) ?

### B. RGPD & Vie privée
5. **Données vocales & microphone** : quelles mentions d’information et de consentement afficher avant l’activation du microphone et la transmission du flux vocal vers OpenAI ?
6. **Durée de conservation** : quelles durées fixer pour les transcriptions de conversations, les projets vidéo et les comptes inactifs ?
7. **Suppression de compte** : confirmer la nécessité d’un bouton « Supprimer mon compte et toutes mes données » dans le panneau *Mon compte* (droit à l’effacement RGPD).
8. **Cookies** : nos cookies servent uniquement à la session d’authentification (strictement nécessaires) — confirmer si un bandeau cookies est dispensé tant qu’aucun traceur publicitaire/analytics tiers n’est ajouté.

### C. AI Act (Règlement européen sur l’IA)
9. **Obligations de transparence** : quelles mentions exactes afficher dans l’interface pour informer l’utilisateur qu’il interagit avec une IA et que les réponses/résumés peuvent contenir des inexactitudes ?

### D. CGV / E-commerce (Stripe & Crédits)
10. **Droit de rétractation (B2C)** : formule de renonciation expresse au droit de rétractation de 14 jours lors de l’achat de packs de crédits numériques consommables immédiatement (case à cocher obligatoire avant paiement Stripe).
11. **Durée de validité des crédits & remboursement** : définir la durée de validité des crédits achetés et les règles en cas de résiliation/fermeture de compte.

---

## 6. Livrables souhaités de l’avocat

1. **Avis juridique synthétique** (risques YouTube / droit d’auteur, recommandations produit « à faire / ne pas faire », notamment sur le partage public et les vidéos à embed bloqué).
2. **Conditions Générales d’Utilisation et de Vente (CGU / CGV)** adaptées à `video.talkiz.ai` (FR + éventuellement EN).
3. **Politique de Confidentialité (RGPD)** listant les traitements, bases légales, durées et sous-traitants ci-dessus.
4. **Mentions légales** (à compléter avec les informations de la société éditrice).
5. **Textes courts d’interface** (case d’acceptation CGU/renonciation rétractation Stripe, mention IA, mention droits d’auteur / signalement).
