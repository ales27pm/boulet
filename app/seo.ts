import type { Metadata } from "next";

const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteOrigin = (
  configuredOrigin || "https://fenetresboulet.com"
).replace(/\/$/, "");

export const siteUrl = new URL(siteOrigin);

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_CA",
      siteName: "Portes et Fenêtres Boulet",
      title,
      description,
      url: path,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
