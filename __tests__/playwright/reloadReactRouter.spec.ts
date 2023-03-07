import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.beforeEach(async ({ page }) => {
  await page.goto(`${process.env.URL}room/1/100`);
});

// The purpose of this test is to make sure that accessing a page directly instead of going through react router works
test('refresh on react router route works', async ({ page }) => {
  await expect(
    page.getByText(
      'Welcome to Code-Collab! This is a webapp where you can grind DSA with other people. To get started, scroll down to the bottom and select a category you want to practice.'
    )
  ).toHaveCount(1);
});
