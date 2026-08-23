"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { catalogImagePath } from "../catalog-images";
import type {
  CatalogFamily,
  CatalogFamilyId,
} from "../catalog-data";
import {
  type CatalogExplorerProduct,
  catalogFamilyPresentation,
  normalizeCatalogSearch,
  productHref,
} from "./catalog-presentation";

interface CatalogExplorerProps {
  readonly products: readonly CatalogExplorerProduct[];
  readonly families: readonly CatalogFamily[];
  readonly initialFamily?: CatalogFamilyId;
  readonly initialSubcategory?: string;
  readonly headingLevel?: "h2" | "h3";
}

export default function CatalogExplorer({
  products,
  families,
  initialFamily,
  initialSubcategory,
  headingLevel = "h2",
}: CatalogExplorerProps) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<CatalogFamilyId | "all">(
    initialFamily ?? "all",
  );
  const [subcategory, setSubcategory] = useState(
    initialSubcategory ?? "all",
  );
  const queryId = useId();
  const familyId = useId();
  const subcategoryId = useId();
  const resultId = useId();

  const subcategories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .filter(
              (product) => family === "all" || product.family === family,
            )
            .map((product) => product.subcategory),
        ),
      ).sort((left, right) => left.localeCompare(right, "fr-CA")),
    [family, products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeCatalogSearch(query);

    return products.filter((product) => {
      const matchesFamily = family === "all" || product.family === family;
      const matchesSubcategory =
        subcategory === "all" || product.subcategory === subcategory;
      const matchesQuery =
        normalizedQuery.length === 0 || product.searchText.includes(normalizedQuery);

      return matchesFamily && matchesSubcategory && matchesQuery;
    });
  }, [family, products, query, subcategory]);

  const Heading = headingLevel;

  return (
    <div className="catalog-explorer">
      <div className="catalog-filter-panel" aria-labelledby={resultId}>
        <div className="catalog-filter-heading">
          <p className="eyebrow">Catalogue Boulet</p>
          <Heading id={resultId}>Trouver une fiche produit</Heading>
        </div>

        <div className="catalog-filter-fields">
          <div className="catalog-filter-field catalog-filter-search">
            <label htmlFor={queryId}>Nom, matériau ou caractéristique</label>
            <input
              id={queryId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex. battant, PVC, verre clair"
              autoComplete="off"
            />
          </div>

          {!initialFamily && (
            <div className="catalog-filter-field">
              <label htmlFor={familyId}>Famille</label>
              <select
                id={familyId}
                value={family}
                onChange={(event) => {
                  setFamily(event.target.value as CatalogFamilyId | "all");
                  setSubcategory("all");
                }}
              >
                <option value="all">Toutes les familles</option>
                {families.map((catalogFamily) => (
                  <option key={catalogFamily.id} value={catalogFamily.id}>
                    {catalogFamily.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="catalog-filter-field">
            <label htmlFor={subcategoryId}>Type ou collection</label>
            <select
              id={subcategoryId}
              value={subcategory}
              onChange={(event) => setSubcategory(event.target.value)}
            >
              <option value="all">Tous les types</option>
              {subcategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="catalog-result-count" aria-live="polite" aria-atomic="true">
          {filteredProducts.length} résultat
          {filteredProducts.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <ul className="catalog-product-grid" aria-label="Résultats du catalogue">
          {filteredProducts.map((product, index) => (
            <li className="catalog-product-card" key={product.id}>
              <Link href={productHref(product.family, product.slug)}>
                <div className="catalog-product-media">
                  <Image
                    src={catalogImagePath(product.image, 720)}
                    alt=""
                    width={760}
                    height={760}
                    sizes="(max-width: 560px) 92vw, (max-width: 1000px) 46vw, 30vw"
                  />
                  <span className="catalog-product-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="catalog-product-copy">
                  <p>
                    {catalogFamilyPresentation[product.family].label}
                    <span aria-hidden="true"> · </span>
                    {product.subcategory}
                  </p>
                  <h3>{product.name}</h3>
                  <span className="catalog-card-action">
                    Voir la fiche <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="catalog-empty-state" role="status">
          <h3>Aucune fiche ne correspond à ces critères.</h3>
          <p>
            Essayez un autre mot ou revenez à « Tous les types » pour élargir
            les résultats.
          </p>
        </div>
      )}
    </div>
  );
}
