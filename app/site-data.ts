export const officialSite = "https://fenetresboulet.com";

export const officialLinks = {
  quote: `${officialSite}/contact-form/demande-de-soumission`,
  service: `${officialSite}/contact-form/formulaire-de-sav`,
  warranty: `${officialSite}/content/2-garantie`,
  privacy: `${officialSite}/content/19-protection-des-renseignements-personnels-et-mentions-legales`,
  showroom: `${officialSite}/magasins`,
  instagram: "https://www.instagram.com/fenetresboulet/",
  maps: "https://www.google.com/maps/place/Portes+et+Fen%C3%AAtres+Boulet/@46.0035516,-73.1694746,17z",
};

export const productFamilies = [
  {
    id: "fenetres",
    index: "01",
    title: "Fenêtres",
    shortTitle: "Fenêtres",
    description:
      "Battant, auvent, coulissante ou guillotine — en PVC ou hybride, avec vitrage double ou triple selon vos priorités.",
    note: "Confort, lumière, rendement",
    image: "/images/fenetres-hybrides.webp",
    imageAlt: "Façade contemporaine avec grandes fenêtres noires Boulet",
    conceptImage: "/images/custom/product-windows-concept-v1.webp",
    conceptImageAlt:
      "Visualisation conceptuelle de fenêtres à battant noires sur une maison en brique",
    officialHref: `${officialSite}/13-fenetres`,
  },
  {
    id: "portes-entree",
    index: "02",
    title: "Portes d’entrée",
    shortTitle: "Portes d’entrée",
    description:
      "Acier, vitrage décoratif et quincaillerie réunis dans une composition cohérente avec l’architecture de la maison.",
    note: "Présence, sécurité, lumière",
    image: "/images/porte-acier.webp",
    imageAlt: "Porte d’entrée contemporaine Boulet baignée de lumière",
    conceptImage: "/images/custom/product-entry-concept-v1.webp",
    conceptImageAlt:
      "Visualisation conceptuelle d’une porte d’entrée noire avec vitrage vertical",
    officialHref: `${officialSite}/14-portes`,
  },
  {
    id: "portes-patio",
    index: "03",
    title: "Portes patio",
    shortTitle: "Portes patio",
    description:
      "Tout-PVC, aluminium ou hybride pour ouvrir la maison sur l’extérieur sans compromettre la performance.",
    note: "Ouverture, fluidité, performance",
    image: "/images/porte-patio.webp",
    imageAlt: "Grande porte patio noire ouvrant sur une terrasse",
    conceptImage: "/images/custom/product-patio-concept-v1.webp",
    conceptImageAlt:
      "Visualisation conceptuelle d’une porte patio noire donnant sur une terrasse",
    officialHref: `${officialSite}/15-portes-patio`,
  },
  {
    id: "portes-garage",
    index: "04",
    title: "Portes de garage",
    shortTitle: "Portes de garage",
    description:
      "Des profils sobres ou expressifs, distribués et intégrés au projet pour une façade pensée comme un tout.",
    note: "Façade, isolation, usage",
    image: "/images/porte-garage.webp",
    imageAlt: "Deux portes de garage noires sur une maison contemporaine",
    conceptImage: "/images/custom/product-garage-concept-v1.webp",
    conceptImageAlt:
      "Visualisation conceptuelle de portes de garage noires sur une maison en brique",
    officialHref: `${officialSite}/16-portes-de-garage`,
  },
] as const;

export const projects = [
  {
    title: "Les Habitations Paris & Frères",
    location: "Trois-Rivières",
    type: "Multirésidentiel contemporain",
    image: "/images/realisation-paris-freres.webp",
    alt: "Projet multirésidentiel en pierre avec fenêtres et portes noires",
  },
  {
    title: "M.E.S Habitations",
    location: "Varennes",
    type: "Maison contemporaine",
    image: "/images/realisation-mes.webp",
    alt: "Maison contemporaine avec grandes fenêtres et portes de garage noires",
  },
  {
    title: "Capricor",
    location: "Trois-Rivières",
    type: "Rénovation résidentielle",
    image: "/images/realisation-capricor.webp",
    alt: "Maison de plain-pied rénovée avec fenêtres noires",
  },
] as const;

export const windowStyles = [
  {
    name: "Battant",
    bestFor: "Étanchéité et ventilation contrôlée",
    description:
      "Ouverture extérieure à manivelle. Le système de fermeture à pression favorise une excellente étanchéité.",
  },
  {
    name: "Auvent",
    bestFor: "Ventiler même par pluie légère",
    description:
      "Format horizontal qui s’ouvre vers l’extérieur. Un choix naturel au-dessus d’un comptoir ou dans une salle de bain.",
  },
  {
    name: "Coulissante",
    bestFor: "Simplicité et dégagement",
    description:
      "Les volets glissent latéralement sans empiéter sur l’espace intérieur ou extérieur.",
  },
  {
    name: "Guillotine",
    bestFor: "Architecture classique",
    description:
      "Un ou deux châssis mobiles pour conserver des proportions traditionnelles et faciliter l’aération.",
  },
] as const;

export const faqs = [
  {
    question: "Quel type de fenêtre offre la meilleure efficacité énergétique?",
    answer:
      "Les modèles à battant et à auvent profitent d’un système de fermeture à pression plus étanche. Le vitrage, l’intercalaire et la configuration complète influencent aussi le rendement final.",
  },
  {
    question: "Vos produits peuvent-ils être certifiés ENERGY STAR?",
    answer:
      "Oui, plusieurs configurations sont offertes avec une performance ENERGY STAR. Les options choisies — carrelage, vitrage double ou triple et dimensions — déterminent la configuration finale.",
  },
  {
    question: "La garantie reste-t-elle valide si je vends la maison?",
    answer:
      "La garantie limitée est transférable, sous réserve des conditions détaillées et de la présentation de la facture d’origine.",
  },
  {
    question: "Que dois-je préparer pour une demande de service?",
    answer:
      "Gardez la facture ou le bon de commande, le modèle, une description claire du problème et des photos rapprochées et éloignées. Ces éléments accélèrent l’analyse du dossier.",
  },
] as const;

export const stats = [
  { value: "1976", label: "Fondation familiale" },
  { value: "120+", label: "Membres de l’équipe" },
  { value: "100 000", label: "pi² de savoir-faire" },
  { value: "A à Z", label: "Mesure à installation" },
] as const;
