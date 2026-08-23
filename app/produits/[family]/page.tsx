import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  catalogFamilies,
  getProductsByFamily,
} from "../../catalog-data";
import CatalogExplorer from "../CatalogExplorer";
import {
  catalogFamilyPresentation,
  familyHref,
  isCatalogFamilyId,
  toCatalogExplorerProduct,
} from "../catalog-presentation";
import { createPageMetadata } from "../../seo";

interface FamilyPageProps {
  readonly params: Promise<{ family: string }>;
  readonly searchParams: Promise<{ type?: string | string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogFamilies.map((family) => ({ family: family.id }));
}

export async function generateMetadata({
  params,
}: FamilyPageProps): Promise<Metadata> {
  const { family } = await params;

  if (!isCatalogFamilyId(family)) {
    return { title: "Famille de produits introuvable" };
  }

  const presentation = catalogFamilyPresentation[family];

  return createPageMetadata({
    title: `${presentation.label} — catalogue`,
    description: presentation.description,
    path: familyHref(family),
  });
}

export default async function CatalogFamilyPage({
  params,
  searchParams,
}: FamilyPageProps) {
  const { family } = await params;
  const { type } = await searchParams;

  if (!isCatalogFamilyId(family)) {
    notFound();
  }

  const products = getProductsByFamily(family);
  const presentation = catalogFamilyPresentation[family];
  const subcategories = Array.from(
    new Set(products.map((product) => product.subcategory)),
  );
  const requestedSubcategory = Array.isArray(type) ? type[0] : type;
  const initialSubcategory = subcategories.includes(requestedSubcategory ?? "")
    ? requestedSubcategory
    : undefined;

  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/produits">Produits</Link>
            <span aria-hidden="true">/</span>
            <span>{presentation.label}</span>
          </nav>
          <p className="eyebrow">{presentation.eyebrow}</p>
          <h1>
            {presentation.label}, <em>fiche par fiche.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>{presentation.description}</p>
          <p>{presentation.selectionPrompt}</p>
          <div className="button-row">
            <a className="button button-dark" href="#fiches-produits">
              Voir les {products.length} fiches
            </a>
            <Link className="text-link" href="/soumission">
              Demander conseil <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="page-band section" aria-labelledby="taxonomy-title">
        <div className="shell catalog-family-overview">
          <div>
            <p className="eyebrow">Structure de la famille</p>
            <h2 id="taxonomy-title">Des repères lisibles avant les détails.</h2>
          </div>
          <dl className="catalog-taxonomy-grid">
            {subcategories.map((subcategory, index) => {
              const count = products.filter(
                (product) => product.subcategory === subcategory,
              ).length;

              return (
                <div key={subcategory}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <dt>{subcategory}</dt>
                  <dd>
                    {count} fiche{count === 1 ? "" : "s"}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section
        className="section products-section"
        id="fiches-produits"
        aria-label={`Fiches de ${presentation.label.toLocaleLowerCase("fr-CA")}`}
      >
        <div className="shell">
          <CatalogExplorer
            products={products.map(toCatalogExplorerProduct)}
            families={catalogFamilies}
            initialFamily={family}
            initialSubcategory={initialSubcategory}
          />
        </div>
      </section>

      <nav className="section shell catalog-family-nav" aria-label="Autres familles">
        <p className="eyebrow">Continuer la comparaison</p>
        <ul>
          {catalogFamilies
            .filter((item) => item.id !== family)
            .map((item) => (
              <li key={item.id}>
                <Link href={familyHref(item.id)}>
                  {item.label} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Votre sélection en contexte</p>
          <h2>Validez les dimensions, options et contraintes avec Boulet.</h2>
          <Link className="button button-coral" href="/soumission">
            Commencer ma demande <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
