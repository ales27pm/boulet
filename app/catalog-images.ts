const catalogSourcePrefix = "/images/catalog/";
const catalogDeliveryPrefix = "/media/images/catalog-delivery/";

export const catalogImageWidths = [720, 1440] as const;

export type CatalogImageWidth = (typeof catalogImageWidths)[number];

/**
 * Resolve an official catalogue source identifier to its generated delivery asset.
 * The byte-for-byte originals live outside `public/` under `source-assets/catalog`;
 * only the deterministic WebP derivatives are published.
 *
 * Both widths are generated without enlarging the source. A nominal 1440w file
 * can therefore have fewer than 1440 physical pixels when the official source
 * is smaller; the stable URL still lets catalogue components use one srcset
 * contract for every product.
 */
export function catalogImagePath(
  source: string,
  width: CatalogImageWidth,
): string {
  if (!source.startsWith(catalogSourcePrefix)) {
    throw new Error(`Unsupported catalogue image path: ${source}`);
  }

  if (!catalogImageWidths.includes(width)) {
    throw new Error(`Unsupported catalogue image width: ${width}`);
  }

  const extensionIndex = source.lastIndexOf(".");
  if (extensionIndex <= catalogSourcePrefix.length) {
    throw new Error(`Catalogue image path has no extension: ${source}`);
  }

  const relativeStem = source.slice(catalogSourcePrefix.length, extensionIndex);
  return `${catalogDeliveryPrefix}${relativeStem}-${width}w.webp`;
}

export function catalogImageSrcSet(source: string): string {
  return catalogImageWidths
    .map((width) => `${catalogImagePath(source, width)} ${width}w`)
    .join(", ");
}
