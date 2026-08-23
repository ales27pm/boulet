import Link from "next/link";
import { guideCards } from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Guides pratiques",
  description:
    "Accédez aux guides Boulet pour choisir, entretenir et faire installer vos portes et fenêtres.",
  path: "/guides",
});

const maintenanceSteps = [
  {
    title: "Nettoyer sans abrasif",
    copy: "Pour le PVC, l’aluminium et les portes, le guide recommande de l’eau et un savon doux. Éliminez d’abord la poussière pour éviter de marquer les surfaces.",
  },
  {
    title: "Inspecter les joints",
    copy: "Surveillez le calfeutrage extérieur et les coupe-froid. Une fissure, un décollement ou une perte de souplesse mérite une intervention adaptée.",
  },
  {
    title: "Entretenir les mécanismes",
    copy: "Nettoyez la quincaillerie et utilisez le lubrifiant recommandé dans le guide, notamment un produit à base de silicone pour les mécanismes visés.",
  },
  {
    title: "Favoriser la circulation d’air",
    copy: "En saison froide, retirer les moustiquaires et dégager stores ou rideaux aide l’air à circuler près du vitrage et limite l’accumulation d’eau.",
  },
];

export default function GuidesPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Guides</span>
          </nav>
          <h1>
            Choisir, installer, entretenir. <em>Dans cet ordre.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Les ressources officielles réunies au même endroit, avec le contexte
            nécessaire pour savoir ce qu’elles couvrent — et ce qu’il faut faire
            confirmer.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/conseils">
              Commencer par le guide d’achat
            </Link>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Bibliothèque pratique</p>
            <h2>Trois ressources, trois moments du projet.</h2>
          </div>
        </div>
        <ol className="shell checklist">
          {guideCards.map((guide) => (
            <li key={guide.title}>
              <span className="eyebrow">{guide.index}</span>
              <strong>{guide.title}</strong>
              <p>{guide.summary}</p>
              <Link className="text-link" href={guide.href}>
                {guide.action} <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell" id="entretien">
        <div className="editorial-grid">
          <div>
            <p className="eyebrow">Entretien courant</p>
            <h2>Quatre habitudes simples.</h2>
          </div>
          <div className="article-steps">
            {maintenanceSteps.map((step) => (
              <article className="article-step" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell" id="installation">
        <p className="notice" role="note">
          <strong>Document technique à remettre en contexte.</strong> Le guide
          d’installation offert par Boulet est un document APCHQ/AVFQ mis à jour
          en 2015. Confirmez les codes, normes et instructions du fabricant en
          vigueur avant les travaux.
        </p>
        <div className="button-row">
          <a
            className="text-link"
            href="/documents/conseils-entretien-boulet.pdf"
          >
            Guide d’entretien PDF <span aria-hidden="true">↗</span>
          </a>
          <a
            className="text-link"
            href="/documents/guide-installation-fenetres-apchq-avfq-2015.pdf"
          >
            Guide d’installation PDF <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
