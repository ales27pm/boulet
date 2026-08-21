import type { Metadata } from "next";
import { SiteLink as Link } from "../components/SiteLink";
import { officialLinks } from "../site-data";

export const metadata: Metadata = {
  title: "Service après-vente",
  description:
    "Préparez une demande de service après-vente Boulet avec facture, informations produit et photos utiles.",
};

const serviceChecklist = [
  {
    title: "Facture ou bon de commande",
    copy: "Le document d’origine aide à identifier le produit et la période de garantie.",
  },
  {
    title: "Produit et emplacement",
    copy: "Modèle, couleur, quantité, pièce, étage et présence d’un code QR si applicable.",
  },
  {
    title: "Description précise",
    copy: "Expliquez le symptôme, le moment où il survient et tout changement récent.",
  },
  {
    title: "Photo éloignée",
    copy: "Montrez l’ouverture complète et son contexte dans le mur ou la pièce.",
  },
  {
    title: "Photo rapprochée",
    copy: "Cadrez le défaut, le joint, la quincaillerie ou la zone problématique.",
  },
  {
    title: "Mesure du verre",
    copy: "Pour un problème de thermos, notez la dimension visible du vitrage si possible.",
  },
];

export default function ServicePage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Service après-vente</span>
          </nav>
          <h1>
            Un problème bien documenté se règle <em>plus simplement.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Le service après-vente concerne les produits des gammes Boulet.
            Préparez quelques éléments concrets pour accélérer l’analyse par un
            technicien.
          </p>
          <div className="button-row">
            <a className="button button-dark" href={officialLinks.service}>
              Faire une demande de service <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Votre dossier en six pièces</p>
            <h2>Préparez avant d’ouvrir le formulaire.</h2>
          </div>
        </div>
        <ol className="shell checklist">
          {serviceChecklist.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell">
        <div className="service-grid">
          <article className="service-card accent-card">
            <span>Demande structurée</span>
            <div>
              <h2>Formulaire après-vente</h2>
              <p>
                Idéal pour transmettre les informations produit et les photos
                nécessaires à l’analyse du dossier.
              </p>
            </div>
            <a className="button button-light" href={officialLinks.service}>
              Ouvrir le formulaire officiel
            </a>
          </article>
          <article className="service-card">
            <span>Aide directe</span>
            <div>
              <h2>Besoin d’être orienté?</h2>
              <p>
                Appelez la réception si vous ne savez pas quel formulaire ou
                quel document utiliser.
              </p>
            </div>
            <div className="button-row">
              <a className="text-link" href="tel:+14507429424">
                450 742-9424
              </a>
              <a className="text-link" href={officialLinks.warranty}>
                Garantie complète <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </div>
        <p className="notice" role="note">
          <strong>Produit d’une autre marque?</strong> Le service Boulet est
          réservé à ses propres gammes. Un maître vitrier local pourra vous
          aider pour une autre fabrication.
        </p>
      </section>
    </main>
  );
}
