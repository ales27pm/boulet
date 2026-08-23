import { officialLinks, productFamilies } from "../app/site-data.ts";

const timeoutMs = Number.parseInt(
  process.env.LINK_CHECK_TIMEOUT_MS ?? "15000",
  10,
);
const scope = process.env.LINK_CHECK_SCOPE ?? "all";

async function checkLink([name, url]) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 (compatible; BouletLinkCheck/1.0)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });

    await response.body?.cancel();

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return `${name}: ${response.status} ${response.url}`;
  } catch (error) {
    throw new Error(
      `${name}: ${error instanceof Error ? error.message : error} (${url})`,
      { cause: error },
    );
  }
}

const externalLinks = {
  ...officialLinks,
  ...Object.fromEntries(
    productFamilies.map((family) => [
      `product:${family.id}`,
      family.officialHref,
    ]),
  ),
};

const scopedLinks = Object.entries(externalLinks).filter(([, url]) => {
  const firstParty = new URL(url).hostname === "fenetresboulet.com";
  return (
    scope === "all" ||
    (scope === "first-party" && firstParty) ||
    (scope === "third-party" && !firstParty)
  );
});

if (!new Set(["all", "first-party", "third-party"]).has(scope)) {
  throw new Error(
    `Unsupported LINK_CHECK_SCOPE '${scope}'. Use all, first-party, or third-party.`,
  );
}

const results = await Promise.allSettled(scopedLinks.map(checkLink));

let failed = false;

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log(`✓ ${result.value}`);
  } else {
    failed = true;
    console.error(`✗ ${result.reason?.message ?? result.reason}`);
  }
}

if (failed) {
  process.exitCode = 1;
}
