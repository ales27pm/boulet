import Link from "next/link";
import {
  contactDetails,
  editorialOfficialLinks,
} from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Vente d’entrepôt",
  description:
    "Consultez l’inventaire officiel de la vente d’entrepôt Boulet et préparez les dimensions à vérifier avant un rendez-vous.",
  path: "/vente-entrepot",
});

const warehouseSteps = [
  {
    title: "Mesurer l’ouverture",
    copy: "Notez la largeur et la hauteur utiles, mais faites confirmer la méthode de mesure et la compatibilité avant l’achat.",
  },
  {
    title: "Filtrer l’inventaire",
    copy: "La boutique officielle permet de chercher notamment par couleur, modèle, prix ou mesure. Les résultats et les quantités peuvent changer rapidement.",
  },
  {
    title: "Noter la référence",
    copy: "Conservez la référence de l’article qui vous intéresse afin de faciliter la vérification avec l’équipe.",
  },
  {
    title: "Valider les détails",
    copy: "Confirmez le sens d’ouverture, la configuration, la finition, l’état, les inclusions et toute condition de vente directement avec Boulet.",
  },
  {
    title: "Prendre rendez-vous",
    copy: "La boutique officielle demande de communiquer avec Boulet avant de se présenter pour voir un article.",
  },
  {
    title: "Prévoir l’installation",
    copy: "Un produit en inventaire doit tout de même convenir au bâtiment et être installé conformément aux exigences applicables.",
  },
];

export default function WarehouseSalePage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Vente d’entrepôt</span>
          </nav>
          <h1>
            Une occasion seulement si <em>les dimensions conviennent.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            L’inventaire, les prix et les quantités sont gérés dans la boutique
            officielle de vente d’entrepôt. Cette page vous aide à préparer la
            vérification sans reproduire une liste qui pourrait être périmée.
          </p>
          <div className="button-row">
            <a
              className="button button-dark"
              href={editorialOfficialLinks.warehouse}
            >
              Voir l’inventaire actuel <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Avant de réserver</p>
            <h2>Six contrôles pour éviter une mauvaise surprise.</h2>
          </div>
        </div>
        <ol className="shell checklist">
          {warehouseSteps.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell">
        <div className="contact-grid">
          <article className="contact-card accent-card">
            <span>Inventaire en direct</span>
            <div>
              <h2>Boutique officielle</h2>
              <p>
                Consultez les références disponibles, puis faites confirmer le
                stock et les conditions au moment de votre demande.
              </p>
            </div>
            <a className="button button-light" href={editorialOfficialLinks.warehouse}>
              Ouvrir la boutique
            </a>
          </article>
          <article className="contact-card">
            <span>Sur rendez-vous</span>
            <div>
              <h2>Appelez avant de venir</h2>
              <p>
                Mentionnez la référence, les dimensions et le produit que vous
                voulez vérifier. La boutique indique le poste 0.
              </p>
            </div>
            <a className="text-link" href={contactDetails.phoneHref}>
              {contactDetails.phoneDisplay}
            </a>
          </article>
        </div>
        <p className="notice" role="note">
          <strong>Offre variable.</strong> Aucun prix, rabais ou produit précis
          n’est recopié ici. Seule la boutique officielle confirme ce qui est
          disponible au moment de votre visite.
        </p>
      </section>
    </main>
  );
}
