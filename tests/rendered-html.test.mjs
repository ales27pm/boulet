import assert from "node:assert/strict";
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
  assert.match(
    html,
    /property="og:image" content="https:\/\/fenetresboulet\.com\/og\.png"/i,
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

test("removes the starter preview and keeps required project assets", async () => {
  const packageJson = await readFile(new URL("package.json", projectRoot), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));

  for (const asset of [
    "public/favicon.ico",
    "public/og.png",
    "public/images/realisation-mes.webp",
    "public/images/fenetres-hybrides.webp",
    "public/images/porte-acier.webp",
    "public/images/porte-patio.webp",
    "public/images/porte-garage.webp",
  ]) {
    await access(new URL(asset, projectRoot));
  }
});
