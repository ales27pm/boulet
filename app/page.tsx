import Image from "next/image";
import Link from "next/link";
import { GuidanceFigure } from "./components/GuidanceFigure";
import { productFamilies, projects, stats } from "./site-data";

export default function Home() {
  return (
    <main id="contenu">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Manufacturier québécois · Sorel-Tracy</p>
          <h1>
            Pensées ici.
            <br />
            Fabriquées ici.
            <br />
            <em>Installées pour durer.</em>
          </h1>
          <p className="hero-intro">
            Des ouvertures à la mesure de votre maison — avec une équipe qui
            conseille, mesure, fabrique et installe.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/soumission">
              Préparer ma demande <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href="/produits">
              Explorer les produits <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <figure className="hero-media">
          <div className="hero-photo">
            <Image
              src="/images/realisation-mes.webp"
              alt="Maison contemporaine avec fenêtres, porte et portes de garage noires"
              width={1200}
              height={800}
              priority
            />
          </div>
          <figcaption>
            <span>Votre projet, de A à Z</span>
            Prise de mesures · Fabrication · Installation
          </figcaption>
        </figure>
        <ul className="hero-proof" aria-label="Points de confiance">
          <li>Fabrication 100 % québécoise</li>
          <li>Produits ENERGY STAR offerts</li>
          <li>Licence RBQ 8246-5071-36</li>
        </ul>
      </section>

      <section className="stats-band" aria-label="Boulet en chiffres">
        <div className="shell stats-grid">
          {stats.map((stat) => (
            <div key={stat.value}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section shell opening-statement">
        <div>
          <p className="eyebrow">Bien choisir ses fenêtres</p>
          <h2>Comparez selon la pièce et l’usage.</h2>
        </div>
        <div>
          <p className="large-copy">
            Battant, auvent, coulissante ou guillotine : chaque type de fenêtre
            s’ouvre, ventile et s’intègre différemment à la pièce.
          </p>
          <p>
            Le vitrage, l’intercalaire et la configuration complète influencent
            aussi le rendement final. Notre équipe vous aide à faire les bons
            choix pour votre maison.
          </p>
        </div>
      </section>

      <section className="section products-section" id="produits">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Quatre familles de produits</p>
            <h2>Comparez selon votre projet.</h2>
            <p className="asset-disclosure" id="product-inspiration-note">
              Images d’inspiration — aucun modèle précis ni aucune réalisation
              client ne sont représentés; dimensions, vitrage et finitions à
              confirmer.
            </p>
          </div>
          <Link className="text-link" href="/produits">
            Comparer toutes les options <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          className="shell product-grid"
          aria-describedby="product-inspiration-note"
        >
          {productFamilies.map((family) => (
            <article className="product-card" key={family.id}>
              <Link href={`/produits#${family.id}`}>
                <div className="product-image-wrap">
                  <Image
                    src={family.conceptImage}
                    alt={family.conceptImageAlt}
                    width={1122}
                    height={1402}
                  />
                  <span className="product-index">{family.index}</span>
                  <span
                    className="product-inspiration-badge"
                    aria-hidden="true"
                  >
                    Image d’inspiration
                  </span>
                </div>
                <div className="product-card-copy">
                  <p>{family.note}</p>
                  <h3>{family.title}</h3>
                  <span className="circle-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section process-section" id="methode">
        <div className="shell process-grid">
          <div className="process-intro">
            <p className="eyebrow eyebrow-light">
              De la prise de mesures à l’installation
            </p>
            <h2>Voici comment le projet avance.</h2>
            <p>
              Notre équipe précise vos besoins, prend les mesures, fabrique sur
              mesure à Sorel-Tracy et installe.
            </p>
            <GuidanceFigure
              className="process-visual"
              src="/images/custom/process-measure-v1.webp"
              alt="Mise en scène illustrative d’une prise de mesures avant le remplacement d’une fenêtre"
              caption="Personne et lieu fictifs; cette scène explique une étape du processus."
            />
          </div>
          <ol className="process-list">
            <li>
              <span>01</span>
              <div>
                <h3>Comprendre</h3>
                <p>Style de maison, inconforts actuels, priorités et budget.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Mesurer</h3>
                <p>Ouvertures, contraintes du bâtiment et conditions de pose.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Fabriquer</h3>
                <p>Configuration sur mesure dans l’usine de Sorel-Tracy.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <h3>Installer</h3>
                <p>Pose, ajustements et explications pour la suite.</p>
              </div>
            </li>
          </ol>
          <Link className="button button-light process-cta" href="/soumission">
            Préparer ma demande <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="section shell proof-section">
        <div className="proof-image">
          <Image
            src="/images/realisation-paris-freres.webp"
            alt="Projet multirésidentiel avec produits Boulet à Trois-Rivières"
            width={1200}
            height={800}
          />
          <p>Les Habitations Paris &amp; Frères · Trois-Rivières</p>
        </div>
        <div className="proof-copy">
          <p className="eyebrow">Trois générations</p>
          <h2>Une entreprise familiale à Sorel-Tracy depuis 1976.</h2>
          <p>
            Fondée par Eddy Boulet, l’entreprise compte aujourd’hui plus de 120
            membres d’équipe et plus de 100 000 pi² consacrés à la fabrication,
            au développement de produits et au service.
          </p>
          <div className="assurance-grid">
            <div>
              <strong>25 ans</strong>
              <span>sur certaines composantes PVC et aluminium*</span>
            </div>
            <div>
              <strong>10 ans</strong>
              <span>sur plusieurs thermos et éléments de quincaillerie*</span>
            </div>
          </div>
          <p className="fine-print">
            * Selon le produit, l’usage et les conditions de la garantie limitée.
          </p>
          <div className="button-row">
            <Link className="text-link" href="/entreprise">
              Découvrir notre histoire <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href="/service">
              Accéder à l’après-vente <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section projects-section">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Voir le résultat, pas seulement le produit</p>
            <h2>Réalisations d’ici.</h2>
          </div>
          <Link className="text-link" href="/realisations">
            Voir les projets <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="shell project-strip">
          {projects.map((project, index) => (
            <figure className={index === 1 ? "project-featured" : ""} key={project.title}>
              <Image
                src={project.image}
                alt={project.alt}
                width={1200}
                height={800}
              />
              <figcaption>
                <span>{project.type}</span>
                <strong>{project.title}</strong>
                <small>{project.location}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="quote-banner quote-banner-home"
        aria-labelledby="quote-home-title"
      >
        <div className="shell quote-banner-inner quote-conversation">
          <div className="quote-conversation-copy">
            <p className="eyebrow eyebrow-light">
              Un projet de portes ou de fenêtres?
            </p>
            <h2 id="quote-home-title">Commencez avec ce que vous savez déjà.</h2>
            <p className="quote-conversation-intro">
              Dites-nous s’il s’agit d’une rénovation ou d’une construction
              neuve, ce qui compte pour vous et quand vous aimeriez réaliser les
              travaux. Les plans et les photos restent optionnels.
            </p>
            <div className="button-row">
              <Link className="button button-coral" href="/soumission">
                Préparer ma demande <span aria-hidden="true">→</span>
              </Link>
              <a className="text-link text-link-light" href="tel:+14507429424">
                Appeler au 450 742-9424
              </a>
            </div>
          </div>
          <aside
            className="quote-starting-points"
            aria-labelledby="quote-starting-title"
          >
            <h3 id="quote-starting-title">Ce qui nous aide à vous répondre</h3>
            <ul>
              <li>
                <strong>Votre projet</strong>
                <span>Rénovation ou construction neuve</span>
              </li>
              <li>
                <strong>Vos priorités</strong>
                <span>Inconforts, résultat souhaité et échéancier</span>
              </li>
              <li>
                <strong>Ce que vous avez</strong>
                <span>Quantités, dimensions, plans ou photos, si disponibles</span>
              </li>
            </ul>
            <p>Pas besoin d’avoir tout décidé.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
