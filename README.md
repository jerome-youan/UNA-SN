# Sciences Nature Campus — version publique

Application web pour étudiants de Sciences de la Nature (L1/L2) : cours, TD, TP, exercices, quiz, espace étudiant, professeur IA et base documentaire IA.

## Ce qui est prêt
- Comptes étudiants et authentification sécurisée par cookie HTTP-only, avec connexion/déconnexion visibles dans la navigation selon la session.
- Niveaux L1/L2 et ressources par matière, avec favoris (★) pour les étudiants connectés.
- Quiz interactifs, création complète depuis l'espace administrateur (questions à choix multiples, bonne réponse, explication), validation des réponses avant correction et historique des résultats.
- Professeur IA avec recherche dans les documents du campus via OpenAI File Search.
- Espace administrateur pour déposer, lister et supprimer les PDF (`/admin/resources`), et pour créer/supprimer des quiz (`/admin/quizzes`).
- PostgreSQL pour la production.
- Stockage persistant des PDF via volume Docker.
- Protection basique contre les rafales de requêtes sur les API.
- Endpoint `/api/health` pour vérifier la disponibilité.
- Image Docker et `docker-compose.yml` pour un déploiement sur VPS.

## Corrections apportées
- Le schéma Prisma contenait des relations invalides (`Subject` sans relation inverse vers `Quiz`, et des champs `attempts`/`chatMessages` fantômes sur `Resource`) qui auraient empêché `prisma generate`/`db push` de fonctionner. Le schéma est maintenant valide.

## Déploiement public recommandé
Cette version est préparée pour un VPS Linux avec Docker (Hetzner, OVH, DigitalOcean, etc.). Il faut un nom de domaine et HTTPS via un reverse proxy (Caddy ou Nginx).

1. Installez Docker et Docker Compose sur le serveur.
2. Copiez le projet sur le serveur.
3. Copiez `.env.example` vers `.env`.
4. Remplacez impérativement `DATABASE_URL`, `AUTH_SECRET`, `OPENAI_API_KEY` et `ADMIN_PASSWORD`.
5. Dans `docker-compose.yml`, remplacez aussi le mot de passe PostgreSQL et faites correspondre `DATABASE_URL`.
6. Lancez `docker compose up -d --build`.
7. Configurez votre domaine en HTTPS vers le port 3000.

> Pour une vraie production multi-instance, remplacez le rate limiting mémoire par Redis/Upstash et déportez les fichiers PDF vers un stockage objet (S3/R2/Supabase Storage).

## Sécurité
Ne publiez jamais le fichier `.env`, la clé OpenAI ou le mot de passe administrateur. Changez les valeurs de démonstration avant l'ouverture au public.

## Base de données
Le conteneur initialise la base avec Prisma. Pour un pipeline de production plus strict, utilisez des migrations versionnées et `prisma migrate deploy` dans la CI/CD plutôt que `db push`.

## Compte administrateur
Le compte est créé au démarrage à partir de `ADMIN_EMAIL`, `ADMIN_PASSWORD` et `ADMIN_NAME`. Aucun mot de passe administrateur réel n'est inclus dans le dépôt.
