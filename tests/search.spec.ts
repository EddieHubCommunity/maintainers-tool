import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const org = 'EddieHubCommunity';
const repo = 'BioDrop';
const user = 'CBID2';
const url = `/search?org=${org}&repo=${repo}&user=${user}`

test.describe('accessibility tests (light)', () => {
  test.use({ colorScheme: 'light' });

  test('should pass axe wcag accessibility tests (light)', async ({ page }) => {
    await page.goto(url);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('accessibility tests (dark)', () => {
  test.use({ colorScheme: 'dark' });

  test('should pass axe wcag accessibility tests (dark)', async ({ page }) => {
    await page.goto(url);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
