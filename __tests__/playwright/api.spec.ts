import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('api/markdown/library endpoint works', async ({ page }) => {
  await page.goto(`${process.env.URL}api/markdown/library`);
  //   const html = await page.content();
  await expect(page.getByText('Challenge 1')).toHaveCount(1);
});

test('api/markdown/:id endpoint works', async ({ page }) => {
  await page.goto(`${process.env.URL}api/markdown/1`);
  await expect(
    page.getByText('message @michael-chiang-dev5 on LinkedIn')
  ).toHaveCount(1);
});

test('api/markdown/:id error handler works', async ({ page }) => {
  await page.goto(`${process.env.URL}api/markdown/nonexistent`);
  await expect(page.getByText('"/api/markdown/:id"')).toHaveCount(1);
});
