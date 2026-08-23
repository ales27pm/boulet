import Link from "next/link";
import { blogHighlights } from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Blogue",
  description:
    "Parcourez les publications Boulet sur la planification, l’entretien, l’installation et le confort résidentiel.",
  path: "/blogue",
});

export default function BlogPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Blogue</span>
          </nav>
          <h1>
            Des repères pour <em>mieux préparer la suite.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Les treize blocs de l’archive Boulet sont regroupés ici: douze
            publications datées et une collection vidéo, avec un chemin local
            lorsque la ressource a déjà été intégrée au site.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/guides">
              Consulter les guides <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell editorial-grid">
          <div>
            <p className="eyebrow">Dans les archives</p>
            <h2>À lire selon votre étape.</h2>
          </div>
          <div className="article-steps">
            {blogHighlights.map((post) => (
              <article className="article-step" key={`${post.date}-${post.title}`}>
                <p className="eyebrow">
                  {post.theme} ·{" "}
                  {post.isoDate ? (
                    <time dateTime={post.isoDate}>{post.date}</time>
                  ) : (
                    post.date
                  )}
                </p>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                {post.href.startsWith("/") ? (
                  <Link className="text-link" href={post.href}>
                    Consulter la ressource <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <a className="text-link" href={post.href}>
                    Retrouver la publication <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <p className="notice" role="note">
          <strong>Archives éditoriales.</strong> Les dates ci-dessus sont celles
          affichées par Boulet. Les liens sociaux restent externes et les
          anciennes références techniques ou financières sont redirigées vers
          une ressource locale qui rappelle de vérifier les sources actuelles.
        </p>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Besoin d’un repère pratique?</p>
          <h2>Regroupez les guides d’achat, d’entretien et d’installation.</h2>
          <Link className="button button-coral" href="/guides">
            Voir les guides <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
