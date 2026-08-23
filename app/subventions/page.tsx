import Link from "next/link";
import { editorialOfficialLinks } from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Aides financières et subventions",
  description:
    "Préparez la vérification des programmes d’aide financière avant un projet de remplacement de portes et fenêtres.",
  path: "/subventions",
});

const verificationSteps = [
  {
    title: "Vérifier le programme aujourd’hui",
    copy: "Les programmes, critères, dates et budgets changent. Consultez directement l’organisme public responsable plutôt qu’un ancien dépliant ou un montant repris ailleurs.",
  },
  {
    title: "Confirmer l’admissibilité du bâtiment",
    copy: "Le type d’habitation, le statut du propriétaire et la nature des travaux peuvent modifier l’admissibilité. Validez votre situation avant de commander.",
  },
  {
    title: "Respecter l’ordre des étapes",
    copy: "Certains programmes exigent une inscription ou une évaluation avant le début des travaux. Ne présumez pas qu’une demande déposée après coup sera acceptée.",
  },
  {
    title: "Faire confirmer la configuration",
    copy: "Demandez les caractéristiques exactes du produit proposé et les documents nécessaires. Une famille de produits admissible ne rend pas automatiquement chaque configuration admissible.",
  },
  {
    title: "Conserver les preuves",
    copy: "Gardez soumission, facture, preuves de paiement, fiches de rendement et documents d’installation selon les exigences du programme retenu.",
  },
  {
    title: "Revalider avant de signer",
    copy: "Effectuez une dernière vérification auprès de l’administrateur du programme lorsque la portée ou l’échéancier du projet change.",
  },
];

export default function GrantsPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Subventions</span>
          </nav>
          <h1>
            Vérifier d’abord. <em>Chiffrer ensuite.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Une aide financière peut influencer l’ordre du projet, les documents
            à conserver et les produits à retenir. Cette page vous aide à poser
            les bonnes questions sans figer des montants qui peuvent changer.
          </p>
          <div className="button-row">
            <a
              className="button button-dark"
              href={editorialOfficialLinks.renoclimat}
            >
              Vérifier Rénoclimat <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Avant toute décision</p>
            <h2>Six vérifications qui protègent votre dossier.</h2>
          </div>
        </div>
        <ol className="shell checklist">
          {verificationSteps.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell">
        <div className="opening-statement">
          <div>
            <p className="eyebrow">Point de départ actuel</p>
            <h2>Rénoclimat demeure une source gouvernementale à consulter.</h2>
          </div>
          <div>
            <p className="large-copy">
              Le Gouvernement du Québec présente Rénoclimat comme un programme
              d’évaluation et d’aide pour certains travaux d’amélioration de la
              performance énergétique, dont le remplacement admissible de portes
              et fenêtres.
            </p>
            <p>
              L’administrateur du programme détermine l’admissibilité et les
              montants. Boulet peut documenter la configuration proposée, mais ne
              peut garantir l’acceptation d’un dossier.
            </p>
          </div>
        </div>
        <p className="notice" role="note">
          <strong>Contenu à revalider.</strong> La page historique de Boulet cite
          plusieurs programmes provinciaux et fédéraux dont certains ont changé
          ou cessé d’accepter de nouvelles demandes. Aucun ancien montant n’est
          repris ici.
        </p>
        <div className="button-row">
          <a className="text-link" href={editorialOfficialLinks.renoclimat}>
            Information actuelle du Gouvernement du Québec{" "}
            <span aria-hidden="true">↗</span>
          </a>
          <Link className="text-link" href="/guides">
            Préparer les documents du projet <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Une configuration à documenter?</p>
          <h2>Demandez les caractéristiques précises avant de planifier l’aide.</h2>
          <Link className="button button-coral" href="/soumission">
            Préparer mon projet <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
