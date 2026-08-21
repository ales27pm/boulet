import type { Metadata } from "next";
import { SiteLink as Link } from "../components/SiteLink";
import { officialLinks } from "../site-data";

export const metadata: Metadata = {
  title: "Demander une soumission",
  description:
    "Préparez votre projet de portes et fenêtres puis accédez au formulaire officiel de soumission Boulet.",
};

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
    title: "Plans, si disponibles",
    copy: "Le formulaire accepte un plan PDF. Ce document reste optionnel.",
  },
  {
    title: "Photos, si utiles",
    copy: "Quelques vues de la façade ou des ouvertures peuvent accélérer la compréhension.",
  },
];

export default function QuotePage() {
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
            <a className="button button-dark" href={officialLinks.quote}>
              Ouvrir le formulaire officiel <span aria-hidden="true">↗</span>
            </a>
          </div>
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

      <section className="section shell">
        <div className="quote-grid">
          <article className="quote-card accent-card">
            <span>Projet résidentiel ou commercial</span>
            <div>
              <h2>Envoyer une demande structurée</h2>
              <p>
                Le formulaire officiel transmet vos informations directement à
                l’équipe Boulet. Vérifiez vos réponses avant l’envoi.
              </p>
            </div>
            <a className="button button-light" href={officialLinks.quote}>
              Continuer vers le formulaire
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
