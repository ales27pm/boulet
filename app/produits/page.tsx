import type { Metadata } from "next";
import Image from "next/image";
import { SiteLink as Link } from "../components/SiteLink";
import { productFamilies, windowStyles } from "../site-data";

export const metadata: Metadata = {
  title: "Portes et fenêtres",
  description:
    "Comparez fenêtres, portes d’entrée, portes patio et portes de garage selon l’usage, le matériau et la performance recherchée.",
};

export default function ProductsPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Produits</span>
          </nav>
          <h1>
            Une ouverture pour <em>chaque manière d’habiter.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Commencez par l’usage et le confort recherché. La matière, le
            vitrage et les options viennent ensuite — avec un conseiller pour
            valider la bonne configuration.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/soumission">
              Cadrer mon projet
            </Link>
          </div>
        </div>
      </header>

      <section className="page-band">
        <div className="shell family-list">
          {productFamilies.map((family) => (
            <article className="family-row" id={family.id} key={family.id}>
              <span className="family-index">{family.index}</span>
              <div className="family-copy">
                <p className="eyebrow">{family.note}</p>
                <h2>{family.title}</h2>
                <p>{family.description}</p>
                <div className="button-row">
                  <a className="text-link" href={family.officialHref}>
                    Voir le catalogue détaillé <span aria-hidden="true">↗</span>
                  </a>
                  <Link className="text-link" href="/soumission">
                    Demander conseil <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <Image
                src={family.image}
                alt={family.imageAlt}
                width={435}
                height={847}
              />
            </article>
          ))}
        </div>
      </section>

      <section
        className="section shell window-choice"
        aria-labelledby="window-choice-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Fenêtres: quatre mouvements</p>
            <h2 id="window-choice-title">Le bon geste pour la bonne pièce.</h2>
          </div>
          <Link className="text-link" href="/conseils">
            Lire le guide d’achat <span aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="decision-map">
          <div className="decision-prompt">
            <span aria-hidden="true">Point de départ</span>
            <p>Quelle priorité décrit le mieux votre situation?</p>
          </div>
          <div className="decision-connector" aria-hidden="true" />
          <dl className="decision-grid">
            {windowStyles.map((style, index) => (
              <div className="decision-option" key={style.name}>
                <span className="decision-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <dt>{style.bestFor}</dt>
                <dd>
                  <h3>{style.name}</h3>
                  <p>{style.description}</p>
                </dd>
              </div>
            ))}
          </dl>
          <figcaption className="decision-caption">
            <p>
              Le vitrage, l’intercalaire et la configuration complète
              influencent aussi le rendement final.
            </p>
            <Link className="button button-dark" href="/soumission">
              Demander conseil <span aria-hidden="true">↗</span>
            </Link>
          </figcaption>
        </figure>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Vous n’avez pas à choisir seul</p>
          <h2>Apportez-nous vos priorités. Nous bâtirons la configuration.</h2>
          <Link className="button button-coral" href="/soumission">
            Préparer ma soumission <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
