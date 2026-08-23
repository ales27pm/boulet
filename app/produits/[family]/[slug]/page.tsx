import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogImagePath } from "../../../catalog-images";
import {
  catalogCapturedAt,
  catalogProducts,
  getCatalogProduct,
  getProductsByFamily,
} from "../../../catalog-data";
import {
  catalogFamilyPresentation,
  familyHref,
  isCatalogFamilyId,
  productHref,
} from "../../catalog-presentation";
import { absoluteUrl, safeJsonLd } from "../../../seo";

interface ProductPageProps {
  readonly params: Promise<{ family: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogProducts.map((product) => ({
    family: product.family,
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { family, slug } = await params;
  const product = getCatalogProduct(slug);

  if (!product || !isCatalogFamilyId(family) || product.family !== family) {
    return { title: "Produit introuvable" };
  }

  const canonical = productHref(product.family, product.slug);

  return {
    title: `${product.name} — ${catalogFamilyPresentation[product.family].label}`,
    description: product.summary || `Consultez la fiche ${product.name}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: product.name,
      description: product.summary || `Consultez la fiche ${product.name}.`,
      url: canonical,
      images: product.gallery.slice(0, 4).map((image) => ({
        url: catalogImagePath(image, 1440),
        alt: product.imageAlt || product.name,
      })),
    },
  };
}

export default async function CatalogProductPage({ params }: ProductPageProps) {
  const { family, slug } = await params;
  const product = getCatalogProduct(slug);

  if (!product || !isCatalogFamilyId(family) || product.family !== family) {
    notFound();
  }

  const familyPresentation = catalogFamilyPresentation[product.family];
  const relatedProducts = getProductsByFamily(product.family)
    .filter((candidate) => candidate.id !== product.id)
    .sort((left, right) => {
      const leftMatch = left.subcategory === product.subcategory ? 0 : 1;
      const rightMatch = right.subcategory === product.subcategory ? 0 : 1;
      return leftMatch - rightMatch || left.name.localeCompare(right.name, "fr-CA");
    })
    .slice(0, 3);
  const canonicalUrl = absoluteUrl(productHref(product.family, product.slug));
  const capturedAtLabel = new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${catalogCapturedAt}T12:00:00Z`));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: product.name,
    ...(product.summary ? { description: product.summary } : {}),
    image: product.gallery.map(
      (image) => absoluteUrl(catalogImagePath(image, 1440)),
    ),
    brand: {
      "@type": "Brand",
      name: "Boulet",
    },
    category: `${familyPresentation.label} — ${product.subcategory}`,
    productID: String(product.id),
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <main id="contenu">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(productJsonLd),
        }}
      />

      <header className="shell product-detail-hero">
        <div className="product-detail-heading">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/produits">Produits</Link>
            <span aria-hidden="true">/</span>
            <Link href={familyHref(product.family)}>
              {familyPresentation.label}
            </Link>
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </nav>
          <p className="eyebrow">{product.subcategory}</p>
          <h1>{product.name}</h1>
          {product.summary && (
            <p className="product-detail-summary">{product.summary}</p>
          )}
          <div className="button-row">
            <Link
              className="button button-dark"
              href={`/soumission?produit=${encodeURIComponent(product.slug)}`}
            >
              Inclure dans ma demande
            </Link>
            <a className="text-link" href="#caracteristiques">
              Lire la fiche <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <figure className="product-detail-primary-media">
          <Image
            src={catalogImagePath(product.image, 1440)}
            alt={product.imageAlt || product.name}
            width={1200}
            height={1200}
            priority
            sizes="(max-width: 820px) 92vw, 52vw"
          />
          <figcaption>
            Visuel officiel associé à la fiche {product.name}.
          </figcaption>
        </figure>
      </header>

      <section
        className="section page-band"
        id="caracteristiques"
        aria-labelledby="features-title"
      >
        <div className="shell product-detail-information">
          <div className="product-detail-features">
            <p className="eyebrow">Description consignée</p>
            <h2 id="features-title">Caractéristiques de la fiche.</h2>
            {product.features.length > 0 ? (
              <ul className="product-feature-list">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            ) : (
              <p className="catalog-missing-detail">
                La fiche source ne comportait pas de liste de caractéristiques
                détaillées. Boulet pourra confirmer les options applicables à
                votre projet.
              </p>
            )}
          </div>

          <div className="product-detail-specifications">
            <p className="eyebrow">Données structurées</p>
            <h2>Spécifications publiées.</h2>
            {product.specs.length > 0 ? (
              <dl className="product-spec-list">
                {product.specs.map((specification) => (
                  <div key={`${specification.label}-${specification.value}`}>
                    <dt>{specification.label}</dt>
                    <dd>{specification.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="catalog-missing-detail">
                Aucune spécification structurée n’était publiée sur la fiche
                source lors de la capture.
              </p>
            )}
          </div>
        </div>
      </section>

      {product.gallery.length > 1 && (
        <section
          className="section shell product-gallery"
          aria-labelledby="gallery-title"
        >
          <div className="section-heading horizontal-heading">
            <div>
              <p className="eyebrow">Galerie officielle</p>
              <h2 id="gallery-title">Voir les vues disponibles.</h2>
            </div>
            <p>
              {product.gallery.length} images dans la fiche source, dont la vue
              principale ci-dessus.
            </p>
          </div>
          <ul className="product-gallery-grid">
            {product.gallery.slice(1).map((image, index) => (
              <li key={image}>
                <figure>
                  <Image
                    src={catalogImagePath(image, 1440)}
                    alt={`${product.name}, vue ${index + 2} sur ${product.gallery.length}`}
                    width={960}
                    height={960}
                    loading="lazy"
                    sizes="(max-width: 560px) 92vw, (max-width: 1000px) 46vw, 30vw"
                  />
                  <figcaption>
                    {String(index + 2).padStart(2, "0")} / {product.gallery.length}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside className="shell catalog-provenance" aria-labelledby="source-title">
        <div>
          <p className="eyebrow">Traçabilité</p>
          <h2 id="source-title">Une fiche reliée à sa source.</h2>
        </div>
        <div>
          <p>
            Le texte, la classification et les visuels de cette page ont été
            capturés dans le catalogue Boulet le{" "}
            <time dateTime={catalogCapturedAt}>{capturedAtLabel}</time>. Aucun
            prix, état de stock ou niveau de performance n’est déduit de ces
            données.
          </p>
          <Link className="text-link" href="/credits">
            Consulter les crédits et la méthode de migration{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>

      {relatedProducts.length > 0 && (
        <section
          className="section products-section"
          aria-labelledby="related-title"
        >
          <div className="shell">
            <div className="section-heading horizontal-heading">
              <div>
                <p className="eyebrow">Même famille</p>
                <h2 id="related-title">Poursuivre la comparaison.</h2>
              </div>
              <Link className="text-link" href={familyHref(product.family)}>
                Toute la famille <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="catalog-product-grid catalog-related-grid">
              {relatedProducts.map((related) => (
                <li className="catalog-product-card" key={related.id}>
                  <Link href={productHref(related.family, related.slug)}>
                    <div className="catalog-product-media">
                      <Image
                        src={catalogImagePath(related.image, 720)}
                        alt=""
                        width={760}
                        height={760}
                        loading="lazy"
                        sizes="(max-width: 560px) 92vw, (max-width: 1000px) 46vw, 30vw"
                      />
                    </div>
                    <div className="catalog-product-copy">
                      <p>{related.subcategory}</p>
                      <h3>{related.name}</h3>
                      <span className="catalog-card-action">
                        Voir la fiche <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Passer de la fiche au projet</p>
          <h2>Faites valider la configuration qui convient à votre ouverture.</h2>
          <Link
            className="button button-coral"
            href={`/soumission?produit=${encodeURIComponent(product.slug)}`}
          >
            Ajouter {product.name} à ma demande <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
