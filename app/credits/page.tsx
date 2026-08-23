import Link from "next/link";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Crédits des contenus",
  description:
    "Sources et attribution des photographies, fiches produits et documents présentés dans le site Boulet.",
  path: "/credits",
});

export default function CreditsPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Crédits</span>
          </nav>
          <h1>
            Des sources identifiées, <em>sans confusion.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Le catalogue et les réalisations conservent une séparation nette
            entre les documents publiés par Boulet et les contenus éditoriaux
            qui les mettent en contexte.
          </p>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell cards-grid three-up">
          <article className="info-card">
            <p className="eyebrow">Identité</p>
            <h2>Marque Boulet</h2>
            <p>
              Le mot-symbole, les couleurs et les coordonnées appartiennent à
              Portes et Fenêtres Boulet et sont utilisés pour ce site officiel.
            </p>
          </article>
          <article className="info-card">
            <p className="eyebrow">Catalogue</p>
            <h2>Fiches et photographies de produits</h2>
            <p>
              Les noms, descriptions, classifications et images produits ont
              été repris des fiches Boulet. Chaque fiche locale conserve son
              chemin historique et la date de la capture utilisée pour la
              migration.
            </p>
          </article>
          <article className="info-card">
            <p className="eyebrow">Réalisations</p>
            <h2>Galerie de projets</h2>
            <p>
              Les noms de projets, lieux et photographies proviennent de la
              galerie Boulet. Aucun modèle ou détail technique n’est déduit
              d’une photographie.
            </p>
          </article>
        </div>
      </section>

      <section className="section shell">
        <div className="notice" role="note">
          <strong>Une attribution doit être corrigée?</strong>{" "}
          <Link href="/contact">Communiquez avec l’équipe</Link> en indiquant
          la page et le contenu concernés.
        </div>
      </section>
    </main>
  );
}
