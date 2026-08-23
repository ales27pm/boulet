import type {
  CatalogFamilyId,
  CatalogProduct,
} from "../catalog-data";

export type CatalogExplorerProduct = Pick<
  CatalogProduct,
  "id" | "slug" | "family" | "subcategory" | "name" | "image"
> & { readonly searchText: string };

export function normalizeCatalogSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-CA")
    .trim();
}

export function toCatalogExplorerProduct(
  product: CatalogProduct,
): CatalogExplorerProduct {
  return {
    id: product.id,
    slug: product.slug,
    family: product.family,
    subcategory: product.subcategory,
    name: product.name,
    image: product.image,
    searchText: normalizeCatalogSearch(
      [
        product.name,
        product.subcategory,
        product.summary,
        ...product.features,
        ...product.specs.flatMap((specification) => [
          specification.label,
          specification.value,
        ]),
      ].join(" "),
    ),
  };
}

export interface CatalogFamilyPresentation {
  readonly label: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly selectionPrompt: string;
}

export const catalogFamilyPresentation: Record<
  CatalogFamilyId,
  CatalogFamilyPresentation
> = {
  fenetres: {
    label: "Fenêtres",
    eyebrow: "Types d’ouverture et matériaux",
    description:
      "Comparez les modèles à auvent, à battant, coulissants et à guillotine consignés au catalogue Boulet.",
    selectionPrompt:
      "Le type d’ouverture et le matériau sont les premiers repères à comparer.",
  },
  "portes-entree": {
    label: "Portes d’entrée",
    eyebrow: "Portes d’acier et vitres décoratives",
    description:
      "Parcourez séparément les modèles de portes d’acier et les collections de vitres de porte.",
    selectionPrompt:
      "Commencez par choisir entre un modèle de porte et une composition de vitrage.",
  },
  "portes-patio": {
    label: "Portes patio",
    eyebrow: "Aluminium, hybride et PVC",
    description:
      "Voyez les trois familles de matériaux représentées dans le catalogue de portes patio.",
    selectionPrompt:
      "Comparez d’abord la composition du cadre et la configuration décrite sur chaque fiche.",
  },
  "portes-garage": {
    label: "Portes de garage",
    eyebrow: "Collections et motifs",
    description:
      "Explorez les modèles de portes de garage répertoriés par Boulet et leurs galeries officielles.",
    selectionPrompt:
      "Les fiches permettent de comparer les noms de collection et les visuels disponibles.",
  },
};

export function isCatalogFamilyId(value: string): value is CatalogFamilyId {
  return value in catalogFamilyPresentation;
}

export function familyHref(
  family: CatalogFamilyId,
): `/produits/${CatalogFamilyId}` {
  return `/produits/${family}`;
}

export function productHref(
  family: CatalogFamilyId,
  slug: string,
): `/produits/${CatalogFamilyId}/${string}` {
  return `/produits/${family}/${slug}`;
}
