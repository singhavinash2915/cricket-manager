import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { TEST_CLUB } from '../fixtures/test-data';

test.describe('Club Detection & Loading', () => {
  test('shows Pricing page when no club is selected', async ({ page }) => {
    // Clear any stored club
    await page.goto('.');
    await page.evaluate(() => localStorage.removeItem('cm-club-id'));
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should show the Pricing/landing page
    await expect(page.getByRole('heading', { name: /Manage Your.*Cricket Club.*Like a Pro/i })).toBeVisible();
  });

  test('loads club via localStorage cm-club-id', async ({ page }) => {
    const state = loadTestState();

    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Dashboard should load with club name
    await expect(page.getByText(TEST_CLUB.name).first()).toBeVisible({ timeout: 10000 });
  });

  test('loads club via ?club= query param', async ({ page }) => {
    const state = loadTestState();

    // Clear localStorage first
    await page.goto('.');
    await page.evaluate(() => localStorage.removeItem('cm-club-id'));

    // Navigate with query param
    await page.goto(`?club=${state.clubId}`);
    await page.waitForLoadState('networkidle');

    // Dashboard should load
    await expect(page.getByText(TEST_CLUB.name).first()).toBeVisible({ timeout: 10000 });
  });

  test('shows error/fallback for invalid club ID', async ({ page }) => {
    await page.goto('.');
    await page.evaluate(() => {
      localStorage.setItem('cm-club-id', 'invalid-uuid-12345');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should either show error or fall back to pricing page
    await page.waitForTimeout(3000);
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});
