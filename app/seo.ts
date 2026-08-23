import type { Metadata } from "next";

const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteOrigin = (
  configuredOrigin || "https://fenetresboulet.com"
).replace(/\/$/, "");

export const siteUrl = new URL(siteOrigin);

const defaultSocialImage = "/images/custom/social-card-v2.jpg";

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
  const socialImage = image || defaultSocialImage;

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
      images: [
        {
          url: socialImage,
          ...(image
            ? {}
            : {
                width: 1200,
                height: 630,
                alt: "Visuel d’inspiration Boulet montrant une façade résidentielle aux ouvertures noires.",
              }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
