import { test, expect, type Page } from '@playwright/test';

test('text is shared across browsers', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('http://localhost:8080/ComponentCollabRepl');
  await page2.goto('http://localhost:8080/ComponentCollabRepl');

  await page1.getByRole('textbox').fill('this text entered in page1');
  await expect(page2.getByText('this text entered in page')).toHaveCount(1);
});
