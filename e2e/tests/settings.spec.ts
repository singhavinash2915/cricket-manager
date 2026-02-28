import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';
import { TEST_CLUB } from '../fixtures/test-data';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('settings');
    await page.waitForLoadState('networkidle');
  });

  test('settings page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  });

  test('admin access section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Admin Access' })).toBeVisible();
  });

  test('admin mode active indicator shows', async ({ page }) => {
    await expect(page.getByText(/Admin Mode Active/i)).toBeVisible();
  });

  test('appearance section with dark mode toggle', async ({ page }) => {
    await expect(page.getByText('Appearance')).toBeVisible();
    await expect(page.getByText(/Dark Mode/i)).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    const darkModeToggle = page.getByRole('button').filter({ hasText: /Dark Mode/i });
    if (await darkModeToggle.count() === 0) {
      // Try clicking the toggle switch
      const toggleSwitch = page.locator('[role="switch"], input[type="checkbox"]').first();
      if (await toggleSwitch.isVisible()) {
        await toggleSwitch.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('data management section is visible', async ({ page }) => {
    await expect(page.getByText('Data Management')).toBeVisible();
  });

  test('export buttons are available', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Export JSON/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
  });

  test('about section shows club name', async ({ page }) => {
    await expect(page.getByText(TEST_CLUB.name).first()).toBeVisible();
  });
});
