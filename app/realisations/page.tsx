import type { Metadata } from "next";
import Image from "next/image";
import { SiteLink as Link } from "../components/SiteLink";
import { officialSite, projects } from "../site-data";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Découvrez des réalisations Boulet à Trois-Rivières, Varennes et Sorel-Tracy: rénovation, construction neuve et multirésidentiel.",
};

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
            Rénovation sensible, construction contemporaine ou projet
            multirésidentiel: chaque façade révèle un équilibre différent entre
            proportions, performance et caractère.
          </p>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell gallery-grid">
          {projects.map((project) => (
            <figure className="gallery-card" key={project.title}>
              <Image
                src={project.image}
                alt={project.alt}
                width={1200}
                height={800}
              />
              <figcaption>
                <div>
                  <strong>{project.title}</strong>
                  <span>{project.type}</span>
                </div>
                <span>{project.location}</span>
              </figcaption>
            </figure>
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
            Les lignes noires structurent une façade. Une porte plus vitrée
            change l’accueil. Une ouverture mieux proportionnée rend la pièce
            plus généreuse.
          </p>
          <div className="button-row">
            <a className="text-link" href={`${officialSite}/content/15-nos-realisations`}>
              Parcourir la galerie complète <span aria-hidden="true">↗</span>
            </a>
            <Link className="text-link" href="/soumission">
              Discuter de ma maison <span aria-hidden="true">→</span>
            </Link>
          </div>
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
