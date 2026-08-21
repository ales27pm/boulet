import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fenetresboulet.com"),
  title: {
    default: "Portes et Fenêtres Boulet | Fabriqué au Québec depuis 1976",
    template: "%s | Portes et Fenêtres Boulet",
  },
  description:
    "Portes et fenêtres fabriquées au Québec. Conseils, prise de mesures, fabrication et installation pour un projet mené de A à Z.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: "Portes et Fenêtres Boulet",
    title: "Pensées ici. Fabriquées ici. Installées pour durer.",
    description:
      "Une entreprise familiale québécoise qui prend votre projet en main, de la mesure à l’installation.",
    images: [
      {
        url: "/og-v2.png",
        width: 1731,
        height: 909,
        alt: "Portes et Fenêtres Boulet — fabriquées au Québec depuis 1976",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pensées ici. Fabriquées ici. Installées pour durer.",
    description: "Portes et fenêtres fabriquées au Québec depuis 1976.",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
