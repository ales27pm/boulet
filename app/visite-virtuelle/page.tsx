import Link from "next/link";
import {
  contactDetails,
  editorialOfficialLinks,
} from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Visite virtuelle de la salle de montre",
  description:
    "Explorez la salle de montre Boulet à distance, puis préparez une visite ou une conversation avec l’équipe de Sorel-Tracy.",
  path: "/visite-virtuelle",
});

const visitSteps = [
  {
    title: "Parcourir l’espace",
    copy: "Utilisez la visite Google pour vous déplacer dans la salle et repérer les familles de produits présentées au moment de la captation.",
  },
  {
    title: "Noter vos questions",
    copy: "Relevez les styles, matériaux, couleurs ou détails que vous souhaitez comparer; l’image ne permet pas de confirmer une configuration technique.",
  },
  {
    title: "Valider avec l’équipe",
    copy: "Les présentoirs et collections peuvent évoluer. Appelez avant de vous déplacer si vous voulez voir un produit ou un fini précis.",
  },
];

export default function VirtualVisitPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Visite virtuelle</span>
          </nav>
          <h1>
            Faites un premier tour, <em>sans vous déplacer.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            La visite virtuelle officielle ouvre une vue immersive Google de la
            salle de montre de Sorel-Tracy. Servez-vous-en pour préparer une
            conversation, pas pour confirmer une disponibilité.
          </p>
          <div className="button-row">
            <a
              className="button button-dark"
              href={editorialOfficialLinks.virtualVisit}
            >
              Entrer dans la salle virtuelle <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="external-handoff-note">
            La visite s’ouvrira dans Google Maps.
          </p>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell editorial-grid">
          <div>
            <p className="eyebrow">Une visite en trois temps</p>
            <h2>Regarder, noter, confirmer.</h2>
          </div>
          <div className="article-steps">
            {visitSteps.map((step) => (
              <article className="article-step" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="contact-grid">
          <article className="contact-card accent-card">
            <span>Visite physique</span>
            <div>
              <h2>10700, route Marie-Victorin</h2>
              <p>Sorel-Tracy (Québec) J3R 0K2</p>
            </div>
            <a className="button button-light" href={editorialOfficialLinks.maps}>
              Obtenir l’itinéraire
            </a>
          </article>
          <article className="contact-card">
            <span>Avant de vous déplacer</span>
            <div>
              <h2>Confirmer avec l’équipe</h2>
              <p>
                Appelez pour vérifier les heures et la présence du produit que
                vous souhaitez comparer.
              </p>
            </div>
            <a className="text-link" href={contactDetails.phoneHref}>
              {contactDetails.phoneDisplay}
            </a>
          </article>
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Après la visite</p>
          <h2>Transformez vos repères visuels en critères de projet.</h2>
          <Link className="button button-coral" href="/soumission">
            Préparer ma demande <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
