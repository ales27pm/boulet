import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRealisationProject,
  realisationProjects,
} from "../../realisations-data";
import { createPageMetadata } from "../../seo";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return realisationProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getRealisationProject(slug);
  if (!project) return {};

  return createPageMetadata({
    title: `${project.title} — ${project.location}`,
    description: `${project.note} Découvrez la photographie et préparez votre propre projet avec l’équipe Boulet.`,
    path: `/realisations/${project.slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getRealisationProject(slug);
  if (!project) notFound();

  return (
    <main id="contenu">
      <header className="project-detail-hero shell">
        <nav className="breadcrumb" aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <Link href="/realisations">Réalisations</Link>
          <span aria-hidden="true">/</span>
          <span>{project.title}</span>
        </nav>
        <div className="project-detail-heading">
          <p className="eyebrow">Projet publié par Boulet</p>
          <h1>{project.title}</h1>
          <p>{project.location}</p>
        </div>
        <figure className="project-detail-image">
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1000}
            sizes="100vw"
            priority
          />
          <figcaption>{project.note}</figcaption>
        </figure>
      </header>

      <section className="section shell project-detail-context">
        <div>
          <p className="eyebrow">Lire une photographie avec prudence</p>
          <h2>Une référence visuelle, pas une fiche technique.</h2>
        </div>
        <div>
          <p className="large-copy">
            Cette page conserve le nom, le lieu et l’image publiés par Boulet.
            Le modèle, les dimensions, les options, le vitrage et la
            disponibilité doivent être confirmés pour votre projet.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/soumission">
              Préparer mon projet
            </Link>
            <Link className="text-link" href="/credits">
              Voir les crédits de la galerie <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Comparer avant de décider</p>
          <h2>Explorez les produits derrière votre propre composition.</h2>
          <Link className="button button-coral" href="/produits">
            Ouvrir le catalogue <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
