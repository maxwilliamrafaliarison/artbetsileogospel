# Art Betsileo Gospel

Site officiel d'Art Betsileo Gospel (ABG), collectif gospel de jeunes de Fianarantsoa, Madagascar.

> « Mandrakizay, Izahay eto foana » — *I Tantara 16:34*

## Stack

- HTML5 statique · CSS moderne (liquid glass, backdrop-filter) · JavaScript vanilla
- Trilingue : Français · Malagasy · English
- Typographie : **Fraunces** (display) + **Inter** (corps)
- Déploiement : GitHub Pages / Vercel

## Structure

```
.
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js            ← logique, compte à rebours, formulaire
│   ├── js/translations.js    ← FR / MG / EN
│   └── images/logo.png
├── vercel.json
└── README.md
```

## Développement local

```bash
# Serveur HTTP simple
python3 -m http.server 5173
# ou
npx serve .
```

Ouvrir `http://localhost:5173`.

## Déploiement Vercel

```bash
npm i -g vercel
vercel        # premier déploiement (preview)
vercel --prod # production
```

Ou via l'interface : importer le repo GitHub sur [vercel.com/new](https://vercel.com/new).

## À remplacer / brancher

| Élément | Où | Comment |
|---|---|---|
| Vidéos YouTube | `assets/js/main.js` → `VIDEOS` | Ajouter `{ id, titleFallback, views, dateKey }` |
| Galerie photos | `assets/js/main.js` → `GALLERY` | Remplacer les URLs Unsplash par des photos ABG réelles |
| Formulaire contact | `assets/js/main.js` → `FORMSPREE_ENDPOINT` | Créer un endpoint sur [Formspree](https://formspree.io) et coller l'URL |
| Date concert | `assets/js/main.js` → `EVENT_DATE` | Modifier si besoin (actuellement 12/07/2026 19h00 GMT+3) |

## Contact

- Email : artbetsileo@gmail.com
- WhatsApp : +261 34 96 980 76
- Partenariats : Sonia ANDRINIRINA — +261 34 49 120 32
