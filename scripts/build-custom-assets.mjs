import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const sourcePaths = process.argv.slice(2);

if (sourcePaths.length !== 9) {
  throw new Error(
    "Expected nine Imagegen source paths: four products, four guidance scenes, and one social backdrop.",
  );
}

const outputDirectory = path.resolve("public/images/custom");
const webAssets = [
  ["product-windows-concept-v1.webp", sourcePaths[0]],
  ["product-entry-concept-v1.webp", sourcePaths[1]],
  ["product-patio-concept-v1.webp", sourcePaths[2]],
  ["product-garage-concept-v1.webp", sourcePaths[3]],
  ["process-measure-v1.webp", sourcePaths[4]],
  ["guide-materials-v1.webp", sourcePaths[5]],
  ["service-documentation-v1.webp", sourcePaths[6]],
  ["quote-preparation-v1.webp", sourcePaths[7]],
];

await Promise.all(
  webAssets.map(([filename, source]) =>
    sharp(source)
      .rotate()
      .webp({ quality: 84, effort: 6, smartSubsample: true })
      .toFile(path.join(outputDirectory, filename)),
  ),
);

const socialBackdrop = await sharp(sourcePaths[8])
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .toBuffer();

const logo = await sharp("public/images/boulet-wordmark.jpg")
  .resize({ width: 430, withoutEnlargement: true })
  .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
  .toBuffer();

const textOverlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="555" height="630" fill="#e7e8ea" fill-opacity="0.94"/>
    <rect x="64" y="202" width="64" height="7" rx="3.5" fill="#ef1115"/>
    <text x="64" y="282" fill="#1a4c9a" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">
      <tspan x="64" dy="0">Votre projet,</tspan>
      <tspan x="64" dy="58">de A à Z.</tspan>
    </text>
    <text x="64" y="430" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" letter-spacing="1.1">
      SOREL-TRACY · DEPUIS 1976
    </text>
    <text x="64" y="484" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="22">
      Conseils · Mesures · Fabrication · Installation
    </text>
    <text x="64" y="574" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600" letter-spacing="0.7">
      IMAGE D’INSPIRATION · MAISON FICTIVE
    </text>
  </svg>
`);

await sharp(socialBackdrop)
  .composite([
    { input: textOverlay, top: 0, left: 0 },
    { input: logo, top: 62, left: 64 },
  ])
  .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(path.join(outputDirectory, "og-custom-v1.jpg"));
