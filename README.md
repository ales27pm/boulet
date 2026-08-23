# Portes et Fenêtres Boulet — redesign

Refonte éditoriale et responsive du parcours public Boulet, fondée sur les contenus et photographies officiels vérifiés sur `fenetresboulet.com` jusqu’au 23 août 2026.

## Experience

- `/` — offer, proof, process, product families, projects, and conversion
- `/produits` — comparateur et recherche dans 54 fiches locales
- `/produits/[family]` et `/produits/[family]/[slug]` — 4 familles et 54 fiches détaillées
- `/realisations` et `/realisations/[slug]` — galerie officielle complète et 11 projets identifiés
- `/conseils`, `/guides`, `/faq`, `/blogue`, `/subventions` — aide au choix et ressources
- `/entreprise`, `/equipe`, `/carrieres`, `/contact`, `/visite-virtuelle` — entreprise et contacts
- `/garantie`, `/confidentialite`, `/vente-entrepot`, `/credits` — parcours spécialisés
- `/soumission` et `/service` — formulaires natifs, fermés par défaut jusqu’à l’activation opérationnelle
- `/admin/demandes` — file privée, authentifiée et fermée par défaut

Les formulaires natifs exigent D1 et R2 privés, Turnstile, une liste administrative explicite et le coupe-circuit `BOULET_INTAKE_ENABLED=true`; sans cette configuration complète, l’interface et l’API refusent la collecte. Leur ouverture publique demeure conditionnelle aux décisions opérationnelles décrites dans [`docs/native-intake-operations.md`](docs/native-intake-operations.md). Le téléphone et le courriel demeurent les parcours de repli afin de ne pas créer de boucle vers les anciennes routes du même domaine.

## Development

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
npm run lint
npm test
npm run test:intake
npm run test:a11y
npm run check:links
npm run assets:catalog:check
```

Le projet utilise Vinext et conserve `.openai/hosting.json` pour Sites. La navigation interne utilise `next/link`; les images de contenu utilisent `next/image`. Le mot-symbole Boulet emploie un WebP statique de 480 px afin de ne pas dépendre d’un optimiseur dynamique. Les URL `/media/images/*.webp` passent par le Worker, qui lit les octets correspondants sous `/images/` et impose le type `image/webp`; ce détour compense les métadonnées MIME génériques du stockage Sites. Le Worker accepte aussi les deux chemins d’optimisation Vinext (`/_next/image` et `/_vinext/image`) lorsque le binding est disponible.

Les migrations D1 sont livrées sous `drizzle/`; les fichiers sont écrits dans le binding R2 privé `UPLOADS`. Les mutations exigent une origine identique, une clé d’idempotence, un délai antirobot, un jeton Turnstile vérifié côté serveur et passent par des limitations distinctes de création et de transfert. Les images sont transférées une par une, validées par signature binaire et gardées privées. Les PDF sont refusés jusqu’à l’activation d’une analyse antimalware. `npm run test:intake` rejoue le vrai parcours dans workerd avec des bindings D1 et R2 isolés.

`npm run test:a11y` exécute axe avec Playwright. `npm run check:links` vérifie les destinations externes centralisées; `LINK_CHECK_SCOPE=first-party` ou `third-party` limite la portée. Les destinations sociales et cartographiques restent consultatives, car leurs protections antibot peuvent répondre de façon transitoire.

## Asset provenance

Les 419 images de catalogue officielles sont conservées octet pour octet sous `source-assets/catalog/`, hors du paquet public. Le script `npm run assets:catalog` génère 838 variantes WebP de livraison, en 720 et 1440 px, sous `public/images/catalog-delivery/`; `--check` refuse toute sortie manquante, invalide ou obsolète. L’inventaire, les limites et la provenance sont décrits dans [`docs/catalog-migration.md`](docs/catalog-migration.md).

Les photographies de produits et de projets nommés proviennent du site public de l’entreprise et servent de preuve factuelle. La suite d’illustrations séparée sous `public/images/custom` sert uniquement à la navigation, à l’explication du processus, à la préparation des demandes et au partage social. Chaque scène est présentée comme inspiration ou mise en situation, jamais comme projet client, employé, modèle de produit ou installation réelle. Les sources et règles de provenance internes sont conservées dans `docs/asset-provenance/custom-assets.md`.

Les copies PDF locales de la garantie, de la politique et des mentions légales, avec leurs sources et empreintes, sont inventoriées dans [`docs/legacy-document-snapshots.md`](docs/legacy-document-snapshots.md).

`public/og.png` and `public/og-v2.png` are retained earlier social-card iterations. The active `public/images/custom/og-custom-v1.jpg` combines a generated architectural backdrop with the exact supplied wordmark and deterministic typography.

The Boulet wordmark in `public/images/boulet-wordmark.jpg` was supplied by the user and is preserved byte-for-byte. `public/images/boulet-wordmark-480.webp` is its delivery derivative for the interface. The interface uses the supplied brand tokens `#1a4c9a`, `#ef1115`, and `#e7e8ea`; red is reserved for accents where normal-sized text contrast would otherwise fall below WCAG AA.
