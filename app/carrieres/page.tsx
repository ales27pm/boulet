import Link from "next/link";
import { contactDetails } from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Carrières",
  description:
    "Découvrez l’environnement de travail et les possibilités de carrière chez Portes et Fenêtres Boulet à Sorel-Tracy.",
  path: "/carrieres",
});

const roleDetails = [
  {
    title: "Le travail",
    copy: "La page officielle décrit un rôle en fabrication qui exécute différentes tâches de production en respectant les priorités et les échéances des commandes.",
  },
  {
    title: "Les qualités recherchées",
    copy: "Polyvalence, rigueur, minutie, organisation, capacité d’adaptation, esprit d’équipe et lecture d’un ruban à mesurer en unités impériales.",
  },
  {
    title: "Les avantages publiés",
    copy: "Assurances maladie, vision, vie et invalidité, vacances et congés compensatoires, stationnement sur place et tenue décontractée.",
  },
];

export default function CareersPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Carrières</span>
          </nav>
          <h1>
            Fabriquer ici, <em>grandir ensemble.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Boulet présente une entreprise familiale établie à Sorel-Tracy
            depuis 1976, avec des produits distribués à travers le Québec et un
            engagement envers un milieu inclusif.
          </p>
          <div className="button-row">
            <a
              className="button button-dark"
              href={`mailto:${contactDetails.email}?subject=Candidature%20-%20Portes%20et%20Fen%C3%AAtres%20Boulet`}
            >
              Envoyer ma candidature
            </a>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell editorial-grid">
          <div>
            <p className="eyebrow">Rôle présenté sur le site officiel</p>
            <h2>Ouvrier ou ouvrière en fabrication.</h2>
          </div>
          <div className="article-steps">
            {roleDetails.map((detail) => (
              <article className="article-step" key={detail.title}>
                <h3>{detail.title}</h3>
                <p>{detail.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <p className="notice" role="note">
          <strong>Les besoins d’embauche évoluent.</strong> Confirmez directement
          avec l’équipe le poste, l’horaire, les exigences et les avantages avant
          de transmettre votre candidature.
        </p>
        <div className="button-row">
          <a
            className="text-link"
            href={`mailto:${contactDetails.email}?subject=Possibilit%C3%A9s%20de%20carri%C3%A8re%20chez%20Boulet`}
          >
            Vérifier les possibilités actuelles
          </a>
          <a className="text-link" href={contactDetails.phoneHref}>
            Appeler au {contactDetails.phoneDisplay}
          </a>
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Une équipe enracinée à Sorel-Tracy</p>
          <h2>Découvrez l’histoire derrière la fabrication.</h2>
          <Link className="button button-coral" href="/entreprise">
            Voir notre parcours <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
