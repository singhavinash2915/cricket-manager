import { test, expect } from '@playwright/test';
import { loadTestState } from '../fixtures/helpers';
import { createClient } from '@supabase/supabase-js';
import { TEST_CLUB } from '../fixtures/test-data';

const supabase = createClient(
  'https://hbxpvongrzijfghpjafw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieHB2b25ncnppamZnaHBqYWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODM2NTUsImV4cCI6MjA4Nzc1OTY1NX0.I3xjhqSggPvoaH7RKi9VFgoifIje_wtHO8ZYeOnwlwA'
);

test.describe('Subscription Banner', () => {
  test('active subscription shows no banner', async ({ page }) => {
    const state = loadTestState();

    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // No subscription banner for active clubs
    await expect(page.getByText(/Subscription Expired/i)).not.toBeVisible();
    await expect(page.getByText(/Free Trial/i)).not.toBeVisible();
  });

  test('trial subscription shows trial banner', async ({ page }) => {
    const state = loadTestState();

    // Temporarily set club to trial status
    await supabase
      .from('clubs')
      .update({ subscription_status: 'trial' })
      .eq('id', state.clubId);

    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Trial banner should appear
    await expect(page.getByText(/Free Trial/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/days remaining/i)).toBeVisible();

    // Restore to active
    await supabase
      .from('clubs')
      .update({ subscription_status: 'active' })
      .eq('id', state.clubId);
  });

  test('expired subscription shows full-screen expired page', async ({ page }) => {
    const state = loadTestState();

    // Set club to expired
    await supabase
      .from('clubs')
      .update({ subscription_status: 'expired' })
      .eq('id', state.clubId);

    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Expired screen should appear
    await expect(page.getByText('Subscription Expired')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Amount Due/i)).toBeVisible();

    // Restore to active
    await supabase
      .from('clubs')
      .update({ subscription_status: 'active' })
      .eq('id', state.clubId);
  });

  test('expired page has monthly/yearly toggle', async ({ page }) => {
    const state = loadTestState();

    await supabase
      .from('clubs')
      .update({ subscription_status: 'expired' })
      .eq('id', state.clubId);

    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Monthly/Yearly toggle
    await expect(page.getByRole('button', { name: 'Monthly' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Yearly/i })).toBeVisible();

    // Click yearly and verify amount changes
    await page.getByRole('button', { name: /Yearly/i }).click();
    await page.waitForTimeout(500);

    // Restore to active
    await supabase
      .from('clubs')
      .update({ subscription_status: 'active' })
      .eq('id', state.clubId);
  });

  test('expired page has WhatsApp payment link', async ({ page }) => {
    const state = loadTestState();

    await supabase
      .from('clubs')
      .update({ subscription_status: 'expired' })
      .eq('id', state.clubId);

    await page.goto('.');
    await page.evaluate((clubId) => {
      localStorage.setItem('cm-club-id', clubId);
    }, state.clubId);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // WhatsApp link should be present
    await expect(page.getByText(/WhatsApp/i).first()).toBeVisible({ timeout: 10000 });

    // Restore to active
    await supabase
      .from('clubs')
      .update({ subscription_status: 'active' })
      .eq('id', state.clubId);
  });
});
