import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
});

// The purpose of this test is to make sure that the page loads
// Expect a title "to contain" "code collab".
test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/code-collab/);
});

// The purpose of this test is to make sure Oauth is at least making it to Google's server
test('log in link', async ({ page }) => {
  // Click the `log in` link.
  await page.getByRole('link', { name: 'log in' }).click();
  // Expects the URL to contain some reference to oauth2.
  await expect(page).toHaveURL(/.*oauth2/);
});
