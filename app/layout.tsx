import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";
import { absoluteUrl, safeJsonLd, siteUrl } from "./seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Portes et Fenêtres Boulet | Fabriqué au Québec depuis 1976",
    template: "%s | Portes et Fenêtres Boulet",
  },
  description:
    "Portes et fenêtres fabriquées au Québec. Conseils, prise de mesures, fabrication et installation pour un projet mené de A à Z.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/images/brand/boulet-symbol.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/images/brand/boulet-symbol.png",
    apple: "/images/brand/boulet-symbol.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: "Portes et Fenêtres Boulet",
    title: "Votre projet de portes et fenêtres, de A à Z.",
    description:
      "Une entreprise familiale québécoise qui prend votre projet en main, de la mesure à l’installation.",
    url: "/",
    images: [
      {
        url: "/images/custom/social-card-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Visuel d’inspiration Boulet montrant une façade résidentielle aux ouvertures noires.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Votre projet de portes et fenêtres, de A à Z.",
    description: "Portes et fenêtres fabriquées au Québec depuis 1976.",
    images: ["/images/custom/social-card-v2.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": `${absoluteUrl("/")}#entreprise`,
  name: "Portes et Fenêtres Boulet",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/images/brand/boulet-wordmark-color.png"),
  image: absoluteUrl("/images/custom/social-card-v2.jpg"),
  telephone: "+1-450-742-9424",
  email: "info@fenetresboulet.com",
  foundingDate: "1976",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10700, route Marie-Victorin",
    addressLocality: "Sorel-Tracy",
    addressRegion: "QC",
    postalCode: "J3R 0K2",
    addressCountry: "CA",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Québec",
  },
  sameAs: ["https://www.instagram.com/fenetresboulet/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
