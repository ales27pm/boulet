import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const customerRoutes = [
  "/",
  "/produits",
  "/produits/fenetres",
  "/produits/fenetres/68-auvent-echo-pvc",
  "/realisations",
  "/realisations/capricor",
  "/conseils",
  "/guides",
  "/faq",
  "/blogue",
  "/subventions",
  "/entreprise",
  "/equipe",
  "/carrieres",
  "/contact",
  "/visite-virtuelle",
  "/vente-entrepot",
  "/garantie",
  "/confidentialite",
  "/credits",
  "/soumission",
  "/service",
] as const;

function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
) {
  return violations
    .map(
      (violation) =>
        `${violation.id} (${violation.impact ?? "unknown"}): ${violation.help}\n` +
        violation.nodes
          .map((node) => `  - ${node.target.join(" ")}`)
          .join("\n"),
    )
    .join("\n");
}

for (const route of customerRoutes) {
  test(`${route} has no automated WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
}

test("the opened mobile menu remains accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("details.mobile-menu > summary").click();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
});

test("keyboard users can bypass the header and operate the mobile menu", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenu$/);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /Préparer ma demande/ }).first(),
  ).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator("details.mobile-menu");
  const menuToggle = menu.locator("summary");
  await menuToggle.focus();
  await page.keyboard.press("Space");
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(menu).not.toHaveAttribute("open", "");
});

test("an internal Link navigates without reloading the document", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    Object.assign(window, { __bouletNavigationMarker: "preserved" });
  });

  await page.getByRole("link", { name: "Produits", exact: true }).first().click();
  await expect(page).toHaveURL(/\/produits$/);
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __bouletNavigationMarker?: string })
          .__bouletNavigationMarker,
    ),
  ).toBe("preserved");
});

test("catalogue filters and legacy category context work with assistive labels", async ({
  page,
}) => {
  await page.goto("/produits", { waitUntil: "networkidle" });
  await page.getByLabel("Famille", { exact: true }).selectOption("fenetres");
  await page.getByLabel("Type ou collection").selectOption({ label: "Auvent" });
  await expect(page.locator(".catalog-result-count")).toHaveText("2 résultats");
  await expect(page.locator(".catalog-product-card")).toHaveCount(2);

  await page.goto("/18-battant-manivelle", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/produits\/fenetres\?type=Battant%20%28manivelle%29$/);
  await expect(page.getByLabel("Type ou collection")).toHaveValue(
    "Battant (manivelle)",
  );
});

test("a product selection reaches the native quote form with context", async ({
  page,
}) => {
  await page.goto("/produits/fenetres/68-auvent-echo-pvc", {
    waitUntil: "networkidle",
  });
  await page.getByRole("link", { name: "Inclure dans ma demande" }).click();
  await expect(page).toHaveURL(/\/soumission\?produit=68-auvent-echo-pvc$/);
  await expect(page.getByText("Produit repéré:")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Fenêtres" })).toBeChecked();
  await expect(page.locator('input[name="catalogProduct"]')).toHaveValue(
    "Auvent echo PVC",
  );
});

test("native forms expose browser validation without sending incomplete data", async ({
  page,
}) => {
  await page.goto("/soumission", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Activation en cours" })).toBeDisabled();
  await page.locator("form.lead-form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
  });
  const name = page.getByLabel("Nom complet *");
  await expect(name).toBeFocused();
  expect(await name.evaluate((element) => (element as HTMLInputElement).validity.valueMissing)).toBe(true);

  await page.goto("/service", { waitUntil: "networkidle" });
  await expect(page.getByLabel("Photo éloignée *")).toHaveAttribute("required", "");
  await expect(page.getByLabel("Photo rapprochée *")).toHaveAttribute("required", "");
});

for (const route of [
  "/produits",
  "/soumission",
  "/confidentialite",
] as const) {
  test(`${route} has no automated mobile WCAG A/AA violations`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
}
