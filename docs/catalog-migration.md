# Migration du catalogue Boulet

## Portée de la capture

Cet inventaire statique a été capturé le **23 août 2026** depuis le catalogue public de Portes et Fenêtres Boulet. Il couvre toutes les fiches produit accessibles depuis les paginations des quatre familles officielles au moment de la capture.

| Famille | Catalogue source | Produits | Images originales |
| --- | --- | ---: | ---: |
| Fenêtres | <https://fenetresboulet.com/13-fenetres> | 11 | 57 |
| Portes d’entrée et vitres de porte | <https://fenetresboulet.com/14-portes> | 33 | 300 |
| Portes patio | <https://fenetresboulet.com/15-portes-patio> | 3 | 16 |
| Portes de garage | <https://fenetresboulet.com/16-portes-de-garage> | 7 | 46 |
| **Total** |  | **54** | **419** |

Le catalogue de portes d’entrée regroupe 14 portes d’acier et 19 vitres de porte. La navigation officielle « Serrures » redirigeait vers les portes d’acier pendant la capture; aucune fiche de serrure distincte et accessible n’a donc été intégrée.

## Données produites

[`app/catalog-data.ts`](../app/catalog-data.ts) expose :

- `CatalogFamilyId` et les interfaces d’intégration;
- `catalogFamilies`, avec les quatre sources officielles et leurs comptes vérifiés;
- `catalogProducts`, soit les 54 fiches statiques;
- `getCatalogProduct(slug)`;
- `getProductsByFamily(family)`.

Chaque produit conserve son identifiant PrestaShop numérique, son slug historique unique, son chemin historique, sa famille, sa sous-catégorie officielle, son nom, son résumé, les caractéristiques textuelles vérifiables, la fiche technique disponible, ses chemins d’images locaux et l’URL exacte de sa fiche source.

Les champs non vérifiables restent volontairement à `""` ou `[]`. Aucune valeur générique, aucun prix, aucune disponibilité et aucune caractéristique n’ont été déduits. Les présentations d’options construites uniquement comme tableaux ou visuels sur l’ancien site n’ont pas été aplaties dans `features`; la fiche `sourceUrl` demeure la référence pour ces contenus riches.

## Provenance des textes

Les noms, sous-catégories, résumés, caractéristiques et spécifications viennent du contenu public de chaque fiche et de son objet PrestaShop `data-product` au moment de la capture :

- `summary` est le texte nettoyé de `description_short`, avec la métadonnée Open Graph officielle comme repli;
- `features` ne contient que les éléments textuels explicitement listés sous « Description » ou « Caractéristiques et avantages »;
- `specs` reprend uniquement les paires nom/valeur de la fiche technique officielle;
- `imageAlt` reprend la légende officielle de l’image principale; il reste vide lorsque la source n’en fournit pas.

Les contenus ont été normalisés en texte brut pour l’affichage, sans reformulation commerciale. `sourceUrl` doit rester visible ou traçable dans tout futur outil de révision du catalogue.

## Provenance des images

Les 419 fichiers sous `source-assets/catalog/` sont des téléchargements **octet pour octet** des originaux publics de PrestaShop, pour un total de **78 175 013 octets** : 363 JPEG et 56 PNG. Aucune génération, retouche, conversion, compression ou mise à l’échelle n’a été appliquée. Ils restent dans le dépôt pour la preuve et la régénération, mais sont exclus du paquet public.

La convention locale est :

```text
source-assets/catalog/<famille>/<slug-historique>/<id-image>-<nom-source>.<jpg|png>
```

Chaque image provient de l’endpoint original officiel correspondant. Certains endpoints suffixés `.jpg` servent en réalité des octets PNG; l’extension locale reflète le type de fichier détecté, sans modifier les octets :

```text
https://fenetresboulet.com/img/p/<chiffres-de-id-image>/<id-image>.jpg
```

Exemple : l’image `521` provient de `https://fenetresboulet.com/img/p/5/2/1/521.jpg`.

Cette copie locale sert de preuve visuelle et de base de migration. Elle ne modifie pas la propriété intellectuelle des images; la publication définitive doit rester autorisée par Portes et Fenêtres Boulet.

## Contraintes de migration

1. Préserver chaque `legacyPath` avec une page équivalente ou une redirection permanente vers le nouveau `slug`.
2. Ne pas transformer `summary`, `features` ou `specs` en promesses contractuelles sans validation métier actuelle.
3. Revalider la disponibilité, les normes, les performances, les couleurs et les garanties avant toute mise en production : l’inventaire reflète uniquement la capture du 23 août 2026.
4. Conserver les fichiers originaux; générer séparément les variantes WebP/AVIF de livraison si une optimisation est ajoutée.
5. Réexécuter un crawl différentiel avant la bascule du domaine afin d’identifier les produits ajoutés, retirés ou modifiés après la capture.

## Limites connues

- Le catalogue public n’expose pas de prix de vente exploitables pour ces fiches.
- Les avis, formulaires d’avis et états de stock n’ont pas été migrés.
- Les options intégrées uniquement dans des tableaux, images ou documents ne sont pas converties en données structurées.
- Cette capture ne remplace pas une validation commerciale, technique, juridique ou de disponibilité par l’équipe Boulet.
