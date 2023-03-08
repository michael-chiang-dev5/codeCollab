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
      "If you want to contribute to this project, message @michael-chiang-dev5 on LinkedIn and we'll figure something out!"
    )
  ).toHaveCount(1);
});
