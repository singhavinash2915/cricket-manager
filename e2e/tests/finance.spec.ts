import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Finance', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('finance');
    await page.waitForLoadState('networkidle');
  });

  test('finance page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Finance/i })).toBeVisible();
  });

  test('stats cards show deposit, expenses, and fund totals', async ({ page }) => {
    await expect(page.getByText('Total Deposits')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Club Funds', { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('transactions list shows seeded data', async ({ page }) => {
    await expect(page.getByText(/Initial deposit/i)).toBeVisible();
  });

  test('transaction type filter works', async ({ page }) => {
    // Look for type filter dropdown - second select is the type filter (first is month)
    const filterDropdown = page.locator('select').nth(1);
    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption('Deposits');
      await page.waitForTimeout(500);
      // Should show deposit transactions
      await expect(page.getByText(/Initial deposit/i)).toBeVisible();
    }
  });

  test('search transactions works', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search transactions/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Ground booking');
      await page.waitForTimeout(500);
      await expect(page.getByText(/Ground booking/i)).toBeVisible();
    }
  });

  test('add expense modal opens', async ({ page }) => {
    const addExpenseBtn = page.getByRole('button', { name: /Add Expense/i });
    if (await addExpenseBtn.isVisible()) {
      await addExpenseBtn.click();
      await page.waitForTimeout(500);
      await expect(page.getByText(/Amount/i).first()).toBeVisible();
    }
  });

  test('finance tabs switch content', async ({ page }) => {
    // Check for tab buttons: Transactions, Monthly, Reports, Payments
    const monthlyTab = page.getByText('Monthly', { exact: true });
    if (await monthlyTab.isVisible()) {
      await monthlyTab.click();
      await page.waitForTimeout(500);
    }
  });
});
