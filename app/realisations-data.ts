export interface RealisationProject {
  slug: string;
  title: string;
  location: string;
  image: string;
  imageAlt: string;
  note: string;
}

const officialGalleryNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 22,
] as const;

export const officialGallery = officialGalleryNumbers.map((number) => ({
  id: `realisation-${number}`,
  image: `/media/images/realisations-officielles/realisation-boulet-${number}.webp`,
  imageAlt: `Réalisation avec des produits Boulet, vue ${number} de la galerie officielle`,
}));

export const realisationProjects = [
  {
    slug: "rodes-marie-victorin",
    title: "Rodes Construction",
    location: "Marie-Victorin, Sorel-Tracy",
    image:
      "/images/realisations-officielles/rodes-marie-victorin.jpg",
    imageAlt: "Projet Rodes Construction sur la rue Marie-Victorin à Sorel-Tracy",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "rodes-auger-contrecoeur",
    title: "Rodes Construction",
    location: "Rue Auger, Contrecœur",
    image:
      "/images/realisations-officielles/rodes-auger-contrecoeur.jpg",
    imageAlt: "Projet Rodes Construction sur la rue Auger à Contrecœur",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "les-habitations-paris-freres",
    title: "Les Habitations Paris & Frères",
    location: "Trois-Rivières",
    image: "/media/images/editorial/realisation-paris-freres-v2.webp",
    imageAlt: "Réalisation Les Habitations Paris et Frères à Trois-Rivières",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "mes-habitations",
    title: "M.E.S Habitations",
    location: "Varennes",
    image: "/media/images/editorial/realisation-mes-v2.webp",
    imageAlt: "Réalisation M.E.S Habitations à Varennes",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "sylvain-bourdeau-construction-fils",
    title: "Sylvain Bourdeau Construction & Fils",
    location: "Trois-Rivières",
    image:
      "/images/realisations-officielles/sylvain-bourdeau-construction-fils.jpg",
    imageAlt: "Réalisation Sylvain Bourdeau Construction et Fils à Trois-Rivières",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "constructions-jasmont",
    title: "Constructions Jasmont",
    location: "Varennes",
    image: "/images/realisations-officielles/constructions-jasmont.jpg",
    imageAlt: "Réalisation Constructions Jasmont à Varennes",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "habitations-paul-dargis",
    title: "Habitations Paul Dargis",
    location: "Trois-Rivières",
    image:
      "/images/realisations-officielles/habitations-paul-dargis.jpg",
    imageAlt: "Réalisation Habitations Paul Dargis à Trois-Rivières",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "habitations-ml-fils",
    title: "Les Habitations M.L. & Fils inc.",
    location: "Sorel-Tracy",
    image:
      "/images/realisations-officielles/les-habitations-ml-fils-inc.jpg",
    imageAlt: "Réalisation Les Habitations M.L. et Fils à Sorel-Tracy",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "maison-contemporaine-bp-construction",
    title: "Maison contemporaine",
    location: "BP Construction · Sorel-Tracy",
    image: "/images/realisations-officielles/maison-contemporaine.jpg",
    imageAlt: "Maison contemporaine de BP Construction à Sorel-Tracy",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
  {
    slug: "capricor",
    title: "Capricor",
    location: "Trois-Rivières",
    image: "/media/images/editorial/realisation-capricor-v2.webp",
    imageAlt: "Projet de rénovation Capricor à Trois-Rivières",
    note: "Remplacement de portes et fenêtres publié dans la galerie officielle Boulet.",
  },
  {
    slug: "le-chevalier-noir",
    title: "Le Chevalier Noir",
    location: "Calixa-Lavallée",
    image: "/images/realisations-officielles/le-chevalier-noir.jpg",
    imageAlt: "Construction contemporaine Le Chevalier Noir à Calixa-Lavallée",
    note: "Projet publié dans la galerie officielle Boulet.",
  },
] as const satisfies readonly RealisationProject[];

export const realisationsSourceUrl =
  "https://fenetresboulet.com/content/15-nos-realisations";

export function getRealisationProject(
  slug: string,
): RealisationProject | undefined {
  return realisationProjects.find((project) => project.slug === slug);
}
