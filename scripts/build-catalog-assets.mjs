import { mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "source-assets/catalog");
const outputRoot = path.join(repoRoot, "public/images/catalog-delivery");
const catalogueDataPath = path.join(repoRoot, "app/catalog-data.ts");
const checkOnly = process.argv.slice(2).includes("--check");
const unexpectedArguments = process.argv
  .slice(2)
  .filter((argument) => argument !== "--check");
const sourceExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const widths = [720, 1440];
const webpOptions = {
  quality: 84,
  alphaQuality: 100,
  effort: 4,
  smartSubsample: true,
};
const generatorConcurrency = 4;

if (unexpectedArguments.length > 0) {
  throw new Error(`Unknown argument(s): ${unexpectedArguments.join(", ")}`);
}

async function walkFiles(root) {
  const files = [];

  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, "en"));

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
      } else if (entry.isFile()) {
        files.push(absolutePath);
      }
    }
  }

  await walk(root);
  return files;
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function derivativeRelativePath(sourceRelativePath, width) {
  const extension = path.posix.extname(sourceRelativePath);
  const stem = sourceRelativePath.slice(0, -extension.length);
  return `${stem}-${width}w.webp`;
}

function catalogueSourcePath(sourceRelativePath) {
  return `/images/catalog/${toPosix(sourceRelativePath)}`;
}

async function catalogueReferences() {
  const source = await readFile(catalogueDataPath, "utf8");
  const matches = source.matchAll(
    /["'](\/images\/catalog\/[^"']+\.(?:jpe?g|png|webp))["']/giu,
  );
  return new Set(Array.from(matches, (match) => match[1]));
}

async function inventory() {
  const sourceFiles = (await walkFiles(sourceRoot)).filter((file) =>
    sourceExtensions.has(path.extname(file).toLowerCase()),
  );
  const sources = sourceFiles.map((absolutePath) => ({
    absolutePath,
    relativePath: toPosix(path.relative(sourceRoot, absolutePath)),
  }));
  const expected = new Map();

  for (const source of sources) {
    for (const width of widths) {
      const relativePath = derivativeRelativePath(source.relativePath, width);
      expected.set(relativePath, {
        ...source,
        width,
        outputPath: path.join(outputRoot, relativePath),
      });
    }
  }

  return { sources, expected };
}

async function validateCatalogueReferences(sources) {
  const references = await catalogueReferences();
  const available = new Set(
    sources.map(({ relativePath }) => catalogueSourcePath(relativePath)),
  );
  const missingSources = [...references].filter((reference) => !available.has(reference));

  if (missingSources.length > 0) {
    throw new Error(
      `Catalogue data references ${missingSources.length} missing source image(s):\n${missingSources.join("\n")}`,
    );
  }

  return references.size;
}

async function outputFiles() {
  try {
    return await walkFiles(outputRoot);
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function validateOutputs(expected) {
  const actualFiles = await outputFiles();
  const actual = new Set(
    actualFiles.map((absolutePath) => toPosix(path.relative(outputRoot, absolutePath))),
  );
  const missing = [...expected.keys()].filter((relativePath) => !actual.has(relativePath));
  const stale = [...actual].filter((relativePath) => !expected.has(relativePath));
  const invalid = [];
  let outputBytes = 0;
  const sourceMetadata = new Map();

  for (const [relativePath, derivative] of expected) {
    if (!actual.has(relativePath)) continue;

    if (!sourceMetadata.has(derivative.absolutePath)) {
      sourceMetadata.set(
        derivative.absolutePath,
        await sharp(derivative.absolutePath).metadata(),
      );
    }
    const original = sourceMetadata.get(derivative.absolutePath);
    const orientationSwapsAxes =
      original.orientation !== undefined && original.orientation >= 5;
    const orientedSourceWidth = orientationSwapsAxes
      ? original.height
      : original.width;
    const expectedWidth = Math.min(
      derivative.width,
      orientedSourceWidth ?? derivative.width,
    );
    const [metadata, fileStat] = await Promise.all([
      sharp(derivative.outputPath).metadata(),
      stat(derivative.outputPath),
    ]);
    outputBytes += fileStat.size;

    if (
      metadata.format !== "webp" ||
      !metadata.width ||
      metadata.width !== expectedWidth ||
      metadata.orientation !== undefined
    ) {
      invalid.push(
        `${relativePath} (format=${metadata.format ?? "?"}, width=${metadata.width ?? "?"}, orientation=${metadata.orientation ?? "none"})`,
      );
    }
  }

  if (missing.length || stale.length || invalid.length) {
    const details = [
      missing.length ? `Missing (${missing.length}):\n${missing.join("\n")}` : "",
      stale.length ? `Stale (${stale.length}):\n${stale.join("\n")}` : "",
      invalid.length ? `Invalid (${invalid.length}):\n${invalid.join("\n")}` : "",
    ].filter(Boolean);
    throw new Error(details.join("\n\n"));
  }

  return outputBytes;
}

function formatBytes(bytes) {
  const units = ["B", "KiB", "MiB", "GiB"];
  let value = bytes;
  let unit = units[0];
  for (const candidate of units) {
    unit = candidate;
    if (value < 1024 || candidate === units.at(-1)) break;
    value /= 1024;
  }
  return `${value.toFixed(value >= 10 || unit === "B" ? 0 : 1)} ${unit}`;
}

async function build(expected) {
  sharp.cache(false);
  sharp.concurrency(1);

  await rm(outputRoot, { recursive: true, force: true });
  const derivatives = [...expected.values()];
  const outputDirectories = new Set(
    derivatives.map((derivative) => path.dirname(derivative.outputPath)),
  );
  await Promise.all(
    [...outputDirectories].map((directory) => mkdir(directory, { recursive: true })),
  );

  let cursor = 0;
  async function generateNext() {
    while (cursor < derivatives.length) {
      const derivative = derivatives[cursor];
      cursor += 1;

      await sharp(derivative.absolutePath, { failOn: "error" })
        .rotate()
        .toColourspace("srgb")
        .resize({
          width: derivative.width,
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp(webpOptions)
        .toFile(derivative.outputPath);
    }
  }

  await Promise.all(
    Array.from({ length: generatorConcurrency }, () => generateNext()),
  );
}

const { sources, expected } = await inventory();
const referenceCount = await validateCatalogueReferences(sources);
const sourceBytes = (
  await Promise.all(sources.map(({ absolutePath }) => stat(absolutePath)))
).reduce((total, fileStat) => total + fileStat.size, 0);

if (!checkOnly) {
  await build(expected);
}

const outputBytes = await validateOutputs(expected);
const deltaPercent = sourceBytes
  ? ((outputBytes - sourceBytes) / sourceBytes) * 100
  : 0;
const action = checkOnly ? "Validated" : "Generated and validated";

console.log(
  `${action} ${expected.size} WebP assets from ${sources.length} sources (${referenceCount} catalogue references).`,
);
console.log(
  `Originals: ${formatBytes(sourceBytes)}; delivery variants: ${formatBytes(outputBytes)} (${deltaPercent >= 0 ? "+" : ""}${deltaPercent.toFixed(1)}%).`,
);
