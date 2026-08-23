# Fenêtres Boulet custom asset provenance

The initial suite was generated on 2026-08-21 with the built-in OpenAI Imagegen tool in one-call-per-asset mode. Eight editorial scenes remain active after the approved 2026-08-23 cohesion pass. The initial social card was retired and replaced by a separately generated v2 backdrop. The original PNGs remain in the Codex generated-images directory; the website uses optimized, versioned derivatives. Every generated scene is illustrative. None documents a Boulet product, employee, customer, facility, archive or completed project.

The official wordmark at `public/images/boulet-wordmark.jpg` was supplied by the user, not generated, and remains preserved byte-for-byte. `scripts/build-brand-assets.mjs` extracts the transparent color and reversed variants deterministically without redrawing the identity. The active color variant is composited onto the social card by `scripts/build-cohesion-assets.mjs`.

## Output inventory and disclosure policy

| Website output | Imagegen source | Role | Allowed context | Public framing |
| --- | --- | --- | --- | --- |
| `product-windows-concept-v1.webp` | `exec-c79c1ff5-2ce2-4538-9423-6d984cefb16a.png` | Product-family concept | Homepage category navigation | Image d’inspiration; no precise model or client project is represented; final dimensions, glazing, and finishes must be confirmed. |
| `product-entry-concept-v1.webp` | `exec-1e052652-16f4-4de8-912a-6de85fecafaa.png` | Product-family concept | Homepage category navigation | Same as above. |
| `product-patio-concept-v1.webp` | `exec-75826f07-3633-4056-9e09-40fa5a6fe6f2.png` | Product-family concept | Homepage category navigation | Same as above. |
| `product-garage-concept-v1.webp` | `exec-59eed7ef-ad86-4a79-b98c-762a940a0dc5.png` | Product-family concept | Homepage category navigation | Same as above. |
| `process-measure-v1.webp` | `exec-d0147054-4858-46a9-ac14-16ddf5c56950.png` | Process guidance | Homepage process explanation | Mise en situation; person and place are fictional. |
| `guide-materials-v1.webp` | `exec-acf4107e-7aeb-4638-9328-e3e6b2c6a25d.png` | Buying guidance | Advice page | Mise en situation; samples are fictional; materials, glazing, and finishes must be confirmed. |
| `service-documentation-v1.webp` | `exec-dd86bdd9-2f7d-4dfe-82d5-5acc0ef74d2d.png` | Service guidance | After-sales preparation | Mise en situation; person, place, and file are fictional; no real customer data. |
| `quote-preparation-v1.webp` | `exec-96125cb8-52c2-4bf2-b2a8-bac266071d31.png` | Quote guidance | Quote preparation | Mise en situation; person, documents, and project are fictional. |
| `og-custom-v1.jpg` — retired and removed | `exec-abc73745-13fa-47c5-b072-bcf27ae409aa.png` | Historical social-card concept | None; retained only as a provenance record | Image d’inspiration; no client project was represented. |
| `social-card-v2.jpg` | `exec-4214e338-e18f-4f60-b695-069fee8e9c48.png` | Active social-card backdrop | Open Graph, Twitter and organization metadata | Image d’inspiration; the Quebec home is fictional, no people appear and no client realization is represented. |

## Executed prompts

### Product family — windows

```text
Use case: photorealistic-natural
Asset type: homepage product-family editorial, portrait composition
Primary request: A believable editorial photograph illustrating residential windows for a Quebec homeowner, without depicting a named project or a specific branded model.
Scene/backdrop: an attainable, well-kept Quebec brick home in soft shoulder-season daylight
Subject: one clear group of matte charcoal casement windows with physically plausible frames, mullions, glazing, sill, reflections, and one subtly operable sash
Style/medium: photorealistic natural documentary architecture photography, restrained contrast, slight natural grain
Composition/framing: portrait 4:5 feel, correct verticals, representative window group held inside the central 65 percent so both tall and moderate crops remain useful; some calm masonry and pale sky
Lighting/mood: soft overcast spring light, quiet and trustworthy, not dramatic
Color palette: cool-neutral brick and glass; interface colors are not painted over the scene
Materials/textures: honest brick, aluminum, glass reflections, weathered but maintained exterior details
Constraints: no text, no logos, no watermark, no people, no claim of being a Boulet installation; technically plausible window geometry
Avoid: luxury mansion, real-estate HDR, teal-orange grade, floating window grids, impossible reflections, glowing glass, exaggerated wide-angle, perfect 3D-render finish
```

### Product family — entry door

```text
Use case: photorealistic-natural
Asset type: homepage product-family editorial, portrait composition
Primary request: A believable editorial photograph illustrating a contemporary residential steel entry door for a Quebec homeowner, without depicting a named project or branded model.
Scene/backdrop: modest, attainable Quebec brick-home entrance and practical vestibule
Subject: one matte charcoal steel entry door with a narrow vertical glazed lite, plausible frame, threshold, weatherstripping, lever hardware, and restrained adjacent masonry
Style/medium: photorealistic natural documentary residential photography, restrained contrast, slight grain
Composition/framing: portrait 4:5 feel, straight verticals, the complete door and handle inside the central 65 percent for flexible crops
Lighting/mood: soft morning daylight, warm but not staged
Color palette: neutral brick, charcoal metal, pale gray surroundings; no artificial brand-color wash
Materials/textures: honest steel, glass, masonry, brushed hardware, ordinary entry details
Constraints: no text, no logos, no watermark, no people, no claim of being a Boulet installation; technically plausible door construction
Avoid: mansion, luxury showroom, real-estate HDR, extra sidelites, impossible hinges or locks, theatrical sunbeams, perfect 3D render
```

### Product family — patio door

```text
Use case: photorealistic-natural
Asset type: homepage product-family editorial, portrait composition
Primary request: A believable editorial photograph illustrating a residential patio door for a Quebec homeowner, without depicting a named project or branded model.
Scene/backdrop: ordinary well-kept deck looking into a comfortable but modest living room
Subject: a physically plausible two-panel matte charcoal sliding patio door with one fixed panel, one sliding panel, realistic meeting rail, handle, threshold, track, glazing, and reflections
Style/medium: photorealistic natural documentary architecture photography, not a product render
Composition/framing: portrait 4:5 feel, the full door and important handle/threshold geometry inside the central 70 percent for multiple crops
Lighting/mood: diffuse late-afternoon spring light, calm and lived-in
Color palette: charcoal, natural wood, soft gray and restrained warm interior tones
Materials/textures: glass reflections, wood deck grain, masonry, realistic metal frame
Constraints: no text, no logos, no watermark, no people, no claim of being a Boulet installation
Avoid: luxury interior, altered panel count, impossible reflections, invisible track, dramatic sunset, teal-orange grade, floating diagram, glossy 3D finish
```

### Product family — garage doors

```text
Use case: photorealistic-natural
Asset type: homepage product-family editorial, portrait composition
Primary request: A believable editorial photograph illustrating residential garage doors for a Quebec homeowner, without depicting a named project or branded model.
Scene/backdrop: attainable Quebec suburban brick bungalow or split-level with a practical paved driveway and modest landscaping
Subject: two matte charcoal insulated sectional garage doors, simple horizontal panels, plausible tracks implied by construction, clean masonry openings, one restrained row of small glazing inserts
Style/medium: photorealistic natural documentary exterior photography, correct verticals, restrained contrast, slight grain
Composition/framing: portrait 4:5 feel, one complete representative door and the shared center pier held inside the central 65 percent for crop safety
Lighting/mood: soft cloudy shoulder-season daylight, credible and quiet
Color palette: charcoal, warm-neutral brick, gray driveway, natural muted greenery
Materials/textures: honest sectional panels, glass, masonry, asphalt
Constraints: no text, no logos, no watermark, no people or vehicles, no claim of being a Boulet installation
Avoid: luxury mansion, open garage, impossible door panels, cinematic wet pavement, HDR sky, floating grids, perfect 3D render
```

### Process — measuring

```text
Use case: photorealistic-natural
Asset type: website process editorial, landscape composition
Primary request: A believable documentary-style photograph showing the careful measurement stage before a residential window replacement, without depicting a real Boulet employee, customer, or project.
Scene/backdrop: inside an attainable Quebec home in soft shoulder-season daylight; ordinary painted wall and existing window trim
Subject: anonymous tradesperson shown only from shoulders down, measuring an existing window opening with a metal tape measure; blue work jacket, red carpenter pencil and a plain paper measurement sheet nearby
Style/medium: photorealistic natural editorial photography, 35–50mm documentary lens, restrained contrast, fine natural grain
Composition/framing: landscape 3:2 feel, hands and measuring action as the clear focal point, calm negative space on one side, useful at wide and card crops
Lighting/mood: soft window light, attentive, precise, reassuring
Color palette: cool neutrals with restrained Boulet blue in the jacket and a tiny red pencil accent
Materials/textures: honest painted wood trim, metal tape, paper, everyday interior surfaces
Constraints: no readable text, no logos, no watermark, no recognizable face, no branded uniform, no claim of being a Boulet employee or installation; physically plausible hand anatomy and measurement action
Avoid: staged handshake, smiling stock-photo face, fake factory, luxury interior, construction chaos, impossible tape measure, extra fingers, HDR, teal-orange grade, glossy 3D render
```

### Guide — materials

```text
Use case: photorealistic-natural
Asset type: homeowner advice editorial, landscape composition
Primary request: A calm, useful still-life photograph that helps a Quebec homeowner compare window and door finish decisions before requesting a quote.
Scene/backdrop: modest kitchen table or worktable near a window in natural overcast daylight
Subject: neatly arranged material samples including small realistic white and charcoal frame corner samples, a compact insulated-glass edge sample, a metal hardware finish sample, a plain notebook, tape measure, blue folder and red carpenter pencil
Style/medium: photorealistic natural editorial still life, quiet documentary styling, restrained contrast, slight grain
Composition/framing: landscape 3:2 feel, overhead three-quarter angle, organized but human, clear negative space, all objects technically plausible and within the central crop-safe area
Lighting/mood: soft diffuse daylight, approachable, thoughtful, unhurried
Color palette: warm paper and wood neutrals, charcoal and white samples, one restrained Boulet-blue folder and a small red pencil accent
Materials/textures: honest aluminum or vinyl frame sections, glass edge, brushed metal, paper and wood
Constraints: no readable text, no logos, no watermark, no people; illustrative selection scene only, no named product model
Avoid: mood-board collage, floating swatches, fake technical labels, luxury marble, overly perfect CGI, impossible glass construction, bright commercial showroom, teal-orange grade
```

### Service — documenting an issue

```text
Use case: photorealistic-natural
Asset type: after-sales service guidance editorial, landscape composition
Primary request: A believable photograph explaining how a homeowner can document a window service issue clearly, without showing a real customer, technician, claim, or address.
Scene/backdrop: ordinary Quebec home interior beside a residential window in soft daylight
Subject: anonymous homeowner hands holding a smartphone camera toward a clearly visible but minor window hardware or seal detail; a plain blue folder, red pencil and blank note card rest on the sill
Style/medium: photorealistic natural documentary photography, restrained contrast, fine grain, practical rather than dramatic
Composition/framing: landscape 3:2 feel, phone, window detail and documenting gesture clearly readable; face and personal information outside frame; useful at wide and card crops
Lighting/mood: calm, methodical, supportive
Color palette: cool daylight neutrals with restrained blue and red accents
Materials/textures: believable vinyl or aluminum frame, glass, rubber seal, metal latch, phone and paper
Constraints: no readable screen content, no logos, no watermark, no recognizable face, no customer data, no branded employee, no severe damage; physically plausible hands and hardware
Avoid: broken shattered glass, emergency scene, fake repair action, surveillance aesthetic, extra fingers, luxury interior, HDR, teal-orange grade, glossy CGI
```

### Quote — preparing a request

```text
Use case: photorealistic-natural
Asset type: quote-preparation guidance editorial, landscape composition
Primary request: A believable documentary-style photograph showing a Quebec homeowner calmly preparing the useful information for a window and door quote, without depicting any real person, address, project, or company record.
Scene/backdrop: modest dining table near a residential window in soft shoulder-season daylight
Subject: anonymous hands organizing a plain house sketch, tape measure, smartphone with an intentionally blank neutral screen, a few unlabeled printed reference photos, a blue folder and red carpenter pencil; no face in frame
Style/medium: photorealistic natural editorial photography, 35–50mm documentary lens, restrained contrast, fine grain
Composition/framing: landscape 3:2 feel, overhead three-quarter angle, the preparation action is clear, generous calm negative space, useful for wide and card crops
Lighting/mood: soft diffuse daylight, capable, reassuring, unhurried
Color palette: warm neutral paper and wood, cool window light, restrained Boulet-blue folder and small red pencil accent
Materials/textures: everyday wood table, matte paper, metal tape measure, unbranded phone
Constraints: no readable text, no logos, no watermark, no recognizable face, no personal information, no claim of being a real customer; physically plausible hands and objects
Avoid: sales meeting, handshake, smiling stock-photo family, financial paperwork, luxury home, extra fingers, illegible AI text, HDR, teal-orange grade, glossy CGI
```

### Retired social card v1 — architectural backdrop

```text
Use case: photorealistic-natural
Asset type: website social sharing card background, wide 1200 by 630 composition
Primary request: A distinctive, believable architectural editorial background for Fenêtres Boulet that communicates windows, doors, local Quebec homes, clarity, and trust without depicting a named project or branded product.
Scene/backdrop: attainable Quebec brick home exterior in soft overcast shoulder-season daylight, seen close enough to appreciate a charcoal window and entry-door composition
Subject: one technically plausible charcoal residential window group and one simple charcoal entry door integrated into honest light brick; subtle glimpse of lived-in warmth through glass but no people
Style/medium: photorealistic natural architecture photography with restrained editorial polish, correct verticals, fine grain, no dramatic HDR
Composition/framing: true wide social-card layout; architecture occupies the right 58 percent; the left 42 percent is calm pale masonry or softly graded neutral negative space reserved for an exact logo and short headline added later; all important subjects within crop-safe margins
Lighting/mood: soft Quebec daylight, composed, dependable, warm but not sentimental
Color palette: pale warm gray brick, charcoal frames, quiet cool reflections; no painted brand graphics in the scene
Materials/textures: real brick, glass, powder-coated metal, subtle wood interior details
Constraints: absolutely no text, no letters, no logos, no watermark, no people, no claim of being a Boulet installation; technically plausible openings, frames, hardware and reflections
Avoid: luxury mansion, hero family, CGI perfection, floating window grids, fake signage, impossible geometry, glowing glass, teal-orange grade, clutter in the left negative-space area
```

### Social card v2 — cohesive architectural backdrop

Generated on 2026-08-23. The internal Imagegen source is `/home/ales27pm/.codex/generated_images/01a021c8-f02b-76a1-9aac-35a4c604e46d/exec-4214e338-e18f-4f60-b695-069fee8e9c48.png`.

```text
Create a photorealistic editorial architectural image for the social sharing card of a Quebec doors and windows manufacturer. Wide 1.91:1 composition intended for 1200x630. A contemporary but believable detached Quebec home in late winter or very early spring, viewed from a natural eye-level three-quarter angle. Crisp black-framed windows, charcoal entry door, restrained warm brick, local stone and natural wood, soft diffuse overcast daylight around neutral 5200K, realistic snow remnants and damp ground, natural interior warmth visible through a few windows. Keep the left 42 percent calmer with generous architectural negative space for a later brand lockup, while the main house mass sits toward the right. Very restrained accents inspired by #1a4c9a blue and #ef1115 red, appearing only as tiny plausible objects. Natural documentary/editorial photography, straight verticals, moderate contrast, contained saturation, subtle grain, consistent sharpness. No people, no vehicles, no text, no letters, no logos, no signs, no watermark, no HDR, no glossy CGI, no surreal geometry, no luxury mansion cliché.
```

## Production transforms

### Historical v1 delivery

The retired `scripts/build-custom-assets.mjs` converted the eight editorial PNG masters to WebP at quality 84 and created the old social card. That script and `og-custom-v1.jpg` have been removed so they cannot overwrite or be mistaken for the active visual direction. This section remains only as the audit trail for the initial outputs and prompts.

### Cohesion pass — 2026-08-23

The eight active v1 WebP scenes were rebuilt in place from their preserved Imagegen masters. Each source received Adobe levels, automatic tone and the exact `OpenAI Editorial Neutral` preset. Their native dimensions and aspect ratios were preserved, then the approved outputs were encoded as WebP quality 84. This changes the shared grade, not the depicted scene or its factual status.

The v2 social backdrop received Adobe automatic tone and the same `OpenAI Editorial Neutral` preset, then was resized to 1200×630. A deterministic Sharp composition adds the official transparent wordmark, brand panel and typography. The visible disclosure reads `IMAGE D’INSPIRATION · AUCUNE RÉALISATION CLIENT`. The resulting `social-card-v2.jpg` is the only social card referenced by the runtime.

`scripts/build-cohesion-assets.mjs` is the active delivery pipeline. Its twelve approved masters are preserved under `source-assets/visual-cohesion/`: three official-project derivatives, the eight preserved marketing scenes and the v2 social backdrop. It encodes project derivatives as WebP quality 86, marketing scenes as WebP quality 84 and the final social card as a 1200×630 progressive JPEG. `--check` reconstructs every output in memory and verifies it byte for byte. The pipeline never modifies the official project photographs or Imagegen masters in place.
