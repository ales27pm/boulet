# Système visuel des images

Ce document fixe le langage commun des images publiques Boulet. Il sépare clairement l’identité, les photographies documentaires et les scènes d’inspiration afin que l’ensemble demeure cohérent sans transformer une illustration en preuve de produit ou de réalisation.

## Direction commune

- lumière naturelle diffuse, proche d’un jour québécois neutre;
- blancs et gris pierre équilibrés, noirs lisibles et saturation contenue;
- contraste naturel, sans rendu HDR ni dominante turquoise-orange;
- verticales architecturales droites;
- bleu `#1a4c9a` et rouge `#ef1115` employés dans l’interface et en accents discrets;
- bordure bleue légère, surface gris pâle et filet de légende bleu ou rouge selon le rôle de l’image.

Les images ne reçoivent aucun filtre CSS global. Un filtre modifierait aussi les couleurs factuelles des portes, fenêtres, vitrages et finis du catalogue.

## Identité

Le master `public/images/boulet-wordmark.jpg` est le fichier fourni. Il demeure conservé octet pour octet. Le script `npm run assets:brand` en extrait les dérivés sans redessiner la signature :

| Fichier | Dimensions | Usage |
| --- | ---: | --- |
| `public/images/brand/boulet-wordmark-color.png` | 960 × 167 | En-tête, données structurées et surfaces claires |
| `public/images/brand/boulet-wordmark-reversed.png` | 960 × 167 | Pied de page et surfaces bleues |
| `public/images/brand/boulet-symbol.png` | 512 × 512 | Icône de navigateur et icône Apple |

Les trois fichiers sont des PNG avec transparence réelle. La variante couleur reprend le bleu et le rouge de l’interface; la variante inversée remplace le bleu par du blanc et conserve le rouge. Le composant `Brand` choisit explicitement la variante afin d’éviter un rectangle mat ou un mot-symbole illisible sur fond bleu.

`npm run assets:brand:check` vérifie les dimensions, l’alpha et la concordance avec le master sans modifier les fichiers.

## Rôles et cadrages

Le rôle sémantique détermine le cadrage, jamais la largeur de l’écran :

| Rôle | Ratio d’affichage | Traitement |
| --- | ---: | --- |
| Inspiration produit | 4:5 | `cover`, sujet centré et complet dans la zone utile |
| Mise en situation / guide | 3:2 | `cover`, geste ou objet principal lisible |
| Carte de réalisation | 4:3 | `cover`, architecture et ouverture principales préservées |
| Détail de réalisation | 3:2 | `cover`, vue documentaire large |
| Produit factuel du catalogue | ratio source | `contain` sur une surface neutre, sans filtre |

Ces ratios restent identiques aux largeurs de référence 390, 820 et 1440 px. Seule la taille de la grille change. `MediaFrame` centralise les rôles `inspiration`, `guidance`, `project`, `project-detail` et `factual`; les vues spécialisées du catalogue conservent leur comportement `contain`.

## Réalisations éditoriales v2

Les trois réalisations les plus visibles possèdent un dérivé réservé à l’éditorial. Les sources officielles sous `public/images/realisations-officielles/` restent intactes.

| Dérivé public | Source officielle | Préparation |
| --- | --- | --- |
| `editorial/realisation-mes-v2.webp` | `mes-habitations.jpg` | retrait des bandes blanches avec une marge de sécurité de 13 % sur chaque bord haut et bas, niveaux, correction automatique de tonalité et preset `OpenAI Editorial Neutral` |
| `editorial/realisation-paris-freres-v2.webp` | `les-habitations-paris-freres.jpg` | retrait des bordures avec une marge de sécurité de 9 % sur chaque bord haut et bas, niveaux, correction automatique de tonalité et même preset |
| `editorial/realisation-capricor-v2.webp` | `capricor.jpg` | retrait des bandes blanches avec une marge de sécurité de 21,5 % sur chaque bord haut et bas, niveaux, correction automatique de tonalité et même preset |

Les sorties validées sont encodées en WebP qualité 86 sans retouche additionnelle par `scripts/build-cohesion-assets.mjs`. Elles sont servies par `/media/images/editorial/...`. Les anciennes copies `public/images/realisation-*.webp` ont été retirées; les photographies officielles demeurent la source documentaire.

## Illustrations et carte de partage

Les huit scènes sous `public/images/custom/` restent des images d’inspiration ou des mises en situation. Elles conservent leurs dimensions et leurs ratios d’origine, mais partagent le même passage de niveaux, de tonalité automatique et le preset éditorial neutre. Leur statut fictif ou indicatif demeure explicite dans les textes alternatifs et les légendes. Elles ne servent jamais de preuve de modèle, de client, d’employé ou de chantier.

La carte active `public/images/custom/social-card-v2.jpg` mesure 1200 × 630 px. Les métadonnées Open Graph, Twitter et les données structurées pointent toutes vers cette même version. Les anciennes cartes et leur script de construction ont été retirés afin qu’ils ne puissent pas être réintroduits par erreur dans le runtime.

Les douze masters approuvés sont conservés sous `source-assets/visual-cohesion/`, hors du paquet public. `npm run assets:cohesion` reconstruit les dérivés et `npm run assets:cohesion:check` vérifie leur identité octet pour octet sans les modifier. La provenance complète des scènes d’inspiration reste interne au dépôt dans [`asset-provenance/custom-assets.md`](asset-provenance/custom-assets.md).

## Contrôles avant publication

1. Exécuter `npm run assets:brand:check`.
2. Exécuter `npm run assets:cohesion:check`.
3. Exécuter `npm run assets:catalog:check` pour confirmer que le catalogue documentaire n’a pas dérivé.
4. Exécuter les tests HTML afin de vérifier les chemins, formats, dimensions et variantes d’identité.
5. Exécuter Playwright afin de confirmer le décodage réel, les ratios aux trois largeurs de référence et l’absence de violations d’accessibilité automatisées.
6. Inspecter visuellement l’en-tête, le pied de page, la grille des quatre familles et les réalisations avant de publier.
