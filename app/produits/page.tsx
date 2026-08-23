import Link from "next/link";
import { catalogFamilies, catalogProducts } from "../catalog-data";
import { createPageMetadata } from "../seo";
import CatalogExplorer from "./CatalogExplorer";
import {
  catalogFamilyPresentation,
  familyHref,
  toCatalogExplorerProduct,
} from "./catalog-presentation";

export const metadata = createPageMetadata({
  title: "Catalogue de portes et fenêtres",
  description:
    "Explorez les 54 fiches du catalogue Boulet: fenêtres, portes d’entrée, portes patio et portes de garage.",
  path: "/produits",
});

export default function ProductsPage() {
  const explorerProducts = catalogProducts.map(toCatalogExplorerProduct);
  const subcategoriesByFamily = Object.fromEntries(
    catalogFamilies.map((family) => [
      family.id,
      Array.from(
        new Set(
          catalogProducts
            .filter((product) => product.family === family.id)
            .map((product) => product.subcategory),
        ),
      ),
    ]),
  ) as Record<(typeof catalogFamilies)[number]["id"], string[]>;

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
            Le catalogue, <em>sans détour.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Cinquante-quatre fiches issues du catalogue officiel Boulet,
            regroupées par famille, type et collection pour rendre la
            comparaison plus simple.
          </p>
          <div className="button-row">
            <a className="button button-dark" href="#explorer-catalogue">
              Explorer les produits
            </a>
            <Link className="text-link" href="/soumission">
              Parler de mon projet <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="page-band section" aria-labelledby="families-title">
        <div className="shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="eyebrow">Quatre familles</p>
              <h2 id="families-title">Choisir le bon point de départ.</h2>
            </div>
            <p className="catalog-intro-note">
              Les quantités reflètent l’inventaire éditorial capturé dans le
              catalogue; elles ne constituent pas une indication de stock.
            </p>
          </div>

          <ol className="catalog-family-grid">
            {catalogFamilies.map((family, index) => {
              const presentation = catalogFamilyPresentation[family.id];
              const subcategories = subcategoriesByFamily[family.id];

              return (
                <li className="catalog-family-card" key={family.id}>
                  <span className="catalog-family-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow">{presentation.eyebrow}</p>
                  <h3>{presentation.label}</h3>
                  <p>{presentation.description}</p>
                  <dl className="catalog-family-facts">
                    <div>
                      <dt>Fiches</dt>
                      <dd>{family.productCount}</dd>
                    </div>
                    <div>
                      <dt>Types représentés</dt>
                      <dd>{subcategories.length}</dd>
                    </div>
                  </dl>
                  <p className="catalog-family-taxonomy">
                    <span className="sr-only">Types: </span>
                    {subcategories.join(" · ")}
                  </p>
                  <Link className="text-link" href={familyHref(family.id)}>
                    Voir la famille <span aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section
        className="section shell catalog-comparison"
        aria-labelledby="comparison-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Repères comparables</p>
          <h2 id="comparison-title">Ce que couvre chaque famille.</h2>
        </div>
        <div className="catalog-comparison-table-wrap">
          <table className="catalog-comparison-table">
            <caption className="sr-only">
              Comparaison du contenu des quatre familles du catalogue
            </caption>
            <thead>
              <tr>
                <th scope="col">Famille</th>
                <th scope="col">Fiches</th>
                <th scope="col">Classement disponible</th>
                <th scope="col">
                  <span className="sr-only">Consulter</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {catalogFamilies.map((family) => (
                <tr key={family.id}>
                  <th scope="row">
                    {catalogFamilyPresentation[family.id].label}
                  </th>
                  <td>{family.productCount}</td>
                  <td>{subcategoriesByFamily[family.id].join(", ")}</td>
                  <td>
                    <Link href={familyHref(family.id)}>
                      Ouvrir <span aria-hidden="true">→</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="section products-section"
        id="explorer-catalogue"
        aria-label="Explorateur du catalogue"
      >
        <div className="shell">
          <CatalogExplorer products={explorerProducts} families={catalogFamilies} />
        </div>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Après le repérage</p>
          <h2>Un conseiller peut valider la configuration de votre projet.</h2>
          <Link className="button button-coral" href="/soumission">
            Préparer ma soumission <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
