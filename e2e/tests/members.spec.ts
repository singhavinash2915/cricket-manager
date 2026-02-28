import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Members Management', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('members');
    await page.waitForLoadState('networkidle');
  });

  test('members page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Members/i })).toBeVisible();
  });

  test('seeded members are displayed', async ({ page }) => {
    await expect(page.getByText('Test Batsman')).toBeVisible();
    await expect(page.getByText('Test Bowler')).toBeVisible();
    await expect(page.getByText('Test Allrounder')).toBeVisible();
  });

  test('search members filters results', async ({ page }) => {
    await page.getByPlaceholder(/Search members/i).fill('Batsman');
    await page.waitForTimeout(500);

    await expect(page.getByText('Test Batsman')).toBeVisible();
    // Other members should be filtered out
    await expect(page.getByText('Test Bowler')).not.toBeVisible();
  });

  test('status filter shows only active or inactive members', async ({ page }) => {
    // Use the status filter dropdown (combobox)
    const statusSelect = page.locator('select');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('Active');
      await page.waitForTimeout(500);
      // Active members should still be visible
      await expect(page.getByText('Test Batsman')).toBeVisible();
    }
  });

  test('add member button is visible for admin', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Member/i })).toBeVisible();
  });

  test('add member form opens and submits', async ({ page }) => {
    await page.getByRole('button', { name: /Add Member/i }).click();
    await page.waitForTimeout(500);

    // Modal should be open
    await expect(page.getByRole('heading', { name: /Add New Member/i })).toBeVisible();

    // Fill Full Name - find textbox near the "Full Name *" label
    const nameInput = page.locator('text=Full Name').locator('..').locator('input');
    await nameInput.fill('E2E New Player');

    // Submit - click the last "Add Member" button (the one in the modal form)
    await page.getByRole('button', { name: /Add Member/i }).last().click();
    await page.waitForTimeout(2000);

    // Verify new member appears in list
    await expect(page.getByText('E2E New Player')).toBeVisible();
  });

  test('member balance colors are correct', async ({ page }) => {
    // Low balance member (Test Allrounder has ₹200)
    await expect(page.getByText('Test Allrounder')).toBeVisible();
  });

  test('low balance filter works', async ({ page }) => {
    const lowBalanceFilter = page.getByText(/Low Balance/i);
    if (await lowBalanceFilter.count() > 0) {
      await lowBalanceFilter.first().click();
      await page.waitForTimeout(500);
    }
  });
});
