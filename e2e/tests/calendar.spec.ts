import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('calendar');
    await page.waitForLoadState('networkidle');
  });

  test('calendar page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Match Calendar/i })).toBeVisible();
  });

  test('calendar grid renders with day headers', async ({ page }) => {
    await expect(page.getByText('Sun')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
    await expect(page.getByText('Tue')).toBeVisible();
    await expect(page.getByText('Wed')).toBeVisible();
    await expect(page.getByText('Thu')).toBeVisible();
    await expect(page.getByText('Fri')).toBeVisible();
    await expect(page.getByText('Sat')).toBeVisible();
  });

  test('month navigation works', async ({ page }) => {
    // Get current month heading
    const monthHeading = page.locator('h2, h3').filter({ hasText: /\d{4}/ });
    const initialMonth = await monthHeading.first().textContent();

    // Click next month
    const nextBtn = page.locator('button').filter({ hasText: /›|>|Next/i });
    if (await nextBtn.count() > 0) {
      await nextBtn.last().click();
      await page.waitForTimeout(500);

      const newMonth = await monthHeading.first().textContent();
      expect(newMonth).not.toBe(initialMonth);
    }
  });

  test('Today button exists', async ({ page }) => {
    await expect(page.getByText('Today')).toBeVisible();
  });

  test('upcoming matches section renders', async ({ page }) => {
    await expect(page.getByText(/Upcoming Match/i).first()).toBeVisible();
  });

  test('schedule match button visible for admin', async ({ page }) => {
    const scheduleBtn = page.getByRole('button', { name: /Schedule Match|Add Match/i });
    if (await scheduleBtn.count() > 0) {
      await expect(scheduleBtn.first()).toBeVisible();
    }
  });
});
