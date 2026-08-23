import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const customerRoutes = [
  "/",
  "/produits",
  "/realisations",
  "/conseils",
  "/entreprise",
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
