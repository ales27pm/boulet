import Link from "next/link";
import { GuidanceFigure } from "../components/GuidanceFigure";
import { LeadForm } from "../components/LeadForm";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Service après-vente",
  description:
    "Documentez un problème avec un produit Boulet et enregistrez une demande de service après-vente.",
  path: "/service",
});

export const dynamic = "force-dynamic";

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
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const intakeEnabled =
    process.env.BOULET_INTAKE_ENABLED === "true" && Boolean(turnstileSiteKey);

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
            <a className="button button-dark" href="#demande">
              Commencer ma demande <span aria-hidden="true">↓</span>
            </a>
          </div>
          <GuidanceFigure
            className="page-hero-figure"
            src="/images/custom/service-documentation-v1.webp"
            alt="Mise en scène illustrative d’une personne photographiant la quincaillerie d’une fenêtre"
            caption="Personne, lieu et dossier fictifs; aucune donnée client réelle."
          />
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

      <section className="section shell lead-form-section" id="demande">
        <LeadForm
          kind="service"
          enabled={intakeEnabled}
          turnstileSiteKey={turnstileSiteKey}
        />
      </section>

      <section className="section shell">
        <div className="service-grid">
          <article className="service-card accent-card">
            <span>Besoin d’un autre format?</span>
            <div>
              <h2>Transmettre une facture PDF</h2>
              <p>
                Écrivez à l’équipe si votre facture est en PDF, si vos fichiers
                sont volumineux ou si le formulaire n’est pas disponible.
              </p>
            </div>
            <a className="button button-light" href="mailto:info@fenetresboulet.com">
              Écrire à l’équipe
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
              <Link className="text-link" href="/garantie">
                Garantie complète <span aria-hidden="true">→</span>
              </Link>
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
