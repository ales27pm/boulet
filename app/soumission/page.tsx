import Link from "next/link";
import { GuidanceFigure } from "../components/GuidanceFigure";
import { LeadForm } from "../components/LeadForm";
import { getCatalogProduct } from "../catalog-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Demander une soumission",
  description:
    "Décrivez votre projet de portes et fenêtres et enregistrez une demande de soumission Boulet.",
  path: "/soumission",
});

export const dynamic = "force-dynamic";

const quoteChecklist = [
  {
    title: "Vos coordonnées",
    copy: "Nom, courriel, téléphone et adresse du projet pour vous joindre et situer le chantier.",
  },
  {
    title: "Le type de projet",
    copy: "Rénovation ou construction neuve, produits visés et besoin d’installation.",
  },
  {
    title: "Votre échéancier",
    copy: "Une date de début approximative suffit pour amorcer la conversation.",
  },
  {
    title: "Une courte description",
    copy: "Priorités, inconforts, quantités approximatives et résultat souhaité.",
  },
  {
    title: "Photos, si utiles",
    copy: "Quelques vues de la façade ou des ouvertures peuvent accélérer la compréhension.",
  },
  {
    title: "Plans, si disponibles",
    copy: "Les PDF doivent être transmis par courriel tant que leur analyse antimalware n’est pas activée dans ce formulaire.",
  },
];

type QuotePageProps = {
  searchParams: Promise<{ produit?: string | string[] }>;
};

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const intakeEnabled =
    process.env.BOULET_INTAKE_ENABLED === "true" && Boolean(turnstileSiteKey);
  const { produit } = await searchParams;
  const requestedSlug = Array.isArray(produit) ? produit[0] : produit;
  const selectedProduct = requestedSlug
    ? getCatalogProduct(requestedSlug)
    : undefined;
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Soumission</span>
          </nav>
          <h1>
            Votre projet commence par <em>quelques bonnes informations.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Préparez ce que vous avez déjà. Les plans et photos peuvent aider,
            mais ils ne sont pas nécessaires pour amorcer un échange.
          </p>
          <div className="button-row">
            <a className="button button-dark" href="#demande">
              Commencer ma demande <span aria-hidden="true">↓</span>
            </a>
          </div>
          <GuidanceFigure
            className="page-hero-figure"
            src="/media/images/custom/quote-preparation-v1.webp"
            alt="Mise en scène illustrative d’une personne préparant croquis, photos et mesures pour une soumission"
            caption="Personne, documents et projet fictifs; plans et photos restent optionnels."
          />
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">À préparer</p>
            <h2>Six repères, rien de plus.</h2>
          </div>
        </div>
        <ol className="shell checklist">
          {quoteChecklist.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell lead-form-section" id="demande">
        <LeadForm
          kind="quote"
          enabled={intakeEnabled}
          turnstileSiteKey={turnstileSiteKey}
          initialProduct={selectedProduct
            ? { name: selectedProduct.name, family: selectedProduct.family }
            : undefined}
        />
      </section>

      <section className="section shell">
        <div className="quote-grid">
          <article className="quote-card accent-card">
            <span>Besoin d’un autre format?</span>
            <div>
              <h2>Transmettre un PDF ou demander de l’aide</h2>
              <p>
                Écrivez à l’équipe si vous devez transmettre un plan PDF, si
                vos fichiers sont volumineux ou si le formulaire n’est pas
                disponible.
              </p>
            </div>
            <a className="button button-light" href="mailto:info@fenetresboulet.com">
              Écrire à l’équipe
            </a>
          </article>
          <article className="quote-card">
            <span>Une question avant de commencer?</span>
            <div>
              <h2>Parler à l’équipe</h2>
              <p>
                Appelez pour valider le bon service ou écrivez-nous si vos
                fichiers sont nombreux ou volumineux.
              </p>
            </div>
            <div className="button-row">
              <a className="text-link" href="tel:+14507429424">
                450 742-9424
              </a>
              <a className="text-link" href="mailto:info@fenetresboulet.com">
                Écrire un courriel
              </a>
            </div>
          </article>
        </div>
        <p className="notice" role="note">
          <strong>À savoir:</strong> Boulet se spécialise dans ses propres
          gammes de fabrication. Pour un produit d’une autre marque, un maître
          vitrier de votre région sera généralement le bon interlocuteur.
        </p>
      </section>
    </main>
  );
}
