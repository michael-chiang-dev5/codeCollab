import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
});

test('production server is serving files', async ({ page }) => {
  await expect(page).toHaveTitle(/code-collab/);
});
