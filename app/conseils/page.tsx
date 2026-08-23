import Link from "next/link";
import { GuidanceFigure } from "../components/GuidanceFigure";
import { createPageMetadata } from "../seo";
import { faqs } from "../site-data";

export const metadata = createPageMetadata({
  title: "Guide d’achat et conseils",
  description:
    "Un guide clair pour choisir le style, le matériau, le vitrage et l’installation de vos portes et fenêtres.",
  path: "/conseils",
});

const guideSteps = [
  {
    title: "Nommer le vrai problème",
    copy: "Infiltration d’air, condensation, bruit, entretien, lumière ou simple désir de moderniser: la bonne solution dépend d’abord de ce que vous voulez changer au quotidien.",
  },
  {
    title: "Choisir le mouvement",
    copy: "Battant et auvent misent sur l’étanchéité; coulissante et guillotine répondent à d’autres contraintes d’espace, d’usage et de style architectural.",
  },
  {
    title: "Arbitrer le matériau",
    copy: "Le PVC offre un excellent rendement et peu d’entretien. L’hybride ajoute une enveloppe d’aluminium extérieure et davantage de possibilités de couleurs.",
  },
  {
    title: "Composer le vitrage",
    copy: "Double ou triple vitrage, verre énergétique, carrelage et dimensions forment un système. La configuration finale doit répondre à l’orientation et à la pièce, pas seulement à une fiche technique.",
  },
  {
    title: "Prévoir l’installation",
    copy: "Une bonne fenêtre mal installée ne livre pas sa performance. La prise de mesures et une pose conforme à la norme applicable font partie de la décision.",
  },
];

export default function AdvicePage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Conseils</span>
          </nav>
          <h1>
            Moins de catalogue. <em>Plus de bonnes questions.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Cinq décisions structurent presque tous les projets. Les prendre
            dans le bon ordre évite de payer pour des options qui ne règlent pas
            votre besoin.
          </p>
          <GuidanceFigure
            className="page-hero-figure"
            src="/images/custom/guide-materials-v1.webp"
            alt="Mise en scène illustrative de profilés de fenêtre, d’un vitrage et d’un échantillon de quincaillerie"
            caption="Échantillons fictifs; matériaux, vitrage et finitions à confirmer avec un conseiller."
          />
        </div>
      </header>

      <section className="section page-band">
        <div className="shell editorial-grid">
          <div>
            <p className="eyebrow">Guide d’achat</p>
            <h2>Votre projet, en cinq décisions.</h2>
          </div>
          <div className="article-steps">
            {guideSteps.map((step) => (
              <article className="article-step" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Questions fréquentes</p>
            <h2>Les réponses qui débloquent une décision.</h2>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <div className="faq-answer">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Encore une question?</p>
          <h2>Un conseiller peut mettre vos priorités dans le bon ordre.</h2>
          <div className="button-row">
            <Link className="button button-coral" href="/soumission">
              Parler de mon projet <span aria-hidden="true">↗</span>
            </Link>
            <a className="text-link text-link-light" href="tel:+14507429424">
              Appeler le 450 742-9424
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
