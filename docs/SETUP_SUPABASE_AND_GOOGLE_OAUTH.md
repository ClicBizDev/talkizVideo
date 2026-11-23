# Guide de mise en place — Base Supabase dédiée & Google OAuth (`video.talkiz.ai`)

---

## Partie 1 : Nouvelle base Supabase dédiée à Talkiz Video

### Étape 1 — Créer le projet Supabase
1. Dans [Supabase Dashboard](https://supabase.com/dashboard), clique sur **New project**.
2. Nom : `talkiz-video` • Région : **Europe (Paris / Frankfurt)** • Mot de passe DB fort (à conserver).
3. Récupère dans **Project Settings → API** :
   - `Project URL` (`https://<NEW_REF>.supabase.co`)
   - `anon / publishable key` (pour le frontend `talkizVideo`)
   - `service_role key` (pour l'instance backend `DialogServer` dédiée)

---

### Étape 2 — Cloner le schéma exact + données de référence (`set_rules`, `settings`)
Pour garantir 100% de compatibilité avec `DialogServer` (colonnes, extensions `pgvector`, fonctions RPC RAG, index), le plus fiable est de dupliquer le schéma depuis la base actuelle (`ddpgkgvzxajkhgkccklo`) puis les tables de configuration :

```bash
# 1. Exporter le schéma public complet (tables, index, fonctions RPC, extensions)
pg_dump "postgresql://postgres:<OLD_DB_PASS>@db.ddpgkgvzxajkhgkccklo.supabase.co:5432/postgres" \
  --schema=public --schema-only --no-owner --no-privileges \
  -f talkiz_schema.sql

# 2. Exporter uniquement les tables de configuration (sans les clients ni projets existants)
pg_dump "postgresql://postgres:<OLD_DB_PASS>@db.ddpgkgvzxajkhgkccklo.supabase.co:5432/postgres" \
  --data-only --no-owner --no-privileges \
  -t public.set_rules_cat -t public.set_rules -t public.settings \
  -f talkiz_seed.sql

# 3. Importer dans le nouveau projet Supabase talkiz-video
psql "postgresql://postgres:<NEW_DB_PASS>@db.<NEW_REF>.supabase.co:5432/postgres" -f talkiz_schema.sql
psql "postgresql://postgres:<NEW_DB_PASS>@db.<NEW_REF>.supabase.co:5432/postgres" -f talkiz_seed.sql
```

---

### Étape 3 — Trigger d'inscription automatique + crédits gratuits (SQL Editor)
Exécute ce script dans **SQL Editor** du nouveau projet Supabase pour créer automatiquement le profil dans `public.clients` avec **10 crédits offerts (10 minutes)** dès la première connexion Google ou E-mail :

```sql
-- Fonction déclenchée à chaque nouvel utilisateur dans auth.users
create or replace function public.handle_new_video_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.clients (client_uid, client_email, client_active, client_credit_budget)
  values (new.id, new.email, true, 10)
  on conflict (client_uid) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_video_user();

-- RLS : chaque utilisateur connecté peut lire ses propres crédits dans public.clients
alter table public.clients enable row level security;

drop policy if exists "Users can view own client row" on public.clients;
create policy "Users can view own client row"
  on public.clients
  for select
  using (auth.uid() = client_uid);
```

---

### Étape 4 — Connecter la 2e instance `DialogServer` & `talkizVideo`
Sur ton serveur Ubuntu OVH :
1. Duplique le `.env` backend vers `/home/talkiz/.env.server-video` avec :
   - `PORT=3092`
   - `SUPABASE_URL=https://<NEW_REF>.supabase.co`
   - `SUPABASE_SERVICE_KEY=<NEW_SERVICE_ROLE_KEY>`
2. Lance l'instance dédiée via PM2 :
   ```bash
   PORT=3092 pm2 start src/index.js --name "dialog-server-video"
   ```
3. Dans Nginx (virtual host `video.talkiz.ai`), ajoute un bloc `location /api/` qui proxy vers `http://127.0.0.1:3092/api/` (comme sur `studio.talkiz.ai`).
4. Mets à jour `/home/talkiz/.env.video` :
   ```env
   SUPABASE_URL=https://<NEW_REF>.supabase.co
   SUPABASE_KEY=<NEW_ANON_KEY>
   NUXT_PUBLIC_API_URL=https://video.talkiz.ai/api
   NUXT_PUBLIC_SHARE_BASE_URL=https://video.talkiz.ai
   ```

---

## Partie 2 : Configuration Google OAuth (Connexion avec Google)

### Étape 1 — Google Cloud Console
1. Ouvre [Google Cloud Console](https://console.cloud.google.com/) → sélectionne ou crée un projet **Talkiz Video**.
2. Va dans **APIs & Services → OAuth consent screen** :
   - Type : **External**
   - App name : `Talkiz Video`
   - Authorized domains : `talkiz.ai`, `supabase.co`
3. Va dans **APIs & Services → Credentials → + Create Credentials → OAuth client ID** :
   - Application type : **Web application**
   - Name : `Talkiz Video Web`
   - **Authorized JavaScript origins** :
     - `https://video.talkiz.ai`
     - `http://localhost:3006`
   - **Authorized redirect URIs** :
     - `https://<NEW_REF>.supabase.co/auth/v1/callback` *(ou `https://ddpgkgvzxajkhgkccklo.supabase.co/auth/v1/callback` si tu actives Google dès maintenant sur la base actuelle)*
4. Copie le **Client ID** et le **Client Secret**.

### Étape 2 — Supabase Dashboard
1. Va dans **Authentication → Providers → Google** :
   - Active **Enable Sign in with Google**
   - Colle le **Client ID** et le **Client Secret** → **Save**.
2. Va dans **Authentication → URL Configuration** :
   - **Site URL** : `https://video.talkiz.ai`
   - **Redirect URLs** (ajoute les deux) :
     - `https://video.talkiz.ai/auth/callback`
     - `http://localhost:3006/auth/callback`
   - Clique sur **Save**.

C'est tout ! Le bouton **Continuer avec Google** dans `login.vue` est déjà câblé sur `/auth/callback` et fonctionnera immédiatement.
