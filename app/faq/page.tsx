import Link from "next/link";
import { extendedFaqs } from "../editorial-data";
import { createPageMetadata, safeJsonLd } from "../seo";

export const metadata = createPageMetadata({
  title: "Questions fréquentes",
  description:
    "Réponses aux questions fréquentes sur la performance, l’entretien, les thermos, l’installation et la garantie Boulet.",
  path: "/faq",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: extendedFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <main id="contenu">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>FAQ</span>
          </nav>
          <h1>
            Les réponses utiles, <em>avant le prochain appel.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Performance, condensation, garantie ou thermos : commencez ici pour
            mieux décrire votre situation et savoir quelle information préparer.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/contact">
              Poser une autre question
            </Link>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Questions fréquentes</p>
            <h2>Comprendre avant d’agir.</h2>
          </div>
          <Link className="text-link" href="/service">
            Préparer une demande de service <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="shell faq-list">
          {extendedFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <div className="faq-answer">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="section shell">
        <p className="notice" role="note">
          <strong>Une réponse générale ne remplace pas un diagnostic.</strong> Si
          un produit Boulet présente un problème, documentez la situation et
          utilisez le parcours après-vente.
        </p>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Votre situation est différente?</p>
          <h2>Photos, facture et contexte permettent une réponse plus précise.</h2>
          <Link className="button button-coral" href="/service">
            Préparer une demande de service <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
