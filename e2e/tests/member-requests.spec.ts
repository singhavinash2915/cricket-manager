import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Member Requests', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('requests');
    await page.waitForLoadState('networkidle');
  });

  test('requests page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Member Requests|Join Requests/i })).toBeVisible();
  });

  test('join request form is accessible', async ({ page }) => {
    const requestBtn = page.getByRole('button', { name: /Request to Join/i });
    if (await requestBtn.isVisible()) {
      await requestBtn.click();
      await page.waitForTimeout(500);

      await expect(page.getByPlaceholder('Enter your full name')).toBeVisible();
    }
  });

  test('submit a join request', async ({ page }) => {
    const requestBtn = page.getByRole('button', { name: /Request to Join/i });
    if (await requestBtn.isVisible()) {
      await requestBtn.click();
      await page.waitForTimeout(500);

      await page.getByPlaceholder('Enter your full name').fill('E2E Test Joiner');
      await page.getByPlaceholder('e.g., 9876543210').fill('9100008888');

      const messageInput = page.getByPlaceholder(/Tell us why you want to join/i);
      if (await messageInput.isVisible()) {
        await messageInput.fill('I want to join the club for E2E testing');
      }

      await page.getByRole('button', { name: /Submit Request/i }).click();
      await page.waitForTimeout(2000);
    }
  });

  test('filter requests by status', async ({ page }) => {
    const pendingFilter = page.getByText('Pending', { exact: true });
    if (await pendingFilter.count() > 0) {
      await pendingFilter.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('admin can approve a request', async ({ page }) => {
    // Look for approve button on any pending request
    const approveBtn = page.getByRole('button', { name: /Approve/i });
    if (await approveBtn.count() > 0) {
      await approveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });
});
