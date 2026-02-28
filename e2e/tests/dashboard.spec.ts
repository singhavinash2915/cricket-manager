import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
  });

  test('dashboard loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('stats cards show member count', async ({ page }) => {
    await expect(page.getByText('Members').first()).toBeVisible();
  });

  test('stats cards show total funds', async ({ page }) => {
    await expect(page.getByText('Total Funds')).toBeVisible();
  });

  test('stats cards show matches count', async ({ page }) => {
    await expect(page.getByText('Matches').first()).toBeVisible();
  });

  test('stats cards show win rate', async ({ page }) => {
    await expect(page.getByText('Win Rate')).toBeVisible();
  });

  test('join club banner is visible', async ({ page }) => {
    await expect(page.getByText(/Want to Join/i)).toBeVisible();
  });

  test('recent matches section exists', async ({ page }) => {
    await expect(page.getByText('Recent Matches')).toBeVisible();
  });

  test('finance chart section exists', async ({ page }) => {
    await expect(page.getByText(/Monthly Finance Overview/i)).toBeVisible();
  });

  test('upcoming matches section renders', async ({ page }) => {
    await expect(page.getByText(/Upcoming Match/i).first()).toBeVisible();
  });
});
