import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const checkOnly = process.argv.includes("--check");
const sourcePath = path.resolve("public/images/boulet-wordmark.jpg");
const outputDirectory = path.resolve("public/images/brand");

const background = [230, 230, 232];
const sourceColors = {
  blue: [0, 84, 164],
  red: [236, 36, 36],
};
const brandColors = {
  blue: [26, 76, 154],
  red: [239, 17, 21],
  white: [255, 255, 255],
};

function fitCandidate(pixel, foreground) {
  let numerator = 0;
  let denominator = 0;

  for (let channel = 0; channel < 3; channel += 1) {
    const direction = foreground[channel] - background[channel];
    numerator += (pixel[channel] - background[channel]) * direction;
    denominator += direction * direction;
  }

  const alpha = Math.max(0, Math.min(1, numerator / denominator));
  let error = 0;

  for (let channel = 0; channel < 3; channel += 1) {
    const reconstructed =
      background[channel] + alpha * (foreground[channel] - background[channel]);
    error += (pixel[channel] - reconstructed) ** 2;
  }

  return { alpha, error };
}

function extractIdentity(source, width, footer = false) {
  const output = Buffer.alloc((source.length / 3) * 4);

  for (let sourceOffset = 0, outputOffset = 0; sourceOffset < source.length; sourceOffset += 3, outputOffset += 4) {
    const pixelIndex = sourceOffset / 3;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const pixel = [
      source[sourceOffset],
      source[sourceOffset + 1],
      source[sourceOffset + 2],
    ];
    const blueFit = fitCandidate(pixel, sourceColors.blue);
    const redFit = fitCandidate(pixel, sourceColors.red);
    const insideRedSymbol = x >= 110 && x <= 270 && y >= 35 && y <= 202;
    const selected = insideRedSymbol ? "red" : "blue";
    const fit = selected === "blue" ? blueFit : redFit;
    const alpha = fit.error <= 5_000 && fit.alpha >= 0.015 ? fit.alpha : 0;
    const color =
      selected === "blue" && footer
        ? brandColors.white
        : brandColors[selected];

    output[outputOffset] = color[0];
    output[outputOffset + 1] = color[1];
    output[outputOffset + 2] = color[2];
    output[outputOffset + 3] = Math.round(alpha * 255);
  }

  return output;
}

async function wordmarkBuffer(raw, width, height, footer = false) {
  const extracted = extractIdentity(raw, width, footer);
  const trimmed = await sharp(extracted, {
    raw: { width, height, channels: 4 },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .resize(936, 143, {
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  return sharp({
    create: {
      width: 960,
      height: 167,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: trimmed, gravity: "center" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function symbolBuffer(raw, width, height) {
  const extracted = extractIdentity(raw, width, false);
  const symbolRegion = await sharp(extracted, {
    raw: { width, height, channels: 4 },
  })
    .extract({ left: 24, top: 0, width: 292, height })
    .png()
    .toBuffer();
  const symbol = await sharp(symbolRegion)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .resize(424, 424, {
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  return sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: symbol, gravity: "center" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function assertOrWrite(filename, buffer) {
  const target = path.join(outputDirectory, filename);

  if (checkOnly) {
    const existing = await fs.readFile(target).catch(() => null);
    if (!existing || !existing.equals(buffer)) {
      throw new Error(`${path.relative(process.cwd(), target)} is missing or stale`);
    }
    return;
  }

  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(target, buffer);
}

const source = await sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = source.info;

const [colorWordmark, reversedWordmark, symbol] = await Promise.all([
  wordmarkBuffer(source.data, width, height, false),
  wordmarkBuffer(source.data, width, height, true),
  symbolBuffer(source.data, width, height),
]);

await Promise.all([
  assertOrWrite("boulet-wordmark-color.png", colorWordmark),
  assertOrWrite("boulet-wordmark-reversed.png", reversedWordmark),
  assertOrWrite("boulet-symbol.png", symbol),
]);

console.log(
  checkOnly
    ? "Brand assets are current."
    : "Built transparent Boulet wordmarks and symbol.",
);
