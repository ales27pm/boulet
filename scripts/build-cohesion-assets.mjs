import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const sourceDirectory = path.resolve("source-assets/visual-cohesion");
const defaultSourcePaths = [
  "realisation-mes.png",
  "realisation-paris-freres.png",
  "realisation-capricor.png",
  "product-windows-concept-v1.png",
  "product-entry-concept-v1.png",
  "product-patio-concept-v1.png",
  "product-garage-concept-v1.png",
  "process-measure-v1.png",
  "guide-materials-v1.png",
  "service-documentation-v1.png",
  "quote-preparation-v1.png",
  "social-card-backdrop.png",
].map((filename) => path.join(sourceDirectory, filename));

const argumentsList = process.argv.slice(2);
const checkOnly = argumentsList.includes("--check");
const explicitSourcePaths = argumentsList.filter(
  (argument) => argument !== "--check",
);
const sourcePaths =
  explicitSourcePaths.length === 0 ? defaultSourcePaths : explicitSourcePaths;

if (sourcePaths.length !== 12) {
  throw new Error(
    "Expected twelve approved masters: three editorial projects, eight marketing scenes, and one social backdrop.",
  );
}

const editorialDirectory = path.resolve("public/images/editorial");
const customDirectory = path.resolve("public/images/custom");

if (!checkOnly) {
  await Promise.all([
    fs.mkdir(editorialDirectory, { recursive: true }),
    fs.mkdir(customDirectory, { recursive: true }),
  ]);
}

const editorialAssets = [
  ["realisation-mes-v2.webp", sourcePaths[0]],
  ["realisation-paris-freres-v2.webp", sourcePaths[1]],
  ["realisation-capricor-v2.webp", sourcePaths[2]],
];

const marketingAssets = [
  ["product-windows-concept-v1.webp", sourcePaths[3]],
  ["product-entry-concept-v1.webp", sourcePaths[4]],
  ["product-patio-concept-v1.webp", sourcePaths[5]],
  ["product-garage-concept-v1.webp", sourcePaths[6]],
  ["process-measure-v1.webp", sourcePaths[7]],
  ["guide-materials-v1.webp", sourcePaths[8]],
  ["service-documentation-v1.webp", sourcePaths[9]],
  ["quote-preparation-v1.webp", sourcePaths[10]],
];

async function assertOrWrite(outputPath, contents) {
  if (!checkOnly) {
    await fs.writeFile(outputPath, contents);
    return;
  }

  let current;
  try {
    current = await fs.readFile(outputPath);
  } catch {
    throw new Error(
      `Missing cohesive asset: ${path.relative(process.cwd(), outputPath)}`,
    );
  }

  if (!current.equals(contents)) {
    throw new Error(
      `Stale cohesive asset: ${path.relative(process.cwd(), outputPath)}`,
    );
  }
}

await Promise.all([
  ...editorialAssets.map(async ([filename, source]) => {
    const contents = await sharp(source)
      .rotate()
      .webp({ quality: 86, effort: 6, smartSubsample: true })
      .toBuffer();
    await assertOrWrite(path.join(editorialDirectory, filename), contents);
  }),
  ...marketingAssets.map(async ([filename, source]) => {
    const contents = await sharp(source)
      .rotate()
      .webp({ quality: 84, effort: 6, smartSubsample: true })
      .toBuffer();
    await assertOrWrite(path.join(customDirectory, filename), contents);
  }),
]);

const logo = await sharp("public/images/brand/boulet-wordmark-color.png")
  .resize({ width: 405, withoutEnlargement: true })
  .png()
  .toBuffer();

const socialOverlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="525" height="630" fill="#e7e8ea" fill-opacity="0.96"/>
    <rect x="64" y="201" width="68" height="6" rx="3" fill="#ef1115"/>
    <text x="64" y="286" fill="#1a4c9a" font-family="Georgia, 'Times New Roman', serif" font-size="54">
      <tspan x="64" dy="0">Pensées ici.</tspan>
      <tspan x="64" dy="61">Fabriquées ici.</tspan>
    </text>
    <text x="64" y="432" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="1.2">
      PORTES · FENÊTRES · INSTALLATION
    </text>
    <text x="64" y="484" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="19">
      Sorel-Tracy · Depuis 1976
    </text>
    <text x="64" y="576" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="0.65">
      IMAGE D’INSPIRATION · AUCUNE RÉALISATION CLIENT
    </text>
  </svg>
`);

const socialCard = await sharp(sourcePaths[11])
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([
    { input: socialOverlay, top: 0, left: 0 },
    { input: logo, top: 54, left: 64 },
  ])
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toBuffer();

await assertOrWrite(
  path.join(customDirectory, "social-card-v2.jpg"),
  socialCard,
);

console.log(
  checkOnly
    ? "Verified the approved cohesive editorial, marketing, and social assets."
    : "Built the approved cohesive editorial, marketing, and social assets.",
);
