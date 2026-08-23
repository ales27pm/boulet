import Link from "next/link";
import { MediaFrame } from "../components/MediaFrame";
import { officialGallery, realisationProjects } from "../realisations-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Réalisations",
  description:
    "Découvrez des réalisations Boulet à Trois-Rivières, Varennes et Sorel-Tracy: rénovation, construction neuve et multirésidentiel.",
  path: "/realisations",
});

export default function ProjectsPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Réalisations</span>
          </nav>
          <h1>
            Des maisons qui laissent <em>entrer plus que la lumière.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Projets nommés et galerie d’archives sont maintenant réunis ici.
            Chaque image provient de la galerie officielle Boulet; aucune
            configuration technique n’est déduite de la photographie.
          </p>
          <p className="catalog-summary" aria-label="Contenu de la galerie">
            <strong>{realisationProjects.length}</strong> projets documentés ·{" "}
            <strong>{officialGallery.length}</strong> vues d’archives
          </p>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Projets identifiés</p>
            <h2>Un lieu, une équipe, une façade.</h2>
          </div>
          <Link className="text-link" href="/credits">
            Consulter les crédits de la galerie{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="shell project-catalog-grid">
          {realisationProjects.map((project, index) => (
            <article className="project-catalog-card" key={project.slug}>
              <Link href={`/realisations/${project.slug}`}>
                <span className="project-catalog-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <MediaFrame
                  alt={project.imageAlt}
                  height={800}
                  mediaRole="project"
                  sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                  src={project.image}
                  width={1200}
                />
                <span className="project-catalog-copy">
                  <strong>{project.title}</strong>
                  <span>{project.location}</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell opening-statement">
        <div>
          <p className="eyebrow">Inspiration avec contexte</p>
          <h2>Imaginez la transformation.</h2>
        </div>
        <div>
          <p className="large-copy">
            Les photographies montrent des contextes réels, mais elles ne
            suffisent pas à identifier le modèle, le vitrage ou la performance
            d’un produit. Utilisez-les pour préciser une direction, puis faites
            confirmer chaque choix.
          </p>
          <div className="button-row">
            <Link className="text-link" href="/soumission">
              Discuter de ma maison <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section page-band" aria-labelledby="archive-title">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Galerie d’archives</p>
            <h2 id="archive-title">Toutes les vues publiées.</h2>
          </div>
          <p className="section-heading-note">
            Série officielle capturée le 23 août 2026.
          </p>
        </div>
        <div className="shell archive-gallery">
          {officialGallery.map((item, index) => (
            <MediaFrame
              alt={item.imageAlt}
              caption={`Vue ${String(index + 1).padStart(2, "0")}`}
              height={560}
              key={item.id}
              mediaRole="project"
              sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 33vw"
              src={item.image}
              width={840}
            />
          ))}
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Le prochain projet pourrait être le vôtre</p>
          <h2>Une façade plus juste commence par une conversation claire.</h2>
          <Link className="button button-coral" href="/soumission">
            Commencer mon projet <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
