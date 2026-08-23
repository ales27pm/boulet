import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

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
  assert.match(html, /src="\/images\/boulet-wordmark-480\.webp"/i);
  assert.doesNotMatch(html, /_next\/image\?url=%2Fimages%2Fboulet-wordmark/i);
  assert.match(html, /alt="Boulet"/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/fenetresboulet\.com\/images\/custom\/og-custom-v1\.jpg"/i,
  );
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
  assert.match(detailHtml, /images\/realisations-officielles\/capricor\.jpg/);
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
  assert.deepEqual(wranglerConfig.assets.run_worker_first, ["/*.webp"]);
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
    "public/favicon.ico",
    "public/og.png",
    "public/images/custom/og-custom-v1.jpg",
    "public/images/boulet-wordmark.jpg",
    "public/images/boulet-wordmark-480.webp",
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
        assert.equal(new URL(request.url).pathname, "/images/source.jpg");
        return new Response("source-image", {
          headers: { "content-type": "image/jpeg" },
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
        `http://localhost${endpoint}?url=%2Fimages%2Fsource.jpg&w=640&q=75`,
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
      "http://localhost/_next/image?url=%2Fimages%2Fsource.jpg&w=333&q=75",
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
  const pathname = "/images/catalog-delivery/fenetres/example.webp";
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`),
    {
      ASSETS: {
        fetch: async (request) => {
          assert.equal(new URL(request.url).pathname, pathname);
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
    new Request("http://localhost/images/missing.webp"),
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

  const optimizedLogoStat = await stat(
    new URL("public/images/boulet-wordmark-480.webp", projectRoot),
  );
  assert.ok(optimizedLogoStat.size < 8_000);
  assert.ok(optimizedLogoStat.size < logo.byteLength);

  const socialCard = await readFile(
    new URL("public/images/custom/og-custom-v1.jpg", projectRoot),
  );
  assert.equal(
    createHash("sha256").update(socialCard).digest("hex"),
    "33f1118a14626908826750416ae95b95ac20219949699b778c7ac8708fcb75d8",
  );
});
