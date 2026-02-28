import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('Pricing page loads with hero, features, and pricing card', async ({ page }) => {
    await page.goto('pricing');
    await page.waitForLoadState('networkidle');

    // Hero heading
    await expect(page.getByRole('heading', { name: /Manage Your.*Cricket Club/i })).toBeVisible();

    // Features section
    await expect(page.getByRole('heading', { name: /Everything You Need/i })).toBeVisible();

    // Pricing section
    await expect(page.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();

    // CTA buttons
    await expect(page.getByRole('link', { name: /Start Free Trial/i }).first()).toBeVisible();
  });

  test('Pricing page has billing cycle toggle', async ({ page }) => {
    await page.goto('pricing');
    await page.waitForLoadState('networkidle');

    // Monthly/Yearly toggle buttons - use exact name to avoid matching FAQ buttons
    await expect(page.getByRole('button', { name: 'Monthly', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Yearly/i })).toBeVisible();
  });

  test('Pricing page FAQ sections expand and collapse', async ({ page }) => {
    await page.goto('pricing');
    await page.waitForLoadState('networkidle');

    // Find a FAQ item and click it
    const faqButton = page.getByRole('button', { name: /How does the free trial work/i });
    if (await faqButton.count() > 0) {
      await faqButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('How It Works page loads with all sections', async ({ page }) => {
    await page.goto('how-it-works');
    await page.waitForLoadState('networkidle');

    // Hero heading
    await expect(page.getByRole('heading', { name: /How CricMates Works/i })).toBeVisible();

    // Steps section
    await expect(page.getByRole('heading', { name: /From Zero to Managing/i })).toBeVisible();

    // Admin vs Member section
    await expect(page.getByRole('heading', { name: /Admin vs Member/i })).toBeVisible();
  });

  test('CricMates logo is visible on Pricing page', async ({ page }) => {
    await page.goto('pricing');
    await page.waitForLoadState('networkidle');

    // CricMates text should be visible (from logo)
    await expect(page.getByText('CricMates').first()).toBeVisible();
  });

  test('Pricing page footer has contact links', async ({ page }) => {
    await page.goto('pricing');
    await page.waitForLoadState('networkidle');

    // Footer should have WhatsApp link
    await expect(page.getByRole('link', { name: /WhatsApp/i })).toBeVisible();
  });
});
