import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('text is shared across browsers', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  const page3 = await context.newPage();
  const page4 = await context.newPage();

  // Test that no rooms are present
  await page1.goto(`${process.env.URL}lobbyJoinRoom`);
  await expect(
    page1.getByText('Nobody here! You should create a new room instead')
  ).toHaveCount(1);

  // // This test does not work, probably because user needs to accept webcam to join room. Need to create mock
  // // user1 joins room aaa
  // await page2.goto(`${process.env.URL}room/1/aaa`);
  // await page1.goto(`${process.env.URL}lobbyJoinRoom`);
  // await expect(page1.getByText('1 users in 1 rooms')).toHaveCount(1);

  // const html = await page1.content();
});
