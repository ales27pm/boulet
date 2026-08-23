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
npm run test:a11y
npm run check:links
```

The project uses Vinext and retains `.openai/hosting.json` for optional Sites deployment. Internal navigation uses `next/link`; content imagery and the responsive Boulet wordmark use `next/image`. The Worker accepts both Vinext-compatible image optimization paths (`/_next/image` and `/_vinext/image`). No database or authentication is required for the public experience, so the unused D1/Drizzle starter scaffolding has been removed.

`npm run test:a11y` scans all seven customer routes plus the opened mobile menu with axe in Playwright. `npm run check:links` performs a live GET against the centralized external destinations; `LINK_CHECK_SCOPE=first-party` or `third-party` narrows the run. First-party checks run weekly in GitHub Actions, while Instagram and Google Maps remain advisory because bot protections can return transient failures.

## Asset provenance

Product and named-project photographs are downloaded from the company's current public website for this redesign prototype and remain the site's factual proof. The separate custom guidance suite in `public/images/custom` was created with built-in Imagegen for category navigation, process explanation, quote and service preparation, and social sharing. Every generated scene is presented as inspiration or a mise en situation and is never presented as a customer project, employee, product model, or facility. The exact prompts, source IDs, allowed contexts, and provenance rules are recorded in `docs/asset-provenance/custom-assets.md`.

`public/og.png` and `public/og-v2.png` are retained earlier social-card iterations. The active `public/images/custom/og-custom-v1.jpg` combines a generated architectural backdrop with the exact supplied wordmark and deterministic typography.

The Boulet wordmark in `public/images/boulet-wordmark.jpg` was supplied by the user and is preserved byte-for-byte. The interface uses the supplied brand tokens `#1a4c9a`, `#ef1115`, and `#e7e8ea`; red is reserved for accents where normal-sized text contrast would otherwise fall below WCAG AA.
