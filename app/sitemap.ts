import type { MetadataRoute } from "next";
import { catalogCapturedAt, catalogFamilies, catalogProducts } from "./catalog-data";
import { realisationProjects } from "./realisations-data";
import { siteOrigin } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/produits",
    "/realisations",
    "/conseils",
    "/guides",
    "/faq",
    "/blogue",
    "/subventions",
    "/entreprise",
    "/equipe",
    "/carrieres",
    "/contact",
    "/visite-virtuelle",
    "/vente-entrepot",
    "/garantie",
    "/confidentialite",
    "/credits",
    "/soumission",
    "/service",
  ];

  const staticEntries = routes.map((route, index) => ({
    url: `${siteOrigin}${route === "/" ? "" : route}`,
    lastModified: new Date("2026-08-23"),
    changeFrequency: (index === 0 ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: index === 0 ? 1 : route === "/soumission" ? 0.9 : 0.8,
  }));

  const familyEntries = catalogFamilies.map((family) => ({
    url: `${siteOrigin}/produits/${family.id}`,
    lastModified: new Date(catalogCapturedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const productEntries = catalogProducts.map((product) => ({
    url: `${siteOrigin}/produits/${product.family}/${product.slug}`,
    lastModified: new Date(catalogCapturedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectEntries = realisationProjects.map((project) => ({
    url: `${siteOrigin}/realisations/${project.slug}`,
    lastModified: new Date("2026-08-23"),
    changeFrequency: "yearly" as const,
    priority: 0.65,
  }));

  return [
    ...staticEntries,
    ...familyEntries,
    ...productEntries,
    ...projectEntries,
  ];
}
