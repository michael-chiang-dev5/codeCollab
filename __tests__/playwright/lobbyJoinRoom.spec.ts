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

  // // TODO: This test does not work. page2 correctly visits room/1/aaa, but socket.io never makes a connection with the signal server since headless browser does not have a webcam
  // // The way we implemented Zoom is that the page attempts to access the webcam, then it makes websocket connection with signal server. If you never load the webcam you don't access the signal server
  // // Is this desired behavior? See lobbyJoinRoom/README.md for a discussion
  // //
  // await page2.goto(`${process.env.URL}room/1/aaa`);
  // await page2.screenshot({ path: 'screenshot.png' });
  // await page1.goto(`${process.env.URL}lobbyJoinRoom`);
  // await expect(page1.getByText('1 users in 1 rooms')).toHaveCount(1);

  // const html = await page1.content();
});
