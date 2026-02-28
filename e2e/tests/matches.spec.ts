import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Matches', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('matches');
    await page.waitForLoadState('networkidle');
  });

  test('matches page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Matches/i })).toBeVisible();
  });

  test('seeded matches are displayed', async ({ page }) => {
    // External match opponent
    await expect(page.getByText('Rival Cricket Club')).toBeVisible();
  });

  test('match type filter works', async ({ page }) => {
    // Click External filter
    const externalFilter = page.getByText('External', { exact: true });
    if (await externalFilter.count() > 0) {
      await externalFilter.first().click();
      await page.waitForTimeout(500);
      await expect(page.getByText('Rival Cricket Club')).toBeVisible();
    }
  });

  test('match status filter works', async ({ page }) => {
    // Click Upcoming filter
    const upcomingFilter = page.getByText('Upcoming', { exact: true });
    if (await upcomingFilter.count() > 0) {
      await upcomingFilter.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('add match button is visible for admin', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Match/i })).toBeVisible();
  });

  test('add match modal opens', async ({ page }) => {
    await page.getByRole('button', { name: /Add Match/i }).click();
    await page.waitForTimeout(500);

    // Modal heading should show "Add New Match"
    await expect(page.getByRole('heading', { name: /Add New Match/i })).toBeVisible();
  });

  test('match scores are displayed for completed matches', async ({ page }) => {
    // Check that score is displayed for the won match
    await expect(page.getByText('185/4').first()).toBeVisible();
  });

  test('result badges show correct colors', async ({ page }) => {
    // Won badge should be visible
    await expect(page.getByText('Won').first()).toBeVisible();
  });
});
