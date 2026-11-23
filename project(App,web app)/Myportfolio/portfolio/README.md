# Portfolio — Monterose Hollen Paul

Front : Vue 3 + Vite · Back : Node.js + Express (stockage JSON, upload d'images avec multer).

## Démarrage

```bash
npm run install:all
cp server/.env.example server/.env 
npm run dev:server                    # API  → http://localhost:3000
npm run dev:client                    # site → http://localhost:5173
```

## Ajout projets

1. Cliquez sur **Admin** en bas de page, entrez votre mot de passe.
2. **＋ Ajouter un projet** : glissez-déposez l'image, remplissez titre, description, liens, technologies.
3. Glissez les cartes pour changer leur ordre ; **Modifier / Supprimer** sur chaque carte.

## Personnaliser

Nom, tagline, compétences, GitHub, LinkedIn, e-mail : objet `profile` en haut de `client/src/App.vue`.

## Production

```bash
npm run build   # compile le front dans client/dist
npm start       # Express sert l'API + le site sur le port 3000
```