import Link from "next/link";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Garantie limitée",
  description:
    "Comprenez les grands repères de la garantie limitée Boulet et préparez les pièces nécessaires à une demande de service.",
  path: "/garantie",
});

const warrantyFamilies = [
  {
    title: "Fenêtres",
    copy: "La garantie officielle distingue notamment les extrusions de PVC et d’aluminium, les unités de verre scellées, la quincaillerie et la main-d’œuvre. Les durées et exclusions varient selon la composante.",
  },
  {
    title: "Portes d’entrée",
    copy: "Panneaux, composantes, finition, vitrage et accessoires ne suivent pas tous la même période. L’usage résidentiel ou commercial et les interventions faites après la livraison peuvent aussi modifier la couverture.",
  },
  {
    title: "Portes patio",
    copy: "Les composantes de PVC, d’aluminium, de verre et de quincaillerie sont traitées séparément. Le fabricant réel de certaines portes distribuées peut également déterminer les conditions applicables.",
  },
];

const claimChecklist = [
  {
    title: "Facture d’origine",
    copy: "Elle permet d’identifier la date, le produit et le dossier; elle est aussi importante lors d’un transfert de propriété.",
  },
  {
    title: "Description du produit",
    copy: "Notez le type, l’emplacement, la couleur, le modèle et toute information d’identification disponible.",
  },
  {
    title: "Description du problème",
    copy: "Expliquez le symptôme, sa fréquence et les circonstances dans lesquelles il apparaît.",
  },
  {
    title: "Photos utiles",
    copy: "Préparez une vue de l’ouverture complète et une vue rapprochée de la zone concernée.",
  },
  {
    title: "Adresse du lieu",
    copy: "La localisation permet d’associer la demande au bâtiment et d’évaluer les modalités de déplacement.",
  },
  {
    title: "Contexte d’installation",
    copy: "La conformité de l’installation et l’entretien du produit peuvent faire partie de l’analyse de la couverture.",
  },
];

export default function WarrantyPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Garantie</span>
          </nav>
          <h1>
            Une couverture claire commence par <em>le bon document.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            La garantie Boulet est limitée, conditionnelle et détaillée par
            produit et composante. Ce résumé vous aide à vous orienter; le texte
            complet reproduit en PDF demeure la référence contractuelle.
          </p>
          <div className="button-row">
            <a
              className="button button-dark"
              href="/documents/garantie-limitee-boulet.pdf"
            >
              Lire la garantie complète en PDF <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="section-heading-note">
            Copie locale de la version publiée par Boulet et consultée le 23
            août 2026.
          </p>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell editorial-grid">
          <div>
            <p className="eyebrow">Couverture par composante</p>
            <h2>Trois familles, plusieurs conditions.</h2>
          </div>
          <div className="article-steps">
            {warrantyFamilies.map((family) => (
              <article className="article-step" key={family.title}>
                <h3>{family.title}</h3>
                <p>{family.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Préparer une réclamation</p>
            <h2>Six éléments qui accélèrent l’analyse.</h2>
          </div>
        </div>
        <ol className="checklist">
          {claimChecklist.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </li>
          ))}
        </ol>
        <p className="notice" role="note">
          <strong>À retenir.</strong> La garantie officielle prévoit notamment
          des conditions d’installation, d’usage et d’entretien, ainsi que des
          exclusions. La condensation sur la surface intérieure du vitrage n’est
          pas la même chose qu’un descellement entre les panneaux de verre.
        </p>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Votre dossier est prêt?</p>
          <h2>Transmettez les bonnes pièces au service après-vente.</h2>
          <Link className="button button-coral" href="/service">
            Préparer ma demande <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
