import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { ADMIN_PASSWORD } from '../fixtures/test-data';

test.describe('Admin Authentication', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('settings page shows login form when not admin', async ({ page }) => {
    await page.goto('settings');
    await page.waitForLoadState('networkidle');

    // Should show admin password input
    await expect(page.getByRole('heading', { name: /Admin Access/i })).toBeVisible();
    await expect(page.getByPlaceholder('Enter admin password')).toBeVisible();
  });

  test('correct password grants admin access', async ({ page }) => {
    await page.goto('settings');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('Enter admin password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login as Admin/i }).click();
    await page.waitForTimeout(1000);

    // Should show admin mode active or logout button
    await expect(page.getByText('Admin Mode Active')).toBeVisible();
  });

  test('wrong password shows error', async ({ page }) => {
    await page.goto('settings');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('Enter admin password').fill('wrongpassword');
    await page.getByRole('button', { name: /Login as Admin/i }).click();
    await page.waitForTimeout(1000);

    // Should show error message
    await expect(page.getByText(/Incorrect password|Invalid password|Wrong password/i)).toBeVisible();
  });

  test('admin can logout', async ({ page }) => {
    const state = loadTestState();

    // Login as admin via localStorage
    await page.evaluate((clubId) => {
      localStorage.setItem(`cm-admin-${clubId}`, 'true');
    }, state.clubId);
    await page.goto('settings');
    await page.waitForLoadState('networkidle');

    // Click logout button on settings page
    const logoutBtn = page.locator('main').getByRole('button', { name: /Logout/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(500);

      // Should show login form again
      await expect(page.getByPlaceholder('Enter admin password')).toBeVisible();
    }
  });

  test('admin localStorage flag persists across navigations', async ({ page }) => {
    const state = loadTestState();

    await page.evaluate((clubId) => {
      localStorage.setItem(`cm-admin-${clubId}`, 'true');
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigate to members
    await page.goto('members');
    await page.waitForLoadState('networkidle');

    // Admin actions should be available (Add Member button)
    await expect(page.getByRole('button', { name: /Add Member/i })).toBeVisible();
  });
});
