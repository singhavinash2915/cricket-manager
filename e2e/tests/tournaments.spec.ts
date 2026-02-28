import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Tournaments', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('tournaments');
    await page.waitForLoadState('networkidle');
  });

  test('tournaments page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tournaments/i })).toBeVisible();
  });

  test('seeded tournament is displayed', async ({ page }) => {
    await expect(page.getByText('E2E Test Tournament').first()).toBeVisible();
  });

  test('tournament stats cards render', async ({ page }) => {
    await expect(page.getByText('Tournaments Won')).toBeVisible();
    await expect(page.getByText('Total Played')).toBeVisible();
  });

  test('tournament status filter works', async ({ page }) => {
    const completedFilter = page.getByText('Completed', { exact: true });
    if (await completedFilter.count() > 0) {
      await completedFilter.first().click();
      await page.waitForTimeout(500);
      await expect(page.getByText('E2E Test Tournament').first()).toBeVisible();
    }
  });

  test('add tournament button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Tournament/i })).toBeVisible();
  });

  test('add tournament modal opens with form', async ({ page }) => {
    await page.getByRole('button', { name: /Add Tournament/i }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText(/Add New Tournament/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Bangalore Premier League/i)).toBeVisible();
  });

  test('tournament detail view opens', async ({ page }) => {
    // Click View button on the seeded tournament
    const viewBtn = page.getByRole('button', { name: /View/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
      await page.waitForTimeout(500);

      // Should show tournament details
      await expect(page.getByText('E2E Test Tournament').first()).toBeVisible();
    }
  });

  test('tournament result badge shows winner', async ({ page }) => {
    await expect(page.getByText(/Winner/i).first()).toBeVisible();
  });
});
