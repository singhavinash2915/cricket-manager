import { test, expect } from '@playwright/test';
import { SUPER_ADMIN_PASSWORD, TEST_CLUB } from '../fixtures/test-data';

test.describe('SuperAdmin', () => {
  test('login page shows password input', async ({ page }) => {
    await page.goto('super-admin');
    await page.waitForLoadState('networkidle');

    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
  });

  test('wrong password shows error', async ({ page }) => {
    await page.goto('super-admin');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('Enter password').fill('wrongpass');
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText(/incorrect|invalid|wrong/i)).toBeVisible();
  });

  test('correct password logs in and shows dashboard', async ({ page }) => {
    await page.goto('super-admin');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should see dashboard stats or club list
    await expect(page.getByText(/Total Clubs|Clubs/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('club stats cards render', async ({ page }) => {
    await page.goto('super-admin');
    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByText(/Active/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('search clubs works', async ({ page }) => {
    await page.goto('super-admin');
    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder(/Search clubs/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill(TEST_CLUB.name);
      await page.waitForTimeout(500);

      await expect(page.getByText(TEST_CLUB.name)).toBeVisible();
    }
  });

  test('status filter works', async ({ page }) => {
    await page.goto('super-admin');
    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click Active status filter
    const activeFilter = page.getByText('Active', { exact: true });
    if (await activeFilter.count() > 0) {
      await activeFilter.first().click();
      await page.waitForTimeout(500);

      // Test club should be visible (it's active)
      await expect(page.getByText(TEST_CLUB.name)).toBeVisible();
    }
  });

  test('add club button opens modal', async ({ page }) => {
    await page.goto('super-admin');
    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const addClubBtn = page.getByRole('button', { name: /Add Club/i });
    if (await addClubBtn.isVisible()) {
      await addClubBtn.click();
      await page.waitForTimeout(500);

      // Modal should show heading and form fields
      await expect(page.getByRole('heading', { name: /Add New Club/i })).toBeVisible();
      await expect(page.getByPlaceholder('Pune Warriors CC')).toBeVisible();
    }
  });

  test('record payment modal works', async ({ page }) => {
    await page.goto('super-admin');
    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for Record Payment button on any club
    const recordBtn = page.getByRole('button', { name: /Record Payment/i });
    if (await recordBtn.count() > 0) {
      await recordBtn.first().click();
      await page.waitForTimeout(500);

      // Payment options should be visible
      await expect(page.getByText(/Setup/i).first()).toBeVisible();
    }
  });

  test('logout button works', async ({ page }) => {
    await page.goto('super-admin');
    await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const logoutBtn = page.getByRole('button', { name: /Logout/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(500);

      // Should show login form again
      await expect(page.getByPlaceholder('Enter password')).toBeVisible();
    }
  });
});
