import type { Page } from '@playwright/test';
import { SUPER_ADMIN_PASSWORD, ADMIN_PASSWORD } from './test-data';

// Store the seeded club ID (set by global setup)
let testClubId = '';

export function setTestClubId(id: string) {
  testClubId = id;
}

export function getTestClubId(): string {
  return testClubId;
}

/**
 * Select the test club by setting localStorage and navigating to the app.
 */
export async function selectClub(page: Page, clubId?: string): Promise<void> {
  const id = clubId || testClubId;
  await page.goto('.');
  await page.evaluate((cid) => {
    localStorage.setItem('cm-club-id', cid);
  }, id);
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Login as club admin by setting localStorage flag.
 */
export async function loginAsAdmin(page: Page, clubId?: string): Promise<void> {
  const id = clubId || testClubId;
  await page.evaluate((cid) => {
    localStorage.setItem(`cm-admin-${cid}`, 'true');
  }, id);
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Select club AND login as admin in one step.
 */
export async function selectClubAndLoginAsAdmin(page: Page, clubId?: string): Promise<void> {
  const id = clubId || testClubId;
  await page.goto('.');
  await page.evaluate((cid) => {
    localStorage.setItem('cm-club-id', cid);
    localStorage.setItem(`cm-admin-${cid}`, 'true');
  }, id);
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Login as Super Admin via the login form.
 */
export async function loginAsSuperAdmin(page: Page): Promise<void> {
  await page.goto('super-admin');
  await page.getByPlaceholder('Enter password').fill(SUPER_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Login as club admin via the Settings page password form.
 */
export async function loginAsAdminViaForm(page: Page): Promise<void> {
  await page.goto('settings');
  await page.waitForLoadState('networkidle');
  const passwordInput = page.getByPlaceholder('Enter admin password');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForTimeout(500);
  }
}

/**
 * Clear all test-related localStorage and reset state.
 */
export async function clearAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('cm-')) {
        localStorage.removeItem(key);
      }
    });
  });
}
