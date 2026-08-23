import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = new URL("../", import.meta.url);

function projectImage(path) {
  return sharp(fileURLToPath(new URL(path, projectRoot)));
}

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) {
      files.push(...await listFiles(child));
    } else {
      files.push(child);
    }
  }
  return files;
}

async function loadWorker(cacheKey) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${cacheKey}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};

const defaultEnv = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

async function requestWorker(pathname = "/", init = {}, env = defaultEnv) {
  const worker = await loadWorker(pathname);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "localhost", ...init.headers },
      ...init,
    }),
    env,
    executionContext,
  );
}

async function render(pathname = "/") {
  return requestWorker(pathname);
}

test("server-renders the redesigned French homepage and supplied identity", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(response.headers.get("content-security-policy") ?? "", /default-src 'self'/);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="fr-CA"/i);
  assert.match(html, /Pensées ici\./);
  assert.match(html, /Fabriquées ici\./);
  assert.match(html, /Installées pour durer\./);
  assert.match(html, /Manufacturier québécois depuis 1976/);
  assert.match(html, /Votre projet, de A à Z/);
  assert.match(html, /Voici comment le projet avance/);
  assert.match(
    html,
    /class="media-frame media-frame--guidance guidance-figure process-visual"/,
  );
  assert.equal(
    (html.match(/class="media-frame media-frame--project(?: |")/g) ?? [])
      .length,
    3,
  );
  assert.match(html, /Une entreprise familiale à Sorel-Tracy depuis 1976/);
  assert.match(html, /Images d’inspiration/);
  assert.ok((html.match(/Image d’inspiration/g) ?? []).length >= 4);
  assert.match(html, /Personne et lieu fictifs/);
  assert.doesNotMatch(html, /\bIA\b|\bAI\b|visualisation|image générée/i);
  for (const family of [
    "fenetres",
    "portes-entree",
    "portes-patio",
    "portes-garage",
  ]) {
    assert.match(html, new RegExp(`href="/produits/${family}"`));
  }
  const headerMarkup = html.match(
    /<header class="site-header"[\s\S]*?<\/header>/i,
  )?.[0];
  const footerMarkup = html.match(
    /<footer class="site-footer"[\s\S]*?<\/footer>/i,
  )?.[0];
  assert.ok(headerMarkup, "homepage header markup");
  assert.ok(footerMarkup, "homepage footer markup");
  assert.match(headerMarkup, /class="brand brand-color"/i);
  assert.match(headerMarkup, /boulet-wordmark-color\.png/i);
  assert.doesNotMatch(headerMarkup, /boulet-wordmark-reversed\.png/i);
  assert.match(footerMarkup, /class="brand brand-reversed"/i);
  assert.match(footerMarkup, /boulet-wordmark-reversed\.png/i);
  assert.doesNotMatch(footerMarkup, /boulet-wordmark-color\.png/i);
  assert.match(html, /alt="Boulet"/);
  for (const editorialAsset of [
    "realisation-mes-v2.webp",
    "realisation-paris-freres-v2.webp",
    "realisation-capricor-v2.webp",
  ]) {
    assert.match(html, new RegExp(editorialAsset.replace(".", "\\."), "i"));
  }
  assert.match(
    html,
    /property="og:image" content="https:\/\/fenetresboulet\.com\/images\/custom\/social-card-v2\.jpg"/i,
  );
  assert.doesNotMatch(html, /boulet-wordmark-480\.webp|og-custom-v1\.jpg/i);
  assert.match(
    html,
    /<meta name="description" content="Portes et fenêtres fabriquées au Québec\./i,
  );
  assert.doesNotMatch(
    html,
    /codex-preview|Your site is taking shape|Building your site/i,
  );
});

test("publishes canonical crawler metadata for all 88 public routes", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(
    await robots.text(),
    /Sitemap: https:\/\/fenetresboulet\.com\/sitemap\.xml/,
  );

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.equal((xml.match(/<loc>/g) ?? []).length, 88);
  for (const route of [
    "/produits",
    "/produits/fenetres",
    "/produits/fenetres/68-auvent-echo-pvc",
    "/realisations/capricor",
    "/credits",
    "/soumission",
  ]) {
    assert.match(xml, new RegExp(`<loc>https://fenetresboulet\\.com${route}</loc>`));
  }

  const product = await render("/produits/fenetres/68-auvent-echo-pvc");
  const productHtml = await product.text();
  assert.match(
    productHtml,
    /rel="canonical" href="https:\/\/fenetresboulet\.com\/produits\/fenetres\/68-auvent-echo-pvc"/,
  );
  assert.match(productHtml, /"@type":"Product"/);

  const faq = await render("/faq");
  assert.match(await faq.text(), /"@type":"FAQPage"/);

  const missing = await render("/une-page-inexistante");
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /name="robots" content="noindex/);
});

test("server-renders every public editorial route", async () => {
  const routes = [
    ["/produits", /Le catalogue/],
    ["/realisations", /Des maisons qui laissent/],
    ["/conseils", /Moins de catalogue/],
    ["/guides", /Choisir, installer, entretenir/],
    ["/faq", /Les réponses utiles/],
    ["/blogue", /Des repères pour/],
    ["/subventions", /Vérifier d’abord/],
    ["/entreprise", /Bâtie ici/],
    ["/equipe", /Un projet avance mieux/],
    ["/carrieres", /Fabriquer ici/],
    ["/contact", /Choisissez le chemin/],
    ["/visite-virtuelle", /Faites un premier tour/],
    ["/vente-entrepot", /Une occasion seulement/],
    ["/garantie", /Une couverture claire/],
    ["/confidentialite", /Vos renseignements méritent/],
    ["/credits", /Des sources identifiées/],
    ["/soumission", /Votre projet commence/],
    ["/service", /Un problème bien documenté/],
  ];

  for (const [pathname, marker] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, marker, pathname);
    assert.match(html, /<main id="contenu">/, pathname);
    assert.match(html, /rel="canonical"/, pathname);
    assert.match(
      html,
      /property="og:image" content="https:\/\/fenetresboulet\.com\/images\/custom\/social-card-v2\.jpg"/i,
      pathname,
    );
    assert.doesNotMatch(
      html,
      /\bIA\b|\bAI\b|visualisation|image générée/i,
      pathname,
    );
  }
});

test("renders a complete, filterable 54-product native catalogue", async () => {
  const index = await render("/produits");
  assert.equal(index.status, 200);
  const indexHtml = await index.text();
  assert.match(indexHtml, /catalog-comparison-table/);
  assert.match(indexHtml, /Trouver une fiche produit/);
  assert.match(indexHtml, />54(?:<!-- -->)? résultat(?:<!-- -->)?s</);
  assert.match(indexHtml, /href="\/produits\/fenetres\/68-auvent-echo-pvc"/);
  assert.doesNotMatch(indexHtml, /indication de stock[^<]*en stock/i);

  const filtered = await render(
    "/produits/fenetres?type=Battant%20%28manivelle%29",
  );
  assert.equal(filtered.status, 200);
  const filteredHtml = await filtered.text();
  assert.match(
    filteredHtml,
    /value="Battant \(manivelle\)" selected=""/,
  );

  const product = await render("/produits/fenetres/68-auvent-echo-pvc");
  assert.equal(product.status, 200);
  const productHtml = await product.text();
  assert.match(productHtml, /Auvent echo PVC/);
  assert.match(productHtml, /Galerie officielle/);
  assert.match(productHtml, /Une fiche reliée à sa source/);
  assert.match(productHtml, /images\/catalog-delivery\/.*-1440w\.webp/);
  assert.doesNotMatch(productHtml, /"offers"|"aggregateRating"/);

  const fallbackAlt = await render(
    "/produits/fenetres/79-coupe-echo-pvc-triple-verre",
  );
  assert.match(
    await fallbackAlt.text(),
    /alt="Coupe echo PVC triple verre"/,
  );
});

test("renders the complete official project gallery with native detail pages", async () => {
  const index = await render("/realisations");
  assert.equal(index.status, 200);
  const indexHtml = await index.text();
  assert.match(indexHtml, /<strong>11<\/strong> projets documentés/);
  assert.match(indexHtml, /<strong>21<\/strong> vues d’archives/);
  assert.match(indexHtml, /href="\/realisations\/capricor"/);

  const detail = await render("/realisations/capricor");
  assert.equal(detail.status, 200);
  const detailHtml = await detail.text();
  assert.match(detailHtml, /Projet publié par Boulet/);
  assert.match(detailHtml, /Une référence visuelle, pas une fiche technique/);
  assert.match(
    detailHtml,
    /media\/images\/editorial\/realisation-capricor-v2\.webp/,
  );
  assert.doesNotMatch(detailHtml, /modèle [A-Z][A-Za-z0-9-]+ installé/i);
});

test("renders native quote and service intake fail-closed until activation", async () => {
  const quote = await render("/soumission?produit=68-auvent-echo-pvc");
  assert.equal(quote.status, 200);
  const quoteHtml = await quote.text();
  assert.match(quoteHtml, /class="lead-form"/);
  assert.match(quoteHtml, /Produit repéré:/);
  assert.match(quoteHtml, /Auvent echo PVC/);
  assert.match(quoteHtml, /name="interests" checked="" value="fenetres"/);
  assert.match(quoteHtml, /name="catalogProduct" value="Auvent echo PVC"/);
  assert.match(quoteHtml, /Activation en cours/);
  assert.match(quoteHtml, /PDF:[\s\S]*analyse antivirus n’est pas activée/);
  assert.match(quoteHtml, /info@fenetresboulet\.com/);
  assert.doesNotMatch(quoteHtml, /utiliser le formulaire officiel/);

  const service = await render("/service");
  assert.equal(service.status, 200);
  const serviceHtml = await service.text();
  assert.match(
    serviceHtml,
    /<input(?=[^>]*name="photoWide")(?=[^>]*required)[^>]*>/,
  );
  assert.match(
    serviceHtml,
    /<input(?=[^>]*name="photoClose")(?=[^>]*required)[^>]*>/,
  );
  assert.match(serviceHtml, /Aucune confirmation automatique/);

  const missingOrigin = await requestWorker("/api/demandes/demarrer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(missingOrigin.status, 403);

  const unavailable = await requestWorker("/api/demandes/demarrer", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
      "sec-fetch-site": "same-origin",
    },
    body: "{}",
  });
  assert.equal(unavailable.status, 503);

  const adminDenied = await requestWorker("/api/admin/demandes", {
    headers: { accept: "application/json" },
  });
  assert.equal(adminDenied.status, 403);
});

test("permanently redirects legacy products, content, forms and wildcards", async () => {
  const cases = [
    [
      "/battant-manivelle/57-battant-echo-pvc.html",
      "/produits/fenetres/57-battant-echo-pvc",
    ],
    [
      "/18-battant-manivelle",
      "/produits/fenetres?type=Battant%20%28manivelle%29",
    ],
    ["/vente-d-entrepot/une-ancienne-fiche.html", "/vente-entrepot"],
    ["/serrures/52-san-clemente.html", "/produits/portes-entree"],
    [
      "/content/20-guide-d-achat-des-fenetres-et-portes-d-entree-en-acier-boulet",
      "/conseils",
    ],
    ["/content/17-credits-medias-utilises", "/credits"],
    ["/contact-form/service-apres-vente", "/service"],
    ["/magasins", "/contact#horaire"],
  ];

  for (const [source, destination] of cases) {
    const response = await render(source);
    assert.equal(response.status, 308, source);
    assert.equal(
      response.headers.get("location"),
      `http://localhost${destination}`,
    );
  }
});

test("packages native persistence, private files and scheduled retention", async () => {
  const packageJson = await readFile(new URL("package.json", projectRoot), "utf8");
  const hostingConfig = JSON.parse(
    await readFile(new URL(".openai/hosting.json", projectRoot), "utf8"),
  );
  const wranglerConfig = JSON.parse(
    await readFile(new URL("dist/server/wrangler.json", projectRoot), "utf8"),
  );

  assert.match(packageJson, /"sharp": "0\.35\.3"/);
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, "UPLOADS");
  assert.deepEqual(wranglerConfig.triggers.crons, ["17 5 * * *"]);
  assert.equal(wranglerConfig.assets.run_worker_first, undefined);
  assert.equal(wranglerConfig.d1_databases[0].binding, "DB");
  assert.equal(wranglerConfig.r2_buckets[0].binding, "UPLOADS");

  for (const path of [
    "db/schema.ts",
    "drizzle/0000_native_submissions.sql",
    "dist/.openai/drizzle/0000_native_submissions.sql",
    "worker/submissions.ts",
    "app/components/LeadForm.tsx",
    "app/admin/demandes/page.tsx",
    "docs/native-intake-operations.md",
  ]) {
    await access(new URL(path, projectRoot));
  }

  const submissions = await readFile(
    new URL("worker/submissions.ts", projectRoot),
    "utf8",
  );
  assert.match(submissions, /FixedLengthStream/);
  assert.doesNotMatch(submissions, /request\.body\.tee\(\)/);
  assert.match(
    submissions,
    /content-security-policy": "default-src 'none'; sandbox"/,
  );
  assert.match(submissions, /PDF_SCANNING_REQUIRED/);
  assert.match(submissions, /BOULET_INTAKE_ENABLED/);
  assert.match(submissions, /TURNSTILE_SECRET/);
  assert.match(submissions, /quote_intake/);
  assert.match(submissions, /UPLOAD_RATE_LIMIT/);
  assert.match(submissions, /BOULET_ADMIN_EMAILS/);
  assert.doesNotMatch(submissions, /console\.(?:log|info|warn|error)/);
});

test("keeps required assets, provenance and deterministic catalogue derivatives", async () => {
  const packageJson = await readFile(new URL("package.json", projectRoot), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  const webpFiles = (await listFiles(new URL("public/", projectRoot)))
    .filter((file) => file.pathname.endsWith(".webp"));
  assert.ok(webpFiles.length > 800);
  for (const file of webpFiles) {
    const bytes = await readFile(file);
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", file.pathname);
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", file.pathname);
  }
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
  await assert.rejects(
    access(new URL("public/images/custom/ASSET-MANIFEST.md", projectRoot)),
  );
  await access(new URL("docs/asset-provenance/custom-assets.md", projectRoot));

  for (const asset of [
    "public/images/brand/boulet-symbol.png",
    "public/images/brand/boulet-wordmark-color.png",
    "public/images/brand/boulet-wordmark-reversed.png",
    "public/images/custom/social-card-v2.jpg",
    "public/images/editorial/realisation-mes-v2.webp",
    "public/images/editorial/realisation-paris-freres-v2.webp",
    "public/images/editorial/realisation-capricor-v2.webp",
    "public/images/boulet-wordmark.jpg",
    "public/images/custom/product-windows-concept-v1.webp",
    "public/images/custom/process-measure-v1.webp",
    "public/documents/conseils-entretien-boulet.pdf",
    "public/documents/guide-installation-fenetres-apchq-avfq-2015.pdf",
    "public/documents/garantie-limitee-boulet.pdf",
    "public/documents/politique-protection-renseignements-personnels-boulet.pdf",
    "public/documents/resume-politique-protection-renseignements-personnels-boulet.pdf",
    "public/documents/mentions-legales-et-temoins-boulet.pdf",
    "public/images/catalog-delivery/fenetres/68-auvent-echo-pvc/478-auvent-echo-pvc-720w.webp",
    "public/images/catalog-delivery/fenetres/68-auvent-echo-pvc/478-auvent-echo-pvc-1440w.webp",
    "public/images/realisations-officielles/capricor.jpg",
  ]) {
    await access(new URL(asset, projectRoot));
  }

  const appSources = await Promise.all(
    (await listFiles(new URL("app/", projectRoot)))
      .filter((file) => /\.(?:css|ts|tsx)$/.test(file.pathname))
      .map((file) => readFile(file, "utf8")),
  );
  const runtimeSource = appSources.join("\n");
  for (const retiredReference of [
    "/media/images/boulet-wordmark-480.webp",
    "/images/custom/og-custom-v1.jpg",
    "/og.png",
    "/og-v2.png",
    "/media/images/atelier-collage.webp",
    "/images/battant-hybride.jpg",
    "/images/battant-pvc.jpg",
    "/media/images/boulet-logo.webp",
    "/media/images/fenetres-hybrides.webp",
    "/images/patio-pvc.jpg",
    "/media/images/porte-acier.webp",
    "/media/images/porte-patio.webp",
    "/media/images/porte-garage.webp",
    "/media/images/realisation-mes.webp",
    "/media/images/realisation-paris-freres.webp",
    "/media/images/realisation-capricor.webp",
  ]) {
    assert.doesNotMatch(
      runtimeSource,
      new RegExp(retiredReference),
      retiredReference,
    );
  }
  for (const retiredAsset of [
    "public/og.png",
    "public/og-v2.png",
    "public/images/atelier-collage.webp",
    "public/images/battant-hybride.jpg",
    "public/images/battant-pvc.jpg",
    "public/images/boulet-logo.webp",
    "public/images/boulet-wordmark-480.webp",
    "public/images/custom/og-custom-v1.jpg",
    "public/images/fenetres-hybrides.webp",
    "public/images/patio-pvc.jpg",
    "public/images/porte-acier.webp",
    "public/images/porte-garage.webp",
    "public/images/porte-patio.webp",
    "public/images/realisation-mes.webp",
    "public/images/realisation-paris-freres.webp",
    "public/images/realisation-capricor.webp",
  ]) {
    await assert.rejects(access(new URL(retiredAsset, projectRoot)));
  }
  await assert.rejects(
    access(new URL("scripts/build-custom-assets.mjs", projectRoot)),
  );
  await access(new URL("scripts/build-cohesion-assets.mjs", projectRoot));

  const documentHashes = {
    "public/documents/garantie-limitee-boulet.pdf":
      "28e7e9165e614f1958949ba897ab52c9d4ae298918ef4031bece429e5238a5b4",
    "public/documents/politique-protection-renseignements-personnels-boulet.pdf":
      "c7294b6b82b43afdae33107466bed7a81bf9883dff348f382d0f03b8ec6356c0",
    "public/documents/resume-politique-protection-renseignements-personnels-boulet.pdf":
      "bcf3564d42abc99db5464ea186d9d013305566bfd97f32e825e0e2bdfc779e29",
    "public/documents/mentions-legales-et-temoins-boulet.pdf":
      "8f6220a2dff6781b414224aa05615bf63f4a512ea31f2b2ed45835c0e8b19f8a",
  };
  for (const [path, expectedHash] of Object.entries(documentHashes)) {
    const bytes = await readFile(new URL(path, projectRoot));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      expectedHash,
      path,
    );
  }
});

test("uses native Vinext navigation for every internal route", async () => {
  await assert.rejects(
    access(new URL("app/components/SiteLink.tsx", projectRoot)),
  );

  for (const sourcePath of [
    "app/page.tsx",
    "app/components/Brand.tsx",
    "app/components/SiteHeader.tsx",
    "app/components/SiteFooter.tsx",
    "app/produits/page.tsx",
  ]) {
    const source = await readFile(new URL(sourcePath, projectRoot), "utf8");
    assert.match(source, /from "next\/link"/, sourcePath);
    assert.doesNotMatch(source, /SiteLink/, sourcePath);
  }
});

test("optimizes images through both Vinext-compatible endpoint paths", async () => {
  const worker = await loadWorker("image-optimization");
  const transforms = [];
  const env = {
    ASSETS: {
      fetch: async (request) => {
        assert.equal(new URL(request.url).pathname, "/images/source.webp");
        return new Response("source-image", {
          headers: { "content-type": "application/octet-stream" },
        });
      },
    },
    IMAGES: {
      input: () => ({
        transform: (options) => ({
          output: async ({ format, quality }) => {
            transforms.push({ format, quality, ...options });
            return {
              response: () =>
                new Response(`optimized-${options.width}`, {
                  headers: { "content-type": format },
                }),
            };
          },
        }),
      }),
    },
  };

  for (const { endpoint, accept, contentType } of [
    {
      endpoint: "/_next/image",
      accept: "image/avif,image/webp",
      contentType: "image/avif",
    },
    {
      endpoint: "/_vinext/image",
      accept: "image/webp",
      contentType: "image/webp",
    },
  ]) {
    const response = await worker.fetch(
      new Request(
        `http://localhost${endpoint}?url=%2Fmedia%2Fimages%2Fsource.webp&w=640&q=75`,
        { headers: { accept } },
      ),
      env,
      executionContext,
    );

    assert.equal(response.status, 200, endpoint);
    assert.equal(response.headers.get("content-type"), contentType, endpoint);
    assert.equal(await response.text(), "optimized-640", endpoint);
  }

  const invalidWidthResponse = await worker.fetch(
    new Request(
      "http://localhost/_next/image?url=%2Fmedia%2Fimages%2Fsource.webp&w=333&q=75",
    ),
    env,
    executionContext,
  );
  assert.equal(invalidWidthResponse.status, 400);
  assert.deepEqual(
    transforms.map(({ width, format, quality }) => ({ width, format, quality })),
    [
      { width: 640, format: "image/avif", quality: 75 },
      { width: 640, format: "image/webp", quality: 75 },
    ],
  );
});

test("serves nested WebP assets with an explicit safe MIME type", async () => {
  const worker = await loadWorker("webp-static-asset");
  const webpBytes = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x04, 0x00, 0x00, 0x00,
    0x57, 0x45, 0x42, 0x50,
  ]);
  const pathname = "/media/images/catalog-delivery/fenetres/example.webp";
  const assetPathname = "/images/catalog-delivery/fenetres/example.webp";
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`),
    {
      ASSETS: {
        fetch: async (request) => {
          assert.equal(new URL(request.url).pathname, assetPathname);
          return new Response(webpBytes, {
            headers: { "content-type": "application/octet-stream" },
          });
        },
      },
    },
    executionContext,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/webp");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), webpBytes);

  const missing = await worker.fetch(
    new Request("http://localhost/media/images/missing.webp"),
    {
      ASSETS: {
        fetch: async () =>
          new Response("missing", {
            status: 404,
            headers: { "content-type": "text/plain" },
          }),
      },
    },
    executionContext,
  );
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("content-type"), "text/plain");

  const revalidated = await worker.fetch(
    new Request("http://localhost/media/images/cached.webp"),
    {
      ASSETS: {
        fetch: async () =>
          new Response(null, {
            status: 304,
            headers: { etag: '"cached-webp"' },
          }),
      },
    },
    executionContext,
  );
  assert.equal(revalidated.status, 304);
  assert.equal(revalidated.headers.get("content-type"), "image/webp");
  assert.equal(revalidated.headers.get("etag"), '"cached-webp"');

  const methodDenied = await worker.fetch(
    new Request("http://localhost/media/images/example.webp", {
      method: "POST",
    }),
    {
      ASSETS: {
        fetch: async () => new Response(webpBytes),
      },
    },
    executionContext,
  );
  assert.equal(methodDenied.status, 405);
  assert.equal(methodDenied.headers.get("allow"), "GET, HEAD");
});

test("uses the supplied Boulet palette and identity exactly", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");
  assert.match(css, /--brand-blue:\s*#1a4c9a;/i);
  assert.match(css, /--brand-red:\s*#ef1115;/i);
  assert.match(css, /--brand-gray:\s*#e7e8ea;/i);

  const logo = await readFile(
    new URL("public/images/boulet-wordmark.jpg", projectRoot),
  );
  assert.equal(
    createHash("sha256").update(logo).digest("hex"),
    "f431b51b57f42038f633455a2dc35ba02b2e3e3d7cc559359bfbfc97371df630",
  );

  const logoAssets = [
    {
      path: "public/images/brand/boulet-wordmark-color.png",
      requiredColors: [[26, 76, 154], [239, 17, 21]],
    },
    {
      path: "public/images/brand/boulet-wordmark-reversed.png",
      requiredColors: [[255, 255, 255], [239, 17, 21]],
    },
  ];

  for (const { path, requiredColors } of logoAssets) {
    const image = projectImage(path);
    const metadata = await image.metadata();
    assert.equal(metadata.format, "png", path);
    assert.equal(metadata.width, 960, path);
    assert.equal(metadata.height, 167, path);
    assert.equal(metadata.hasAlpha, true, path);
    assert.equal(metadata.channels, 4, path);

    const { data, info } = await image.ensureAlpha().raw().toBuffer({
      resolveWithObject: true,
    });
    const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
    for (const [x, y] of [
      [0, 0],
      [info.width - 1, 0],
      [0, info.height - 1],
      [info.width - 1, info.height - 1],
    ]) {
      assert.equal(alphaAt(x, y), 0, `${path} transparent corner ${x},${y}`);
    }

    for (const expected of requiredColors) {
      let found = false;
      for (let offset = 0; offset < data.length; offset += info.channels) {
        if (
          data[offset + 3] >= 245 &&
          Math.abs(data[offset] - expected[0]) <= 8 &&
          Math.abs(data[offset + 1] - expected[1]) <= 8 &&
          Math.abs(data[offset + 2] - expected[2]) <= 8
        ) {
          found = true;
          break;
        }
      }
      assert.ok(found, `${path} contains ${expected.join(",")}`);
    }
  }

  const symbol = await projectImage(
    "public/images/brand/boulet-symbol.png",
  ).metadata();
  assert.equal(symbol.format, "png");
  assert.equal(symbol.width, 512);
  assert.equal(symbol.height, 512);
  assert.equal(symbol.hasAlpha, true);

  const socialCard = await projectImage(
    "public/images/custom/social-card-v2.jpg",
  ).metadata();
  assert.deepEqual(
    [socialCard.width, socialCard.height, socialCard.format],
    [1200, 630, "jpeg"],
  );

  for (const path of [
    "public/images/editorial/realisation-mes-v2.webp",
    "public/images/editorial/realisation-paris-freres-v2.webp",
    "public/images/editorial/realisation-capricor-v2.webp",
  ]) {
    const metadata = await projectImage(path).metadata();
    assert.equal(metadata.format, "webp", path);
    assert.ok((metadata.width ?? 0) >= 1_000, `${path} usable width`);
    assert.ok((metadata.height ?? 0) >= 400, `${path} usable height`);
  }
});
