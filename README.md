# Portes et Fenêtres Boulet — redesign

An editorial, responsive redesign of the public Boulet marketing journey. The site is a clean-room implementation based on public company information and product photography observed on `fenetresboulet.com` on 2026-08-20.

## Experience

- `/` — offer, proof, process, product families, projects, and conversion
- `/produits` — decision-oriented product overview and window styles
- `/realisations` — representative project gallery
- `/conseils` — practical buying guidance and FAQ
- `/entreprise` — company history, local manufacturing, and warranty summary
- `/soumission` — preparation checklist with a clearly labelled handoff to the official live quote form
- `/service` — after-sales preparation and direct-contact options

The prototype does not collect personal information. Quote and after-sales actions deliberately hand off to the company's existing official forms.

## Development

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
npm run lint
npm test
```

The project uses vinext and retains `.openai/hosting.json` for optional Sites deployment. No database or authentication is required for the public experience.

## Asset provenance

Product and project photographs are downloaded from the company's current public website for this redesign prototype. `public/og.png` is the first AI-generated social preview. `public/og-v2.png` is a non-destructive second iteration made with built-in Imagegen from that preview and the exact supplied wordmark; neither card is presented as a documented customer project.

The Boulet wordmark in `public/images/boulet-wordmark.jpg` was supplied by the user and is preserved byte-for-byte. The interface uses the supplied brand tokens `#1a4c9a`, `#ef1115`, and `#e7e8ea`; red is reserved for accents where normal-sized text contrast would otherwise fall below WCAG AA.
