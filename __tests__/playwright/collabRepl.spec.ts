import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('text is shared across browsers', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto(`${process.env.URL}ComponentCollabRepl`);
  await page2.goto(`${process.env.URL}ComponentCollabRepl`);

  await page1.getByRole('textbox').fill('this text entered in page1');
  await expect(page2.getByText('this text entered in page')).toHaveCount(1);
});
