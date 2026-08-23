import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function loadWorker(cacheKey) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${cacheKey}`,
  );
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(pathname = "/") {
  const worker = await loadWorker(pathname);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the redesigned French homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="fr-CA"/i);
  assert.match(html, /Pensées ici\./);
  assert.match(html, /Fabriquées ici\./);
  assert.match(html, /Installées pour durer\./);
  assert.match(html, /Manufacturier québécois depuis 1976/);
  assert.match(html, /Votre projet, de A à Z/);
  assert.match(html, /Bien choisir ses fenêtres/);
  assert.match(html, /Voici comment le projet avance/);
  assert.match(html, /Une entreprise familiale à Sorel-Tracy depuis 1976/);
  assert.match(html, /aria-labelledby="quote-home-title"/);
  assert.match(html, /Commencez avec ce que vous savez déjà/);
  assert.match(html, /Ce qui nous aide à vous répondre/);
  assert.match(html, /Pas besoin d’avoir tout décidé/);
  assert.match(html, /product-windows-concept-v1\.webp/);
  assert.match(html, /product-entry-concept-v1\.webp/);
  assert.match(html, /product-patio-concept-v1\.webp/);
  assert.match(html, /product-garage-concept-v1\.webp/);
  assert.match(html, /process-measure-v1\.webp/);
  assert.match(html, /Images d’inspiration/);
  assert.ok((html.match(/Image d’inspiration/g) ?? []).length >= 4);
  assert.match(html, /Personne et lieu fictifs/);
  assert.doesNotMatch(html, /\bIA\b|\bAI\b|visualisation|image générée/i);
  assert.match(html, /href="\/soumission"/);
  assert.match(html, /href="\/service"/);
  assert.doesNotMatch(html, /hero-frame-system/);
  assert.match(
    html,
    /src="\/_next\/image\?url=%2Fimages%2Fboulet-wordmark\.jpg/i,
  );
  assert.match(html, /sizes="\(max-width: 560px\) 172px, 240px"/);
  assert.doesNotMatch(html, /src="\/images\/boulet-wordmark\.jpg"/);
  assert.match(html, /alt="Boulet"/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/fenetresboulet\.com\/images\/custom\/og-custom-v1\.jpg"/i,
  );
  assert.match(
    html,
    /<meta name="description" content="Portes et fenêtres fabriquées au Québec\./i,
  );
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("publishes valid crawler discovery metadata", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/fenetresboulet\.com\/sitemap\.xml/);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /<loc>https:\/\/fenetresboulet\.com\/produits<\/loc>/);
});

test("server-renders every primary customer route", async () => {
  const routes = [
    ["/produits", /Une ouverture pour/],
    ["/realisations", /Des maisons qui laissent/],
    ["/conseils", /Moins de catalogue/],
    ["/entreprise", /Bâtie ici/],
    ["/soumission", /Votre projet commence/],
    ["/service", /Un problème bien documenté/],
  ];

  for (const [pathname, marker] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, marker, pathname);
    assert.match(html, /Portes &amp; fenêtres/i, pathname);
  }
});

test("keeps inspiration imagery separate from factual product proof", async () => {
  const productsResponse = await render("/produits");
  const productsHtml = await productsResponse.text();
  assert.match(productsHtml, /\/images\/fenetres-hybrides\.webp/);
  assert.match(productsHtml, /\/images\/porte-acier\.webp/);
  assert.doesNotMatch(productsHtml, /product-windows-concept-v1\.webp/);

  const guidanceRoutes = [
    ["/conseils", /guide-materials-v1\.webp/, /Échantillons fictifs/],
    ["/service", /service-documentation-v1\.webp/, /aucune donnée client réelle/],
    ["/soumission", /quote-preparation-v1\.webp/, /documents et projet fictifs/],
  ];

  for (const [pathname, imageMarker, disclosureMarker] of guidanceRoutes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, imageMarker, pathname);
    assert.match(html, /Mise en situation/, pathname);
    assert.match(html, disclosureMarker, pathname);
    assert.doesNotMatch(
      html,
      /\bIA\b|\bAI\b|visualisation|image générée/i,
      pathname,
    );
    if (pathname === "/service" || pathname === "/soumission") {
      assert.match(html, /Vous continuerez sur fenetresboulet\.com/, pathname);
    }
  }
});

test("renders the window decision map as structured content", async () => {
  const response = await render("/produits");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /aria-labelledby="window-choice-title"/);
  assert.match(html, /<h2 id="window-choice-title">Le bon geste/);
  assert.match(html, /<figure class="decision-map">/);
  assert.match(html, /<dl class="decision-grid">/);
  assert.match(html, /Quelle priorité décrit le mieux votre situation\?/);
  assert.match(html, /Étanchéité et ventilation contrôlée/);
  assert.match(html, /Le vitrage, l’intercalaire et la configuration complète/);
  assert.doesNotMatch(html, /role="img"[^>]*decision-map/);
});

test("removes the starter preview and keeps required project assets", async () => {
  const packageJson = await readFile(new URL("package.json", projectRoot), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
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
    "public/images/realisation-mes.webp",
    "public/images/fenetres-hybrides.webp",
    "public/images/porte-acier.webp",
    "public/images/porte-patio.webp",
    "public/images/porte-garage.webp",
    "public/images/custom/product-windows-concept-v1.webp",
    "public/images/custom/product-entry-concept-v1.webp",
    "public/images/custom/product-patio-concept-v1.webp",
    "public/images/custom/product-garage-concept-v1.webp",
    "public/images/custom/process-measure-v1.webp",
    "public/images/custom/guide-materials-v1.webp",
    "public/images/custom/service-documentation-v1.webp",
    "public/images/custom/quote-preparation-v1.webp",
  ]) {
    await access(new URL(asset, projectRoot));
  }
});

test("uses native Vinext navigation without dormant D1 scaffolding", async () => {
  const packageJson = await readFile(new URL("package.json", projectRoot), "utf8");
  const hostingConfig = JSON.parse(
    await readFile(new URL(".openai/hosting.json", projectRoot), "utf8"),
  );

  assert.doesNotMatch(packageJson, /drizzle|db:generate/i);
  assert.equal(hostingConfig.d1, null);

  await assert.rejects(
    access(new URL("app/components/SiteLink.tsx", projectRoot)),
  );
  await assert.rejects(access(new URL("db", projectRoot)));
  await assert.rejects(access(new URL("drizzle", projectRoot)));
  await assert.rejects(access(new URL("drizzle.config.ts", projectRoot)));

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
        assert.equal(new URL(request.url).pathname, "/images/boulet-wordmark.jpg");
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
        `http://localhost${endpoint}?url=%2Fimages%2Fboulet-wordmark.jpg&w=640&q=75`,
        { headers: { accept } },
      ),
      env,
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );

    assert.equal(response.status, 200, endpoint);
    assert.equal(response.headers.get("content-type"), contentType, endpoint);
    assert.match(response.headers.get("cache-control") ?? "", /max-age/i);
    assert.equal(await response.text(), "optimized-640", endpoint);
  }

  const invalidWidthResponse = await worker.fetch(
    new Request(
      "http://localhost/_next/image?url=%2Fimages%2Fboulet-wordmark.jpg&w=333&q=75",
    ),
    env,
    {
      waitUntil() {},
      passThroughOnException() {},
    },
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

test("uses the supplied Boulet identity exactly", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");
  assert.match(css, /--brand-blue:\s*#1a4c9a;/i);
  assert.match(css, /--brand-red:\s*#ef1115;/i);
  assert.match(css, /--brand-gray:\s*#e7e8ea;/i);

  for (const previousColor of [
    "#173c35",
    "#0f2d28",
    "#f2f0e9",
    "#e5e1d7",
    "#ef5b4e",
    "#c83f35",
  ]) {
    assert.doesNotMatch(css, new RegExp(previousColor, "i"));
  }

  const logo = await readFile(
    new URL("public/images/boulet-wordmark.jpg", projectRoot),
  );
  assert.equal(
    createHash("sha256").update(logo).digest("hex"),
    "f431b51b57f42038f633455a2dc35ba02b2e3e3d7cc559359bfbfc97371df630",
  );

  const socialCard = await readFile(
    new URL("public/images/custom/og-custom-v1.jpg", projectRoot),
  );
  assert.equal(
    createHash("sha256").update(socialCard).digest("hex"),
    "33f1118a14626908826750416ae95b95ac20219949699b778c7ac8708fcb75d8",
  );
});
