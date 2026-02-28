import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
  });

  test('sidebar navigation links work - Members', async ({ page }) => {
    await page.goto('members');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Members/i })).toBeVisible();
  });

  test('sidebar navigation links work - Matches', async ({ page }) => {
    await page.goto('matches');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Matches/i })).toBeVisible();
  });

  test('sidebar navigation links work - Tournaments', async ({ page }) => {
    await page.goto('tournaments');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Tournaments/i })).toBeVisible();
  });

  test('sidebar navigation links work - Finance', async ({ page }) => {
    await page.goto('finance');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Finance/i })).toBeVisible();
  });

  test('sidebar navigation links work - Calendar', async ({ page }) => {
    await page.goto('calendar');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Match Calendar/i })).toBeVisible();
  });

  test('sidebar navigation links work - Analytics', async ({ page }) => {
    await page.goto('analytics');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Analytics/i })).toBeVisible();
  });

  test('sidebar navigation links work - Requests', async ({ page }) => {
    await page.goto('requests');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Member Requests|Join Requests/i })).toBeVisible();
  });

  test('sidebar navigation links work - Settings', async ({ page }) => {
    await page.goto('settings');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  });

  test('sidebar navigation links work - Feedback', async ({ page }) => {
    await page.goto('feedback');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1, name: /Feedback/i })).toBeVisible();
  });

  test('sidebar navigation links work - About', async ({ page }) => {
    await page.goto('about');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /About Us/i })).toBeVisible();
  });

  test('sidebar navigation links work - Dashboard', async ({ page }) => {
    await page.goto('.');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('mobile nav renders on small viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('.');
    await page.waitForLoadState('networkidle');

    // Bottom nav should be visible
    await expect(page.locator('nav.lg\\:hidden').getByText('Home')).toBeVisible();
    await expect(page.locator('nav.lg\\:hidden').getByText('More')).toBeVisible();
  });

  test('mobile nav items navigate correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('.');
    await page.waitForLoadState('networkidle');

    // Click Members nav item scoped to bottom nav
    await page.locator('nav.lg\\:hidden').getByText('Members').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/members/);
  });

  test('mobile More menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('.');
    await page.waitForLoadState('networkidle');

    // Click More button scoped to bottom nav
    await page.locator('nav.lg\\:hidden').getByText('More').click();
    await page.waitForTimeout(500);

    // Menu overlay should show club name heading (h2)
    await expect(page.getByRole('heading', { level: 2, name: /Cricket Club/i })).toBeVisible();
  });
});
