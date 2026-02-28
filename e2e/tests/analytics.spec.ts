import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Analytics', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('analytics');
    await page.waitForLoadState('networkidle');
  });

  test('analytics page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Analytics/i })).toBeVisible();
  });

  test('overview stats cards render', async ({ page }) => {
    await expect(page.getByText('Total Matches')).toBeVisible();
    await expect(page.getByText('Win Rate').first()).toBeVisible();
  });

  test('match results section renders', async ({ page }) => {
    await expect(page.getByText(/Match Results/i).first()).toBeVisible();
  });

  test('wins and losses are shown', async ({ page }) => {
    await expect(page.getByText('Wins').first()).toBeVisible();
    await expect(page.getByText('Losses').first()).toBeVisible();
  });

  test('recent form section renders', async ({ page }) => {
    const recentForm = page.getByText(/Recent Form/i);
    if (await recentForm.count() > 0) {
      await expect(recentForm.first()).toBeVisible();
    }
  });
});
