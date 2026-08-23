/**
 * Static catalogue inventory captured from the live Boulet catalogue on 2026-08-23.
 *
 * Product copy and taxonomy remain attributable to each product's sourceUrl.
 * Gallery files are byte-for-byte downloads of the official original product images.
 * See docs/catalog-migration.md for provenance and migration constraints.
 */

export type CatalogFamilyId =
  | "fenetres"
  | "portes-entree"
  | "portes-patio"
  | "portes-garage";

export interface CatalogSpecification {
  readonly label: string;
  readonly value: string;
}

export interface CatalogProduct {
  readonly id: number;
  readonly slug: string;
  readonly legacyPath: string;
  readonly family: CatalogFamilyId;
  readonly subcategory: string;
  readonly name: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly gallery: readonly string[];
  readonly summary: string;
  readonly features: readonly string[];
  readonly specs: readonly CatalogSpecification[];
  readonly sourceUrl: string;
}

export interface CatalogFamily {
  readonly id: CatalogFamilyId;
  readonly label: string;
  readonly sourceUrl: string;
  readonly productCount: number;
}

export const catalogCapturedAt = "2026-08-23" as const;

export const catalogFamilies = [
  {
    id: "fenetres",
    label: "Fenêtres",
    sourceUrl: "https://fenetresboulet.com/13-fenetres",
    productCount: 11,
  },
  {
    id: "portes-entree",
    label: "Portes d’entrée",
    sourceUrl: "https://fenetresboulet.com/14-portes",
    productCount: 33,
  },
  {
    id: "portes-patio",
    label: "Portes patio",
    sourceUrl: "https://fenetresboulet.com/15-portes-patio",
    productCount: 3,
  },
  {
    id: "portes-garage",
    label: "Portes de garage",
    sourceUrl: "https://fenetresboulet.com/16-portes-de-garage",
    productCount: 7,
  },
] as const satisfies readonly CatalogFamily[];

export const catalogProducts = [
  {
    "id": 68,
    "slug": "68-auvent-echo-pvc",
    "legacyPath": "/auvent/68-auvent-echo-pvc.html",
    "family": "fenetres",
    "subcategory": "Auvent",
    "name": "Auvent echo PVC",
    "image": "/images/catalog/fenetres/68-auvent-echo-pvc/478-auvent-echo-pvc.png",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Auvent PVC - 1",
    "gallery": [
      "/images/catalog/fenetres/68-auvent-echo-pvc/478-auvent-echo-pvc.png",
      "/images/catalog/fenetres/68-auvent-echo-pvc/479-auvent-echo-pvc.png",
      "/images/catalog/fenetres/68-auvent-echo-pvc/480-auvent-echo-pvc.png",
      "/images/catalog/fenetres/68-auvent-echo-pvc/481-auvent-echo-pvc.png",
      "/images/catalog/fenetres/68-auvent-echo-pvc/482-auvent-echo-pvc.png",
      "/images/catalog/fenetres/68-auvent-echo-pvc/483-auvent-echo-pvc.png"
    ],
    "summary": "Auvent Echo tout PVC thermos double ou thermos triple. Protège des rigueurs de l’hiver et des grandes chaleurs. Rencontre des normes de fabrication élevées, allie robustesse et durabilité",
    "features": [
      "Profilé mince pour une meilleure visibilité",
      "Profilé de base 4 3/4\"",
      "Double coupe-froid ballon + coupe-brise",
      "Thermos intercalaire techno noir",
      "Mécanisme ultra robuste et pentures ajustables",
      "Barrure multipoint",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 10 7/8\"",
      "Meneau central en bois recouvert de PVC pour renfort",
      "Moustiquaire à pression (aluminium rigide)"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Tout-PVC"
      },
      {
        "label": "Fonction",
        "value": "Auvent"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/auvent/68-auvent-echo-pvc.html"
  },
  {
    "id": 69,
    "slug": "69-auvent-echo-pvcalu",
    "legacyPath": "/auvent/69-auvent-echo-pvcalu.html",
    "family": "fenetres",
    "subcategory": "Auvent",
    "name": "Auvent echo PVC/ALU.",
    "image": "/images/catalog/fenetres/69-auvent-echo-pvcalu/484-auvent-echo-pvcalu.png",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Auvent Hybride PVC / Aluminium - 1",
    "gallery": [
      "/images/catalog/fenetres/69-auvent-echo-pvcalu/484-auvent-echo-pvcalu.png"
    ],
    "summary": "Fenêtre manivelle à auvent Echo PVC/ALU avec thermos double ou triple. Plusieurs choix de couleurs",
    "features": [
      "Profilé mince (pour meilleure visibilité) pour une épaisseur totale de 6\"",
      "Profilé de base 4 3/4\" + 1 1/4\" d’aluminium pour une épaisseur totale de 6\"",
      "Double coupe-froid ballon + 1 coupe-brise",
      "Mécanisme ultra-robuste et pentures ajustables",
      "Thermos intercalaire techno noir",
      "Barrure multipoint",
      "Grand choix de couleurs d'aluminium",
      "Épaisseur de la boîte jusqu’à 12 1/8”",
      "Boîte intérieure 1” recouverte",
      "PVC pour renfort",
      "Meneau central en bois recouvert",
      "Moustiquaire à pression"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Hybride (PVC / Aluminium)"
      },
      {
        "label": "Fonction",
        "value": "Auvent"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/auvent/69-auvent-echo-pvcalu.html"
  },
  {
    "id": 57,
    "slug": "57-battant-echo-pvc",
    "legacyPath": "/battant-manivelle/57-battant-echo-pvc.html",
    "family": "fenetres",
    "subcategory": "Battant (manivelle)",
    "name": "Battant echo PVC",
    "image": "/images/catalog/fenetres/57-battant-echo-pvc/421-battant-echo-pvc.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre à battant PVC - 1",
    "gallery": [
      "/images/catalog/fenetres/57-battant-echo-pvc/421-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/422-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/423-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/424-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/425-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/426-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/427-battant-echo-pvc.jpg",
      "/images/catalog/fenetres/57-battant-echo-pvc/428-battant-echo-pvc.jpg"
    ],
    "summary": "Fenêtre manivelle à battant Echo tout PVC, robuste, durable, éco-énergétique et abordable. Grace à sa conception unique, la gamme de fenêtres Echo est disponible autant en verre double qu'en verre triple.",
    "features": [
      "La fenêtre à battants est dotée d’un système de coupe-froid triple. Elle est première sur le marché pour son étanchéité.",
      "Son cadre modulaire de nouvelle génération comporte trois coupe-froid pour éliminer tout risque d’infiltration d’air et d’eau.",
      "Son assemblage monocoque, rendu possible grâce à un meneau central en bois recouvert de PVC, assure à cette fenêtre dont le concept est unique à Boulet solidité à toute épreuve et stabilité en toute saison.",
      "Une quincaillerie haut de gamme, un système de barrure multipoint et des crochets en acier rendent cette fenêtre très sécuritaire.",
      "Profilé mince pour une meilleure visibilité",
      "Profilé de base 4 3/4\"",
      "Double coupe-froid ballon + coupe-brise",
      "Thermos intercalaire techno noir",
      "Mécanisme ultra robuste et pentures ajustables",
      "Barrure multipoint",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 10 7/8\"",
      "Meneau central en bois recouvert de PVC pour renfort",
      "Moustiquaire à pression (aluminium rigide)"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Tout-PVC"
      },
      {
        "label": "Fonction",
        "value": "Battant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/battant-manivelle/57-battant-echo-pvc.html"
  },
  {
    "id": 59,
    "slug": "59-battant-echo-pvcalu",
    "legacyPath": "/battant-manivelle/59-battant-echo-pvcalu.html",
    "family": "fenetres",
    "subcategory": "Battant (manivelle)",
    "name": "Battant echo PVC/ALU.",
    "image": "/images/catalog/fenetres/59-battant-echo-pvcalu/429-battant-echo-pvcalu.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre à battant Hybride PVC / Aluminium Classique - 1",
    "gallery": [
      "/images/catalog/fenetres/59-battant-echo-pvcalu/429-battant-echo-pvcalu.jpg",
      "/images/catalog/fenetres/59-battant-echo-pvcalu/430-battant-echo-pvcalu.jpg",
      "/images/catalog/fenetres/59-battant-echo-pvcalu/431-battant-echo-pvcalu.jpg",
      "/images/catalog/fenetres/59-battant-echo-pvcalu/432-battant-echo-pvcalu.jpg"
    ],
    "summary": "Fenêtre manivelle à battant Echo hybride PVC / ALUMINIUM. Robuste, durable, éco-énergétique et abordable. Offert dans plusieurs couleurs standards.Vient avec le thermos double ou encore le thermos triple.",
    "features": [
      "La fenêtre à battants est dotée d’un système de coupe-froid triple. Elle est première sur le marché pour son étanchéité.",
      "Son cadre modulaire de nouvelle génération comporte trois coupe-froid pour éliminer tout risque d’infiltration d’air et d’eau.",
      "Son assemblage monocoque, rendu possible grâce à un meneau central en bois recouvert de PVC, assure à cette fenêtre dont le concept est unique à Boulet solidité à toute épreuve et stabilité en toute saison.",
      "Une quincaillerie haut de gamme, un système de barrure multipoint et des crochets en acier rendent cette fenêtre très sécuritaire.",
      "Profilé mince pour une meilleure visibilité",
      "Profilé de base 4 3/4\" + 1 1/4\" d’aluminium pour une épaisseur totale de 6\"",
      "Double coupe-froid ballon + coupe-brise",
      "Thermos intercalaire techno noir",
      "Mécanisme ultra robuste et pentures ajustables",
      "Barrure multipoint",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 12 1/8\"",
      "Meneau central en bois recouvert de PVC pour renfort",
      "Moustiquaire à pression (aluminium rigide)"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Hybride (PVC / Aluminium)"
      },
      {
        "label": "Fonction",
        "value": "Battant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/battant-manivelle/59-battant-echo-pvcalu.html"
  },
  {
    "id": 83,
    "slug": "83-battant-echo-pvcalu-contemporain",
    "legacyPath": "/battant-manivelle/83-battant-echo-pvcalu-contemporain.html",
    "family": "fenetres",
    "subcategory": "Battant (manivelle)",
    "name": "Battant echo PVC/ALU. contemporain",
    "image": "/images/catalog/fenetres/83-battant-echo-pvcalu-contemporain/521-battant-echo-pvcalu-contemporain.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre à battant hybride contemporaine",
    "gallery": [
      "/images/catalog/fenetres/83-battant-echo-pvcalu-contemporain/521-battant-echo-pvcalu-contemporain.jpg",
      "/images/catalog/fenetres/83-battant-echo-pvcalu-contemporain/522-battant-echo-pvcalu-contemporain.jpg"
    ],
    "summary": "Une nouvelle gamme de fenêtres qui donne une touche moderne et créative à votre maison avec le thermos double ou encore avec le thermos triple.",
    "features": [
      "La fenêtre à battants est dotée d’un système de coupe-froid triple. Elle est première sur le marché pour son étanchéité.",
      "Son cadre modulaire de nouvelle génération comporte trois coupe-froid pour éliminer tout risque d’infiltration d’air et d’eau.",
      "Son assemblage monocoque, rendu possible grâce à un meneau central en bois recouvert de PVC, assure à cette fenêtre dont le concept est unique à Boulet solidité à toute épreuve et stabilité en toute saison.",
      "Une quincaillerie haut de gamme, un système de barrure multipoint et des crochets en acier rendent cette fenêtre très sécuritaire.",
      "Profilé mince pour une meilleure visibilité",
      "Profilé de base 4 3/4\" + 1 1/4\" d’aluminium pour une épaisseur totale de 6\"",
      "Double coupe-froid ballon + coupe-brise",
      "Thermos intercalaire techno noir",
      "Mécanisme ultra robuste et pentures ajustables",
      "Barrure multipoint",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 12 1/8\"",
      "Meneau central en bois recouvert de PVC pour renfort",
      "Moustiquaire à pression (aluminium rigide)"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Hybride (PVC / Aluminium)"
      },
      {
        "label": "Fonction",
        "value": "Battant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/battant-manivelle/83-battant-echo-pvcalu-contemporain.html"
  },
  {
    "id": 79,
    "slug": "79-coupe-echo-pvc-triple-verre",
    "legacyPath": "/battant-manivelle/79-coupe-echo-pvc-triple-verre.html",
    "family": "fenetres",
    "subcategory": "Battant (manivelle)",
    "name": "Coupe echo PVC triple verre",
    "image": "/images/catalog/fenetres/79-coupe-echo-pvc-triple-verre/598-coupe-echo-pvc-triple-verre.jpg",
    "imageAlt": "",
    "gallery": [
      "/images/catalog/fenetres/79-coupe-echo-pvc-triple-verre/598-coupe-echo-pvc-triple-verre.jpg"
    ],
    "summary": "La fenêtre à battant Echo tout PVC ou PVC/ALU est la plus performante aux plans énergétique et de l’insonorisation avec son triple verre.",
    "features": [
      "Aspect contemporain",
      "Profilé de base 4 3/4\" ou 6\"",
      "Double coupe-froid ballon",
      "Épaisseur de la boîte jusqu’à 10 7/8” max 12 1/8\"",
      "Meneau central en bois recouvert de PVC pour renforts",
      "Mécanisme ultra robuste et pentures ajustables",
      "Boîte intérieure 1” recouverte",
      "Thermos intercalaire techno noir",
      "Moustiquaire à pression",
      "Barrure multipoint",
      "Cadre nouvelle génération",
      "Opérateur à manivelle",
      "Barrure multi-points"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Tout-PVC"
      },
      {
        "label": "Fonction",
        "value": "Battant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/battant-manivelle/79-coupe-echo-pvc-triple-verre.html"
  },
  {
    "id": 63,
    "slug": "63-coulissant-echo-pvc-double",
    "legacyPath": "/coulissant/63-coulissant-echo-pvc-double.html",
    "family": "fenetres",
    "subcategory": "Coulissant",
    "name": "Coulissant echo PVC double",
    "image": "/images/catalog/fenetres/63-coulissant-echo-pvc-double/444-coulissant-echo-pvc-double.png",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Coulissante PVC Double Action - 1",
    "gallery": [
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/444-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/445-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/446-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/447-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/448-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/449-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/450-coulissant-echo-pvc-double.png",
      "/images/catalog/fenetres/63-coulissant-echo-pvc-double/451-coulissant-echo-pvc-double.png"
    ],
    "summary": "La coulissante double action Echo PVC également PVC/ALU. vient soit avec le thermos double ou encore le thermos triple. Ses volets ouvrants et amovibles facilitent l’entretien.",
    "features": [
      "Aspect contemporain",
      "Profilé de base 4 3/4\" a 6\"",
      "Volet ouvrant pivotant (pour faciliter l’entretien)",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de la boîte jusqu’à 10 7/8” maximum 12 1/8\"",
      "Thermos intercalaire techno noir",
      "Volets amovibles pour la double action"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Tout-PVC"
      },
      {
        "label": "Fonction",
        "value": "Coulissant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/coulissant/63-coulissant-echo-pvc-double.html"
  },
  {
    "id": 60,
    "slug": "60-coulissant-echo-pvc-simple",
    "legacyPath": "/coulissant/60-coulissant-echo-pvc-simple.html",
    "family": "fenetres",
    "subcategory": "Coulissant",
    "name": "Coulissant echo PVC simple",
    "image": "/images/catalog/fenetres/60-coulissant-echo-pvc-simple/433-coulissant-echo-pvc-simple.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Coulissante PVC Simple Action - 3",
    "gallery": [
      "/images/catalog/fenetres/60-coulissant-echo-pvc-simple/433-coulissant-echo-pvc-simple.jpg",
      "/images/catalog/fenetres/60-coulissant-echo-pvc-simple/434-coulissant-echo-pvc-simple.jpg",
      "/images/catalog/fenetres/60-coulissant-echo-pvc-simple/435-coulissant-echo-pvc-simple.jpg",
      "/images/catalog/fenetres/60-coulissant-echo-pvc-simple/436-coulissant-echo-pvc-simple.jpg",
      "/images/catalog/fenetres/60-coulissant-echo-pvc-simple/437-coulissant-echo-pvc-simple.jpg"
    ],
    "summary": "La coulissante simple Echo PVC également PVC/ALU.vient soit avec le thermos double ou encore le thermos triple. Son volet ouvrant et pivotant facilite l’entretien.",
    "features": [
      "Aspect contemporain",
      "Profilé de base 4 3/4\" a 6\"",
      "Volet ouvrant pivotant (pour faciliter l’entretien)",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de la boîte jusqu’à 10 7/8” maximum 12 1/8\"",
      "Thermos intercalaire techno noir",
      "Volets amovibles pour la double action"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Tout-PVC"
      },
      {
        "label": "Fonction",
        "value": "Coulissant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/coulissant/60-coulissant-echo-pvc-simple.html"
  },
  {
    "id": 64,
    "slug": "64-coulissant-echo-pvcaludouble-",
    "legacyPath": "/coulissant/64-coulissant-echo-pvcaludouble-.html",
    "family": "fenetres",
    "subcategory": "Coulissant",
    "name": "Coulissant echo PVC/Alu.double",
    "image": "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/452-coulissant-echo-pvcaludouble-.png",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Coulissante Hybride PVC / Aluminium Double Action - 1",
    "gallery": [
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/452-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/453-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/455-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/457-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/458-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/459-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/460-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/462-coulissant-echo-pvcaludouble-.png",
      "/images/catalog/fenetres/64-coulissant-echo-pvcaludouble-/463-coulissant-echo-pvcaludouble-.png"
    ],
    "summary": "Le coulissant double-action Echo hybride vous fait profiter de l’heureux mariage du PVC et de l’aluminium , également avec le thermos double ou encore le thermos triple. Ses volets ouvrants et amovibles facilitent l’entretien.",
    "features": [
      "Profilé de base 4 3/4\" + 1 1/4\" d’aluminium",
      "pour une épaisseur totale de 6\"",
      "Facilité d'entretien (les 2 volets se basculent)",
      "Mécanisme à roulement",
      "Moustiquaire à pression",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 12 1/8\"",
      "Thermos intercalaire techno noir",
      "Choix de couleurs d'aluminium standard"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Hybride (PVC / Aluminium)"
      },
      {
        "label": "Fonction",
        "value": "Coulissant"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/coulissant/64-coulissant-echo-pvcaludouble-.html"
  },
  {
    "id": 67,
    "slug": "67-guillotine-echo-double-action",
    "legacyPath": "/guillotine/67-guillotine-echo-double-action.html",
    "family": "fenetres",
    "subcategory": "Guillotine",
    "name": "Guillotine echo double action",
    "image": "/images/catalog/fenetres/67-guillotine-echo-double-action/466-guillotine-echo-double-action.png",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Guillotine Hybride PVC / Aluminium Double Action - 1",
    "gallery": [
      "/images/catalog/fenetres/67-guillotine-echo-double-action/466-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/467-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/468-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/469-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/470-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/471-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/472-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/473-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/474-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/475-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/476-guillotine-echo-double-action.png",
      "/images/catalog/fenetres/67-guillotine-echo-double-action/477-guillotine-echo-double-action.png"
    ],
    "summary": "La guillotine double action Echo PVC ou PVC/ALU vous fait profiter de l’heureux mariage du PVC et de l’aluminium. Possibilité du verre triple. Cette fenêtre allie performance et beauté. La fenêtre guillotine double action comporte deux volets qui se basculent pour une plus grande facilité d’entretien. Son mécanisme à poulies la rend facile d’utilisation.",
    "features": [
      "Profilé de base 4 3/4\" + 1 1/4\" d’aluminium",
      "pour une épaisseur totale de 6\"",
      "Facilité d'entretien (les 2 volets se basculent)",
      "Mécanisme à roulement et à poulies pour guillotine",
      "Moustiquaire à pression",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 12 1/8\"",
      "Thermos intercalaire techno noir",
      "Grand choix de couleurs d'aluminium"
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Hybride (PVC / Aluminium)"
      },
      {
        "label": "Fonction",
        "value": "Guillotine"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/guillotine/67-guillotine-echo-double-action.html"
  },
  {
    "id": 65,
    "slug": "65-guillotine-echo-simple-action-",
    "legacyPath": "/guillotine/65-guillotine-echo-simple-action-.html",
    "family": "fenetres",
    "subcategory": "Guillotine",
    "name": "Guillotine echo simple action",
    "image": "/images/catalog/fenetres/65-guillotine-echo-simple-action-/464-guillotine-echo-simple-action-.png",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Fenêtre Guillotine PVC Simple Action - 1",
    "gallery": [
      "/images/catalog/fenetres/65-guillotine-echo-simple-action-/464-guillotine-echo-simple-action-.png"
    ],
    "summary": "La fenêtre à guillotine Echo simple action est constituée de profilé en PVC ou PVC/ALU. également avec le thermos double ou encore le thermos triple. Le soufflage en bois recouvert de PVC lui donne une force structurale supérieure. Le cadre et le volet sont fusionnés thermiquement pour une étanchéité maximale.",
    "features": [
      "Aspect contemporain",
      "Profilé de base 4 3/4\" + alu a 6\"",
      "Meneau central en bois, recouvert PVC pour renfort (à partir de 2",
      "modules)",
      "Volet ouvrant pivotant (pour faciliter l’entretien)",
      "Boîte intérieure 1\" recouverte",
      "Épaisseur de boîte jusqu'à 10 7/8\" max 12 1/8\"",
      "Thermos intercalaire techno noir",
      "Son système de volets ouvrants pivotants facilite l'entretien."
    ],
    "specs": [
      {
        "label": "Matériel",
        "value": "Tout-PVC"
      },
      {
        "label": "Fonction",
        "value": "Guillotine"
      }
    ],
    "sourceUrl": "https://fenetresboulet.com/guillotine/65-guillotine-echo-simple-action-.html"
  },
  {
    "id": 19,
    "slug": "19-2-panneaux-haut-uni",
    "legacyPath": "/portes-d-acier/19-2-panneaux-haut-uni.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "2 panneaux haut uni",
    "image": "/images/catalog/portes-entree/19-2-panneaux-haut-uni/116-2-panneaux-haut-uni.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier 2 panneaux haut uni Novatech - 4",
    "gallery": [
      "/images/catalog/portes-entree/19-2-panneaux-haut-uni/116-2-panneaux-haut-uni.jpg",
      "/images/catalog/portes-entree/19-2-panneaux-haut-uni/117-2-panneaux-haut-uni.jpg",
      "/images/catalog/portes-entree/19-2-panneaux-haut-uni/118-2-panneaux-haut-uni.jpg",
      "/images/catalog/portes-entree/19-2-panneaux-haut-uni/119-2-panneaux-haut-uni.jpg",
      "/images/catalog/portes-entree/19-2-panneaux-haut-uni/120-2-panneaux-haut-uni.jpg"
    ],
    "summary": "Le concept de la porte 2 panneaux haut uni en fait une porte idéale pour les perçages de grande dimension. L'espace laissé libre au-dessus des panneaux permet l'ajout de grands vitrages de différentes tendances, ce qui en fait une porte très polyvalente.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/19-2-panneaux-haut-uni.html"
  },
  {
    "id": 14,
    "slug": "14-6-panneaux",
    "legacyPath": "/portes-d-acier/14-6-panneaux.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "6 panneaux",
    "image": "/images/catalog/portes-entree/14-6-panneaux/100-6-panneaux.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier 6 panneaux Novatech - 6",
    "gallery": [
      "/images/catalog/portes-entree/14-6-panneaux/100-6-panneaux.jpg",
      "/images/catalog/portes-entree/14-6-panneaux/101-6-panneaux.jpg",
      "/images/catalog/portes-entree/14-6-panneaux/95-6-panneaux.png",
      "/images/catalog/portes-entree/14-6-panneaux/96-6-panneaux.jpg",
      "/images/catalog/portes-entree/14-6-panneaux/97-6-panneaux.jpg",
      "/images/catalog/portes-entree/14-6-panneaux/98-6-panneaux.jpg",
      "/images/catalog/portes-entree/14-6-panneaux/99-6-panneaux.jpg"
    ],
    "summary": "Sa popularité incontestée en fait notre porte la plus vendue. Cette popularité vient en partie de sa configuration de panneaux permettant des perçages pour fenêtres variés: 22x9, 8x36 et 22x36, ou encore sans découpe. Son design conventionnel, tirant son origine des siècles derniers, en fait une porte pleine qui s'intègre à des architectures aux tendances classiques, éclectiques et naturelles.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/14-6-panneaux.html"
  },
  {
    "id": 3,
    "slug": "3-era",
    "legacyPath": "/portes-d-acier/3-era.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Era",
    "image": "/images/catalog/portes-entree/3-era/21-era.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Era Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/3-era/21-era.jpg",
      "/images/catalog/portes-entree/3-era/22-era.jpg",
      "/images/catalog/portes-entree/3-era/23-era.jpg",
      "/images/catalog/portes-entree/3-era/24-era.jpg",
      "/images/catalog/portes-entree/3-era/25-era.jpg",
      "/images/catalog/portes-entree/3-era/26-era.jpg",
      "/images/catalog/portes-entree/3-era/27-era.jpg",
      "/images/catalog/portes-entree/3-era/28-era.jpg"
    ],
    "summary": "Vos bungalows des années 60, on les aime ! Nous voulons les mettre en valeur et revigorer leur charme inoubliable, dans un style totalement actualisé. La nouvelle porte Era s’accorde harmonieusement aux atouts des maisons « mid-century » : simplicité, asymétrie et géométrie. Essayez la avec une couleur vibrante !",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/3-era.html"
  },
  {
    "id": 9,
    "slug": "9-linea",
    "legacyPath": "/portes-d-acier/9-linea.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Linéa",
    "image": "/images/catalog/portes-entree/9-linea/59-linea.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Linéa Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/9-linea/59-linea.jpg",
      "/images/catalog/portes-entree/9-linea/60-linea.jpg",
      "/images/catalog/portes-entree/9-linea/61-linea.jpg",
      "/images/catalog/portes-entree/9-linea/62-linea.png",
      "/images/catalog/portes-entree/9-linea/63-linea.png",
      "/images/catalog/portes-entree/9-linea/64-linea.png",
      "/images/catalog/portes-entree/9-linea/65-linea.png",
      "/images/catalog/portes-entree/9-linea/66-linea.jpg"
    ],
    "summary": "Même si elles sont magnifiques sans fenêtre, nos portes aux embosses décentrées sont conçues pour faire place à une barre de tirage ou une fenêtre de 7\" x 64\" - parfait pour créer une entrée lumineuse lorsqu'il n'y a pas d'autre fenêtre.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/9-linea.html"
  },
  {
    "id": 12,
    "slug": "12-london",
    "legacyPath": "/portes-d-acier/12-london.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "London",
    "image": "/images/catalog/portes-entree/12-london/79-london.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier London Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/12-london/79-london.jpg",
      "/images/catalog/portes-entree/12-london/80-london.jpg",
      "/images/catalog/portes-entree/12-london/81-london.jpg",
      "/images/catalog/portes-entree/12-london/82-london.jpg",
      "/images/catalog/portes-entree/12-london/83-london.jpg"
    ],
    "summary": "La porte London s’inspire d’une configuration traditionnelle qui lui confère une allure des plus nobles. Sa composition et son relief s’agencent pour lui donner un look intemporel.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/12-london.html"
  },
  {
    "id": 4,
    "slug": "4-mundo",
    "legacyPath": "/portes-d-acier/4-mundo.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Mundo",
    "image": "/images/catalog/portes-entree/4-mundo/29-mundo.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Mundo Novatech - 2",
    "gallery": [
      "/images/catalog/portes-entree/4-mundo/29-mundo.jpg",
      "/images/catalog/portes-entree/4-mundo/30-mundo.jpg",
      "/images/catalog/portes-entree/4-mundo/31-mundo.jpg",
      "/images/catalog/portes-entree/4-mundo/32-mundo.jpg"
    ],
    "summary": "La porte Mundo trouve son expression de par ses neuf lignes horizontales tout en simplicité.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/4-mundo.html"
  },
  {
    "id": 8,
    "slug": "8-orleans",
    "legacyPath": "/portes-d-acier/8-orleans.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Orléans",
    "image": "/images/catalog/portes-entree/8-orleans/51-orleans.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Orléans Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/8-orleans/51-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/52-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/53-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/54-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/55-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/56-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/57-orleans.jpg",
      "/images/catalog/portes-entree/8-orleans/58-orleans.png"
    ],
    "summary": "D’une élégance recherchée, la porte Orléans promet de faire une excellente première impression. Ce modèle procurera à votre entrée un look d’un chic sans pareil.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/8-orleans.html"
  },
  {
    "id": 11,
    "slug": "11-oso",
    "legacyPath": "/portes-d-acier/11-oso.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Oso",
    "image": "/images/catalog/portes-entree/11-oso/72-oso.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Oso Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/11-oso/72-oso.jpg",
      "/images/catalog/portes-entree/11-oso/73-oso.jpg",
      "/images/catalog/portes-entree/11-oso/74-oso.jpg",
      "/images/catalog/portes-entree/11-oso/75-oso.png",
      "/images/catalog/portes-entree/11-oso/76-oso.png",
      "/images/catalog/portes-entree/11-oso/77-oso.png",
      "/images/catalog/portes-entree/11-oso/78-oso.jpg"
    ],
    "summary": "Quatre groupes de trois lignes claires sur un verre au fini sablé qui prolongent le motif de la porte Oso. Idéal pour la conception d'entrées modernes et harmonieuses.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/11-oso.html"
  },
  {
    "id": 7,
    "slug": "7-soho",
    "legacyPath": "/portes-d-acier/7-soho.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Soho",
    "image": "/images/catalog/portes-entree/7-soho/42-soho.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Soho Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/7-soho/42-soho.jpg",
      "/images/catalog/portes-entree/7-soho/43-soho.jpg",
      "/images/catalog/portes-entree/7-soho/44-soho.jpg",
      "/images/catalog/portes-entree/7-soho/45-soho.jpg",
      "/images/catalog/portes-entree/7-soho/46-soho.jpg",
      "/images/catalog/portes-entree/7-soho/47-soho.jpg",
      "/images/catalog/portes-entree/7-soho/48-soho.jpg",
      "/images/catalog/portes-entree/7-soho/49-soho.jpg",
      "/images/catalog/portes-entree/7-soho/50-soho.jpg"
    ],
    "summary": "Le nouveau modèle de porte Soho est un incontournable. Très populaire auprès des architectures d’aujourd’hui, cette configuration 4 panneaux saura adopter un style tantôt contemporain, tantôt plus naturel.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/7-soho.html"
  },
  {
    "id": 10,
    "slug": "10-sydney",
    "legacyPath": "/portes-d-acier/10-sydney.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Sydney",
    "image": "/images/catalog/portes-entree/10-sydney/67-sydney.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Sydney Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/10-sydney/67-sydney.jpg",
      "/images/catalog/portes-entree/10-sydney/68-sydney.jpg",
      "/images/catalog/portes-entree/10-sydney/69-sydney.jpg",
      "/images/catalog/portes-entree/10-sydney/70-sydney.png",
      "/images/catalog/portes-entree/10-sydney/71-sydney.png"
    ],
    "summary": "Un modèle unique et audacieux, qui répond parfaitement à la tendance « 3 panneaux » si populaire aujourd’hui. La porte Sydney répond aux nouvelles règles établies par les architectures modernes en demande.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/10-sydney.html"
  },
  {
    "id": 2,
    "slug": "2-tao",
    "legacyPath": "/portes-d-acier/2-tao.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Tao",
    "image": "/images/catalog/portes-entree/2-tao/11-tao.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Tao Novatech - 2",
    "gallery": [
      "/images/catalog/portes-entree/2-tao/11-tao.jpg",
      "/images/catalog/portes-entree/2-tao/12-tao.jpg",
      "/images/catalog/portes-entree/2-tao/13-tao.jpg",
      "/images/catalog/portes-entree/2-tao/14-tao.jpg",
      "/images/catalog/portes-entree/2-tao/15-tao.jpg",
      "/images/catalog/portes-entree/2-tao/16-tao.jpg",
      "/images/catalog/portes-entree/2-tao/17-tao.jpg"
    ],
    "summary": "Tao signifie l'accord avec la nature. Les lignes horizontales de la porte ont été travaillées pour apporter de la souplesse et du mouvement à la surface lisse de l’acier. Ce mélange à la fois affirmé et minimaliste, l’essence même du style contemporain, résulte en une nouvelle porte à l'allure sophistiquée.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/2-tao.html"
  },
  {
    "id": 13,
    "slug": "13-uno",
    "legacyPath": "/portes-d-acier/13-uno.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Uno",
    "image": "/images/catalog/portes-entree/13-uno/84-uno.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Uno Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/13-uno/84-uno.jpg",
      "/images/catalog/portes-entree/13-uno/85-uno.jpg",
      "/images/catalog/portes-entree/13-uno/86-uno.jpg",
      "/images/catalog/portes-entree/13-uno/87-uno.jpg",
      "/images/catalog/portes-entree/13-uno/88-uno.jpg",
      "/images/catalog/portes-entree/13-uno/89-uno.jpg",
      "/images/catalog/portes-entree/13-uno/90-uno.jpg",
      "/images/catalog/portes-entree/13-uno/91-uno.jpg",
      "/images/catalog/portes-entree/13-uno/92-uno.jpg",
      "/images/catalog/portes-entree/13-uno/93-uno.jpg",
      "/images/catalog/portes-entree/13-uno/94-uno.jpg"
    ],
    "summary": "Personnalisez le design de votre porte en découvrant notre gamme de verres nouvellement rafraîchie. Faites preuve de créativité et choisissez vos textures et motifs préférés en fonction des différentes options d’ouvertures et de dimensions qui vous sont proposées.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/13-uno.html"
  },
  {
    "id": 6,
    "slug": "6-victoria-shaker",
    "legacyPath": "/portes-d-acier/6-victoria-shaker.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Victoria Shaker",
    "image": "/images/catalog/portes-entree/6-victoria-shaker/37-victoria-shaker.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Victoria Shaker Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/6-victoria-shaker/37-victoria-shaker.jpg",
      "/images/catalog/portes-entree/6-victoria-shaker/38-victoria-shaker.jpg",
      "/images/catalog/portes-entree/6-victoria-shaker/39-victoria-shaker.jpg",
      "/images/catalog/portes-entree/6-victoria-shaker/40-victoria-shaker.jpg",
      "/images/catalog/portes-entree/6-victoria-shaker/41-victoria-shaker.jpg"
    ],
    "summary": "Le nouveau modèle Victoria Shaker propose un style architectural aux influences américaines. Avec ses nouveaux reliefs, ce modèle a fière allure et promet de rehausser le charme de votre entrée sans jamais se démoder.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/6-victoria-shaker.html"
  },
  {
    "id": 5,
    "slug": "5-vog",
    "legacyPath": "/portes-d-acier/5-vog.html",
    "family": "portes-entree",
    "subcategory": "Portes d'acier",
    "name": "Vog",
    "image": "/images/catalog/portes-entree/5-vog/33-vog.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée en acier Vog - 1",
    "gallery": [
      "/images/catalog/portes-entree/5-vog/33-vog.jpg",
      "/images/catalog/portes-entree/5-vog/34-vog.jpg",
      "/images/catalog/portes-entree/5-vog/35-vog.jpg",
      "/images/catalog/portes-entree/5-vog/36-vog.jpg"
    ],
    "summary": "Traversée de lignes horizontales au relief saillant, la porte Vog offre un style à la fois simple et gracieux. Osez un fini d’une couleur flamboyante qui en fera le style emblématique de votre demeure.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-d-acier/5-vog.html"
  },
  {
    "id": 48,
    "slug": "48-azur",
    "legacyPath": "/vitres-de-porte/48-azur.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Azur",
    "image": "/images/catalog/portes-entree/48-azur/344-azur.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Azur Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/48-azur/344-azur.jpg",
      "/images/catalog/portes-entree/48-azur/345-azur.jpg",
      "/images/catalog/portes-entree/48-azur/346-azur.jpg",
      "/images/catalog/portes-entree/48-azur/347-azur.jpg",
      "/images/catalog/portes-entree/48-azur/348-azur.jpg",
      "/images/catalog/portes-entree/48-azur/349-azur.jpg",
      "/images/catalog/portes-entree/48-azur/350-azur.jpg",
      "/images/catalog/portes-entree/48-azur/351-azur.jpg",
      "/images/catalog/portes-entree/48-azur/352-azur.jpg",
      "/images/catalog/portes-entree/48-azur/353-azur.jpg",
      "/images/catalog/portes-entree/48-azur/354-azur.jpg",
      "/images/catalog/portes-entree/48-azur/355-azur.jpg",
      "/images/catalog/portes-entree/48-azur/356-azur.jpg",
      "/images/catalog/portes-entree/48-azur/357-azur.jpg",
      "/images/catalog/portes-entree/48-azur/358-azur.jpg"
    ],
    "summary": "Alliant élégance et distinction, le modèle Azur procure l’intimité désirée avec de fines ouvertures de lumière. Sa double surface imprimée crée un effet dynamique et original. Au style contemporain ou éclectique, ce verre s’adapte aussi bien aux projets de rénovation qu'à une construction neuve.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/48-azur.html"
  },
  {
    "id": 38,
    "slug": "38-bistro",
    "legacyPath": "/vitres-de-porte/38-bistro.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Bistro",
    "image": "/images/catalog/portes-entree/38-bistro/242-bistro.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Bistro Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/38-bistro/242-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/243-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/244-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/245-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/246-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/247-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/248-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/249-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/250-bistro.jpg",
      "/images/catalog/portes-entree/38-bistro/251-bistro.jpg"
    ],
    "summary": "Avec sa tête arquée et ses carreaux de verre biseauté, Bistro offre une cure de rajeunissement et un look exceptionnel aux rénovations extérieures. Un look classique et naturel à coup sûr. Conseil du designer : s’agence parfaitement au verre Chinchilla.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/38-bistro.html"
  },
  {
    "id": 37,
    "slug": "37-cachet",
    "legacyPath": "/vitres-de-porte/37-cachet.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Cachet",
    "image": "/images/catalog/portes-entree/37-cachet/225-cachet.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Cachet Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/37-cachet/225-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/226-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/227-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/228-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/229-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/230-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/231-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/232-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/233-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/234-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/235-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/236-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/237-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/238-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/239-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/240-cachet.jpg",
      "/images/catalog/portes-entree/37-cachet/241-cachet.jpg"
    ],
    "summary": "Inspiré de l’architecture de style Prairie, ce vitrail regroupe quatre verres sublimes aux textures variées. Cachet apportera une fière allure à votre demeure, en plus d’offrir un joli jeu de lumière à l’intérieur de votre entrée lors de journées ensoleillées.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/37-cachet.html"
  },
  {
    "id": 36,
    "slug": "36-celeste",
    "legacyPath": "/vitres-de-porte/36-celeste.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Céleste",
    "image": "/images/catalog/portes-entree/36-celeste/215-celeste.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Céleste Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/36-celeste/215-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/216-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/217-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/218-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/219-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/220-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/221-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/222-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/223-celeste.jpg",
      "/images/catalog/portes-entree/36-celeste/224-celeste.jpg"
    ],
    "summary": "Ce vitrail est composé d’une géométrie à la fois délicate et organisée. Sa combinaison de verres apportera un jeu de lumière rafﬁné et équilibré par sa structure de baguettes patinées.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/36-celeste.html"
  },
  {
    "id": 47,
    "slug": "47-chanelle",
    "legacyPath": "/vitres-de-porte/47-chanelle.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Chanelle",
    "image": "/images/catalog/portes-entree/47-chanelle/333-chanelle.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Chanelle Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/47-chanelle/333-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/334-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/335-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/336-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/337-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/338-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/339-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/340-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/341-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/342-chanelle.jpg",
      "/images/catalog/portes-entree/47-chanelle/343-chanelle.png"
    ],
    "summary": "D'une valeur sûre, élégante et intemporelle, le modèle Chanelle s’intègre autant aux architectures classiques qu’aux styles d’aujourd'hui. Grâce à ses lignes épurées et la brillance de son verre biseauté, ce vitrail crée de magnifiques jeux de lumière. Conseil du designer : s’agence parfaitement au verre Niagara.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/47-chanelle.html"
  },
  {
    "id": 43,
    "slug": "43-discretion",
    "legacyPath": "/vitres-de-porte/43-discretion.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Discrétion",
    "image": "/images/catalog/portes-entree/43-discretion/293-discretion.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Discrétion Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/43-discretion/293-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/294-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/295-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/296-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/297-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/298-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/299-discretion.jpg",
      "/images/catalog/portes-entree/43-discretion/300-discretion.png",
      "/images/catalog/portes-entree/43-discretion/301-discretion.png"
    ],
    "summary": "Les stores intégrés en aluminium ont depuis longtemps fait leurs preuves. Ce produit est d’une durabilité assurée et ne requiert aucun entretien. Une solution idéale pour laisser entrer la lumière du jour ou pour répondre à votre besoin d’intimité. Les stores horizontaux Novatech sont maintenant disponibles en deux couleurs afin de s'harmoniser à tous les décors.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/43-discretion.html"
  },
  {
    "id": 40,
    "slug": "40-distinction",
    "legacyPath": "/vitres-de-porte/40-distinction.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Distinction",
    "image": "/images/catalog/portes-entree/40-distinction/263-distinction.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Distinction Novatech - 2",
    "gallery": [
      "/images/catalog/portes-entree/40-distinction/263-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/264-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/265-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/266-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/267-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/268-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/269-distinction.jpg",
      "/images/catalog/portes-entree/40-distinction/270-distinction.jpg"
    ],
    "summary": "Soigneusement taillé dans le verre sablé, le modèle Distinction s'agence aux maisons ornées de fenêtres à carreaux. Les rainures apportent une touche de brillance et un éclat lumineux au verre sablé qui offre l’intimité désirée à votre entrée. Conseil du designer : S’agence parfaitement au verre sablé.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/40-distinction.html"
  },
  {
    "id": 34,
    "slug": "34-edge",
    "legacyPath": "/vitres-de-porte/34-edge.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Edge",
    "image": "/images/catalog/portes-entree/34-edge/190-edge.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Edge Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/34-edge/190-edge.jpg",
      "/images/catalog/portes-entree/34-edge/191-edge.jpg",
      "/images/catalog/portes-entree/34-edge/192-edge.jpg",
      "/images/catalog/portes-entree/34-edge/193-edge.jpg",
      "/images/catalog/portes-entree/34-edge/194-edge.jpg",
      "/images/catalog/portes-entree/34-edge/195-edge.jpg",
      "/images/catalog/portes-entree/34-edge/196-edge.jpg",
      "/images/catalog/portes-entree/34-edge/197-edge.jpg",
      "/images/catalog/portes-entree/34-edge/198-edge.jpg",
      "/images/catalog/portes-entree/34-edge/199-edge.jpg",
      "/images/catalog/portes-entree/34-edge/200-edge.jpg",
      "/images/catalog/portes-entree/34-edge/201-edge.jpg",
      "/images/catalog/portes-entree/34-edge/202-edge.jpg",
      "/images/catalog/portes-entree/34-edge/203-edge.jpg",
      "/images/catalog/portes-entree/34-edge/204-edge.jpg",
      "/images/catalog/portes-entree/34-edge/205-edge.jpg"
    ],
    "summary": "Le modèle Edge allie intimité et visibilité grâce à son verre sablé au pourtour clair. Ce modèle polyvalent et intemporel s’intègre naturellement à tous les types de décors, qu'ils soient contemporains ou plus classiques. Ce verre est idéal pour les maisons en rangée ou les multi-logements.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/34-edge.html"
  },
  {
    "id": 46,
    "slug": "46-elevation",
    "legacyPath": "/vitres-de-porte/46-elevation.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Élévation",
    "image": "/images/catalog/portes-entree/46-elevation/321-elevation.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Élévation Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/46-elevation/321-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/322-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/327-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/328-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/329-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/330-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/331-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/332-elevation.jpg",
      "/images/catalog/portes-entree/46-elevation/323-elevation.png",
      "/images/catalog/portes-entree/46-elevation/324-elevation.png",
      "/images/catalog/portes-entree/46-elevation/325-elevation.png",
      "/images/catalog/portes-entree/46-elevation/326-elevation.png"
    ],
    "summary": "Notre gamme de fenêtres à ouvrant est performante, élégante et simple d'utilisation. Avec plusieurs options de verre décoratif disponibles, ces produits sont plus qu'un simple ouvrant.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/46-elevation.html"
  },
  {
    "id": 39,
    "slug": "39-mistral",
    "legacyPath": "/vitres-de-porte/39-mistral.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Mistral",
    "image": "/images/catalog/portes-entree/39-mistral/252-mistral.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Mistral Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/39-mistral/252-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/253-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/254-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/255-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/256-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/257-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/258-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/259-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/260-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/261-mistral.jpg",
      "/images/catalog/portes-entree/39-mistral/262-mistral.jpg"
    ],
    "summary": "L’élégance de ce vitrail prend source dans le style Art Nouveau. Il se compose de formes simples et élancées, inspirées des illustrations de cette époque. Conseil du designer : s’agence parfaitement au verre Pinhead.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/39-mistral.html"
  },
  {
    "id": 49,
    "slug": "49-mystique",
    "legacyPath": "/vitres-de-porte/49-mystique.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Mystique",
    "image": "/images/catalog/portes-entree/49-mystique/359-mystique.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Mystique Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/49-mystique/359-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/360-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/361-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/362-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/363-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/364-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/365-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/366-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/367-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/368-mystique.jpg",
      "/images/catalog/portes-entree/49-mystique/369-mystique.jpg"
    ],
    "summary": "Le modèle Mystique démontre le savoir-faire des artistes verriers. L’agencement du verre biseauté crée de superbes réfractions de lumière et met de l'avant la finesse du médaillon central.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/49-mystique.html"
  },
  {
    "id": 35,
    "slug": "35-opal",
    "legacyPath": "/vitres-de-porte/35-opal.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Opal",
    "image": "/images/catalog/portes-entree/35-opal/206-opal.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Opal Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/35-opal/206-opal.jpg",
      "/images/catalog/portes-entree/35-opal/207-opal.jpg",
      "/images/catalog/portes-entree/35-opal/208-opal.jpg",
      "/images/catalog/portes-entree/35-opal/209-opal.jpg",
      "/images/catalog/portes-entree/35-opal/210-opal.jpg",
      "/images/catalog/portes-entree/35-opal/211-opal.jpg",
      "/images/catalog/portes-entree/35-opal/212-opal.jpg",
      "/images/catalog/portes-entree/35-opal/213-opal.jpg",
      "/images/catalog/portes-entree/35-opal/214-opal.jpg"
    ],
    "summary": "Opal est le résultat d’un agencement somptueux de verres biseautés dans un style intemporel. Ce mariage de verres clair et satiné assurera une douceur, tout en créant de superbes effets lumineux. Ses formes simples et symétriques ajouteront de l’élégance à l’architecture de votre maison.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/35-opal.html"
  },
  {
    "id": 33,
    "slug": "33-pure",
    "legacyPath": "/vitres-de-porte/33-pure.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Pure",
    "image": "/images/catalog/portes-entree/33-pure/183-pure.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Pure Novatech - 2",
    "gallery": [
      "/images/catalog/portes-entree/33-pure/183-pure.jpg",
      "/images/catalog/portes-entree/33-pure/184-pure.jpg",
      "/images/catalog/portes-entree/33-pure/185-pure.jpg",
      "/images/catalog/portes-entree/33-pure/186-pure.jpg",
      "/images/catalog/portes-entree/33-pure/187-pure.jpg",
      "/images/catalog/portes-entree/33-pure/188-pure.jpg",
      "/images/catalog/portes-entree/33-pure/189-pure.jpg"
    ],
    "summary": "Pure apporte une touche de raffinement grâce à la délicatesse de ses lignes minimalistes. De plus, un es-pace discret de verre clair de part et d’autre des bandes noires facilite la vision extérieure tout en préservant l’intimité. Une alliance parfaite avec les portes noires et les fenêtres noires à meneaux horizontaux. Idéal pour une construction neuve ou un projet de rénovation. Conseil du designer : s’agence parfaitement au verre sablé.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/33-pure.html"
  },
  {
    "id": 41,
    "slug": "41-q470",
    "legacyPath": "/vitres-de-porte/41-q470.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Q470",
    "image": "/images/catalog/portes-entree/41-q470/271-q470.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Q470 Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/41-q470/271-q470.jpg",
      "/images/catalog/portes-entree/41-q470/272-q470.jpg",
      "/images/catalog/portes-entree/41-q470/273-q470.jpg",
      "/images/catalog/portes-entree/41-q470/274-q470.jpg",
      "/images/catalog/portes-entree/41-q470/275-q470.jpg",
      "/images/catalog/portes-entree/41-q470/276-q470.jpg",
      "/images/catalog/portes-entree/41-q470/277-q470.jpg",
      "/images/catalog/portes-entree/41-q470/278-q470.jpg",
      "/images/catalog/portes-entree/41-q470/286-q470.jpg",
      "/images/catalog/portes-entree/41-q470/288-q470.jpg",
      "/images/catalog/portes-entree/41-q470/289-q470.jpg",
      "/images/catalog/portes-entree/41-q470/290-q470.jpg",
      "/images/catalog/portes-entree/41-q470/291-q470.jpg",
      "/images/catalog/portes-entree/41-q470/292-q470.jpg"
    ],
    "summary": "Ce modèle de fenêtre à ouvrant en polypropylène moulé offre le meilleur rapport qualité / prix disponible et ne requiert aucun entretien. Le choix idéal pour les portes blanches ou noires.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/41-q470.html"
  },
  {
    "id": 42,
    "slug": "42-q550",
    "legacyPath": "/vitres-de-porte/42-q550.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Q550",
    "image": "/images/catalog/portes-entree/42-q550/279-q550.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Q550 Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/42-q550/279-q550.jpg",
      "/images/catalog/portes-entree/42-q550/280-q550.jpg",
      "/images/catalog/portes-entree/42-q550/281-q550.jpg",
      "/images/catalog/portes-entree/42-q550/282-q550.jpg",
      "/images/catalog/portes-entree/42-q550/283-q550.jpg",
      "/images/catalog/portes-entree/42-q550/284-q550.jpg",
      "/images/catalog/portes-entree/42-q550/285-q550.jpg"
    ],
    "summary": "Facile à peindre et absolument sans entretien, la fenêtre à ouvrant en PVC Q550 constitue le choix idéal pour une porte colorée. Avec une aussi grande ouverture, nul besoin d’une contreporte! Peinture réfléchissante recommandée.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/42-q550.html"
  },
  {
    "id": 44,
    "slug": "44-verre-clair",
    "legacyPath": "/vitres-de-porte/44-verre-clair.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Verre Clair",
    "image": "/images/catalog/portes-entree/44-verre-clair/302-verre-clair.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Verre Clair Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/44-verre-clair/302-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/303-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/304-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/305-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/306-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/307-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/308-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/309-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/310-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/311-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/312-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/313-verre-clair.jpg",
      "/images/catalog/portes-entree/44-verre-clair/314-verre-clair.jpg"
    ],
    "summary": "Le verre clair laisse entrer la lumière sans restriction. Ouvrez votre maison sur l'extérieur et profitez de l'impression de grandeur ainsi générée.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/44-verre-clair.html"
  },
  {
    "id": 45,
    "slug": "45-verre-sable",
    "legacyPath": "/vitres-de-porte/45-verre-sable.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Verre Sablé",
    "image": "/images/catalog/portes-entree/45-verre-sable/316-verre-sable.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Verre Sablé Novatech - 2",
    "gallery": [
      "/images/catalog/portes-entree/45-verre-sable/316-verre-sable.jpg",
      "/images/catalog/portes-entree/45-verre-sable/317-verre-sable.jpg",
      "/images/catalog/portes-entree/45-verre-sable/318-verre-sable.jpg",
      "/images/catalog/portes-entree/45-verre-sable/319-verre-sable.jpg",
      "/images/catalog/portes-entree/45-verre-sable/320-verre-sable.jpg",
      "/images/catalog/portes-entree/45-verre-sable/315-verre-sable.png"
    ],
    "summary": "Ce verre texturé par l'abrasion de grains de sable donne une surface de verre épurée. Très intime, il laisse tout de même passer la couleur naturelle.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/45-verre-sable.html"
  },
  {
    "id": 32,
    "slug": "32-verre-satine",
    "legacyPath": "/vitres-de-porte/32-verre-satine.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Verre Satiné",
    "image": "/images/catalog/portes-entree/32-verre-satine/174-verre-satine.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Verre Satiné Novatech - 1",
    "gallery": [
      "/images/catalog/portes-entree/32-verre-satine/174-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/175-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/176-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/177-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/178-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/179-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/180-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/181-verre-satine.jpg",
      "/images/catalog/portes-entree/32-verre-satine/182-verre-satine.jpg"
    ],
    "summary": "La douceur du verre satiné laisse passer la lumière tout en préservant l'intimité. Par sa simplicité, il s'agence aux architectures contemporaines.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/32-verre-satine.html"
  },
  {
    "id": 50,
    "slug": "50-zenith",
    "legacyPath": "/vitres-de-porte/50-zenith.html",
    "family": "portes-entree",
    "subcategory": "Vitres de porte",
    "name": "Zénith",
    "image": "/images/catalog/portes-entree/50-zenith/371-zenith.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte d'entrée vitres de porte Zénith Novatech - 3",
    "gallery": [
      "/images/catalog/portes-entree/50-zenith/371-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/372-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/373-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/374-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/375-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/376-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/377-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/378-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/379-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/380-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/381-zenith.jpg",
      "/images/catalog/portes-entree/50-zenith/382-zenith.jpg"
    ],
    "summary": "La simplicité de ce verre taillé s’intègre autant à des architectures fortes en textures qu'à des structures d’entrée plus épurées. Zénith s'allie aux tendances actuelles, ce qui en fait le complice idéal pour votre demeure. Conseil du designer : s’agence parfaitement au verre sablé.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/vitres-de-porte/50-zenith.html"
  },
  {
    "id": 85,
    "slug": "85-california",
    "legacyPath": "/portes-de-garage/85-california.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "California",
    "image": "/images/catalog/portes-garage/85-california/534-california.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage contemporaine Montréal",
    "gallery": [
      "/images/catalog/portes-garage/85-california/534-california.jpg",
      "/images/catalog/portes-garage/85-california/535-california.jpg",
      "/images/catalog/portes-garage/85-california/536-california.jpg",
      "/images/catalog/portes-garage/85-california/537-california.jpg",
      "/images/catalog/portes-garage/85-california/538-california.jpg",
      "/images/catalog/portes-garage/85-california/539-california.jpg",
      "/images/catalog/portes-garage/85-california/540-california.jpg",
      "/images/catalog/portes-garage/85-california/541-california.jpg",
      "/images/catalog/portes-garage/85-california/542-california.jpg",
      "/images/catalog/portes-garage/85-california/543-california.jpg",
      "/images/catalog/portes-garage/85-california/544-california.jpg"
    ],
    "summary": "La California est une porte panoramique en profilé d'aluminium.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/85-california.html"
  },
  {
    "id": 89,
    "slug": "89-cambridge-cl",
    "legacyPath": "/portes-de-garage/89-cambridge-cl.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "Cambridge CL",
    "image": "/images/catalog/portes-garage/89-cambridge-cl/561-cambridge-cl.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage Sherbrooke",
    "gallery": [
      "/images/catalog/portes-garage/89-cambridge-cl/561-cambridge-cl.jpg",
      "/images/catalog/portes-garage/89-cambridge-cl/562-cambridge-cl.jpg",
      "/images/catalog/portes-garage/89-cambridge-cl/563-cambridge-cl.jpg",
      "/images/catalog/portes-garage/89-cambridge-cl/564-cambridge-cl.jpg",
      "/images/catalog/portes-garage/89-cambridge-cl/565-cambridge-cl.jpg",
      "/images/catalog/portes-garage/89-cambridge-cl/566-cambridge-cl.jpg",
      "/images/catalog/portes-garage/89-cambridge-cl/567-cambridge-cl.jpg"
    ],
    "summary": "Cambridge CL est un design du modèle de porte de garage Cambridge.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/89-cambridge-cl.html"
  },
  {
    "id": 88,
    "slug": "88-moderno-2-lignes",
    "legacyPath": "/portes-de-garage/88-moderno-2-lignes.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "Moderno 2 lignes",
    "image": "/images/catalog/portes-garage/88-moderno-2-lignes/557-moderno-2-lignes.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage contemporaine Trois-Rivières",
    "gallery": [
      "/images/catalog/portes-garage/88-moderno-2-lignes/557-moderno-2-lignes.jpg",
      "/images/catalog/portes-garage/88-moderno-2-lignes/558-moderno-2-lignes.jpg",
      "/images/catalog/portes-garage/88-moderno-2-lignes/559-moderno-2-lignes.jpg",
      "/images/catalog/portes-garage/88-moderno-2-lignes/560-moderno-2-lignes.jpg"
    ],
    "summary": "Moderno 2 lignes est un design des modèles de portes de garage Standard+ et Acadia 138.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/88-moderno-2-lignes.html"
  },
  {
    "id": 90,
    "slug": "90-moderno-multi-moderno-ssg",
    "legacyPath": "/portes-de-garage/90-moderno-multi-moderno-ssg.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "Moderno multi / Moderno SSG",
    "image": "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/568-moderno-multi-moderno-ssg.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage contemporaine Longueuil",
    "gallery": [
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/568-moderno-multi-moderno-ssg.jpg",
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/569-moderno-multi-moderno-ssg.jpg",
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/570-moderno-multi-moderno-ssg.jpg",
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/571-moderno-multi-moderno-ssg.jpg",
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/572-moderno-multi-moderno-ssg.jpg",
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/573-moderno-multi-moderno-ssg.jpg",
      "/images/catalog/portes-garage/90-moderno-multi-moderno-ssg/574-moderno-multi-moderno-ssg.jpg"
    ],
    "summary": "Moderno multi est un design du modèle de porte de garage Standard+. Moderno SSG est un design du modèle de porte de garage Vantage .",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/90-moderno-multi-moderno-ssg.html"
  },
  {
    "id": 86,
    "slug": "86-shakermoderne-xl",
    "legacyPath": "/portes-de-garage/86-shakermoderne-xl.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "Shaker‑Moderne XL",
    "image": "/images/catalog/portes-garage/86-shakermoderne-xl/545-shakermoderne-xl.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage contemporaine Boucherville",
    "gallery": [
      "/images/catalog/portes-garage/86-shakermoderne-xl/545-shakermoderne-xl.jpg",
      "/images/catalog/portes-garage/86-shakermoderne-xl/546-shakermoderne-xl.jpg"
    ],
    "summary": "Shaker‑Moderne XL est un design du modèle de porte de garage Standard+.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/86-shakermoderne-xl.html"
  },
  {
    "id": 91,
    "slug": "91-uni",
    "legacyPath": "/portes-de-garage/91-uni.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "Uni",
    "image": "/images/catalog/portes-garage/91-uni/575-uni.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage contemporaine Joliette",
    "gallery": [
      "/images/catalog/portes-garage/91-uni/575-uni.jpg",
      "/images/catalog/portes-garage/91-uni/576-uni.jpg",
      "/images/catalog/portes-garage/91-uni/577-uni.jpg",
      "/images/catalog/portes-garage/91-uni/578-uni.jpg",
      "/images/catalog/portes-garage/91-uni/579-uni.jpg"
    ],
    "summary": "Uni est un design des modèles de portes de garage Standard+, Acadia 138, Vantage, Regal, H‑Tech et Top Tech.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/91-uni.html"
  },
  {
    "id": 87,
    "slug": "87-vog",
    "legacyPath": "/portes-de-garage/87-vog.html",
    "family": "portes-garage",
    "subcategory": "Portes de garage",
    "name": "Vog",
    "image": "/images/catalog/portes-garage/87-vog/547-vog.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre Porte de garage contemporaine Laval",
    "gallery": [
      "/images/catalog/portes-garage/87-vog/547-vog.jpg",
      "/images/catalog/portes-garage/87-vog/548-vog.jpg",
      "/images/catalog/portes-garage/87-vog/549-vog.jpg",
      "/images/catalog/portes-garage/87-vog/550-vog.jpg",
      "/images/catalog/portes-garage/87-vog/551-vog.jpg",
      "/images/catalog/portes-garage/87-vog/552-vog.jpg",
      "/images/catalog/portes-garage/87-vog/553-vog.jpg",
      "/images/catalog/portes-garage/87-vog/554-vog.jpg",
      "/images/catalog/portes-garage/87-vog/555-vog.jpg",
      "/images/catalog/portes-garage/87-vog/556-vog.jpg"
    ],
    "summary": "Vog est un design du modèle de porte de garage Standard+.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/portes-de-garage/87-vog.html"
  },
  {
    "id": 28,
    "slug": "28-loft",
    "legacyPath": "/aluminium/28-loft.html",
    "family": "portes-patio",
    "subcategory": "Aluminium",
    "name": "Loft",
    "image": "/images/catalog/portes-patio/28-loft/151-loft.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte patio Loft Novatech - 2",
    "gallery": [
      "/images/catalog/portes-patio/28-loft/151-loft.jpg",
      "/images/catalog/portes-patio/28-loft/152-loft.jpg",
      "/images/catalog/portes-patio/28-loft/153-loft.jpg",
      "/images/catalog/portes-patio/28-loft/154-loft.jpg"
    ],
    "summary": "Une porte tellement simple qu’elle amène l’extérieur vers l’intérieur. Son mécanisme levant permet d’ouvrir des panneaux vitrés surdimensionnés sans effort. Les configurations à deux panneaux surdimensionnés définissent le style de vie contemporain et permettent une vue panoramique à couper le souffle. Sécuritaire, durable, sans entretien et efficace, loft redéfinira votre espace de vie.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/aluminium/28-loft.html"
  },
  {
    "id": 25,
    "slug": "25-hybride-pvcalu",
    "legacyPath": "/hybride/25-hybride-pvcalu.html",
    "family": "portes-patio",
    "subcategory": "Hybride",
    "name": "Hybride PVC/ALU.",
    "image": "/images/catalog/portes-patio/25-hybride-pvcalu/132-hybride-pvcalu.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte patio Hybride Portes Decko - 5",
    "gallery": [
      "/images/catalog/portes-patio/25-hybride-pvcalu/132-hybride-pvcalu.jpg",
      "/images/catalog/portes-patio/25-hybride-pvcalu/133-hybride-pvcalu.jpg",
      "/images/catalog/portes-patio/25-hybride-pvcalu/134-hybride-pvcalu.jpg",
      "/images/catalog/portes-patio/25-hybride-pvcalu/135-hybride-pvcalu.jpg",
      "/images/catalog/portes-patio/25-hybride-pvcalu/136-hybride-pvcalu.jpg",
      "/images/catalog/portes-patio/25-hybride-pvcalu/137-hybride-pvcalu.jpg"
    ],
    "summary": "L’Hybride de Decko est une porte coulissante qui allie les qualités de l’aluminium et du PVC. Ses caractéristiques en font le mariage parfait entre l’élégance, la solidité et la performance. Son design contemporain et sa durabilité sont un gage de satisfaction. Découvrez les possibilités que cette porte a à vous offrir!",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/hybride/25-hybride-pvcalu.html"
  },
  {
    "id": 24,
    "slug": "24-classique-c-pvc",
    "legacyPath": "/tout-pvc/24-classique-c-pvc.html",
    "family": "portes-patio",
    "subcategory": "Tout-PVC",
    "name": "Classique C (PVC)",
    "image": "/images/catalog/portes-patio/24-classique-c-pvc/126-classique-c-pvc.jpg",
    "imageAlt": "Vous trouverez ici les détails les plus pertinents de notre porte patio Classique C Portes Decko - 1",
    "gallery": [
      "/images/catalog/portes-patio/24-classique-c-pvc/126-classique-c-pvc.jpg",
      "/images/catalog/portes-patio/24-classique-c-pvc/127-classique-c-pvc.jpg",
      "/images/catalog/portes-patio/24-classique-c-pvc/128-classique-c-pvc.jpg",
      "/images/catalog/portes-patio/24-classique-c-pvc/129-classique-c-pvc.jpg",
      "/images/catalog/portes-patio/24-classique-c-pvc/130-classique-c-pvc.jpg",
      "/images/catalog/portes-patio/24-classique-c-pvc/131-classique-c-pvc.jpg"
    ],
    "summary": "La Classique C de Decko est une porte coulissante en PVC blanc dont la couleur peut être personnalisée à l’intérieur comme à l’extérieur. Elle est notamment dotée d’un cadre de bois rigide qui assure sa grande solidité. Son design contemporain s’agence parfaitement à plusieurs styles de carrelages et de poignées.",
    "features": [],
    "specs": [],
    "sourceUrl": "https://fenetresboulet.com/tout-pvc/24-classique-c-pvc.html"
  }
] as const satisfies readonly CatalogProduct[];

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getProductsByFamily(
  family: CatalogFamilyId,
): readonly CatalogProduct[] {
  return catalogProducts.filter((product) => product.family === family);
}
