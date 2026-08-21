import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

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
  assert.match(html, /href="\/soumission"/);
  assert.match(html, /href="\/service"/);
  assert.match(html, /src="\/images\/boulet-wordmark\.jpg"/);
  assert.match(html, /alt="Boulet"/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/fenetresboulet\.com\/og-v2\.png"/i,
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

  for (const asset of [
    "public/favicon.ico",
    "public/og.png",
    "public/og-v2.png",
    "public/images/boulet-wordmark.jpg",
    "public/images/realisation-mes.webp",
    "public/images/fenetres-hybrides.webp",
    "public/images/porte-acier.webp",
    "public/images/porte-patio.webp",
    "public/images/porte-garage.webp",
  ]) {
    await access(new URL(asset, projectRoot));
  }
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

  const socialCard = await readFile(new URL("public/og-v2.png", projectRoot));
  assert.equal(
    createHash("sha256").update(socialCard).digest("hex"),
    "1a8f6eb2db7d1d326fa45f3703386d24bfcd687b5eea2968740ba6a79347430a",
  );
});
