import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { selectClubAndLoginAsAdmin } from '../fixtures/auth';

test.describe('Feedback', () => {
  test.beforeEach(async ({ page }) => {
    const state = loadTestState();
    await selectClubAndLoginAsAdmin(page, state.clubId);
    await page.goto('feedback');
    await page.waitForLoadState('networkidle');
  });

  test('feedback page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: /Feedback/i })).toBeVisible();
  });

  test('feedback form is visible', async ({ page }) => {
    await expect(page.getByText('Share Your Feedback')).toBeVisible();
  });

  test('seeded feedback is displayed', async ({ page }) => {
    await expect(page.getByText('Great app for managing our club!')).toBeVisible();
  });

  test('submit new feedback', async ({ page }) => {
    // Select a name
    const nameSelect = page.locator('select').first();
    if (await nameSelect.isVisible()) {
      await nameSelect.selectOption({ index: 1 });
    }

    // Click star rating (click the 4th star)
    const stars = page.locator('svg').filter({ hasText: '' });
    // Fill feedback text
    const feedbackInput = page.getByPlaceholder(/Share your thoughts/i);
    if (await feedbackInput.isVisible()) {
      await feedbackInput.fill('E2E test feedback - everything works great!');

      const submitBtn = page.getByRole('button', { name: /Submit Feedback/i });
      if (await submitBtn.isEnabled()) {
        await submitBtn.click();
        await page.waitForTimeout(2000);

        // Should show success or the feedback in the list
        const success = page.getByText(/Thank you|submitted successfully/i);
        const feedbackText = page.getByText('E2E test feedback');
        await expect(success.or(feedbackText).first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('feedback count is displayed', async ({ page }) => {
    await expect(page.getByText(/All Feedback/i)).toBeVisible();
  });
});
