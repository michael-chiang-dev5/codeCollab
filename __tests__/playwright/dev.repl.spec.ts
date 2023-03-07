import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/ComponentCollabRepl');
});

test('repl evalutes function correctly', async ({ page }) => {
  await page.goto('https://code-collab.org/ComponentCollabRepl');
  await page.getByRole('textbox').click();
  await page
    .getByRole('textbox')
    .fill('const addOne = (n) => n+1;\nconsole.log(addOne(12345))');
  await page.getByText('run').click();
  await expect(page.getByText('12346')).toHaveCount(1);
  await expect(page.getByText('12347')).toHaveCount(0);
});
