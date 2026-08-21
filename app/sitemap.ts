import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fenetresboulet.com";
  const routes = [
    "",
    "/produits",
    "/realisations",
    "/conseils",
    "/entreprise",
    "/soumission",
    "/service",
  ];

  return routes.map((route, index) => ({
    url: `${base}${route}`,
    lastModified: new Date("2026-08-20"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/soumission" ? 0.9 : 0.8,
  }));
}

