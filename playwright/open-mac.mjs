import { webkit, devices } from "playwright";

// Playwright has no per-model Mac descriptors, so "Desktop Safari" (its only
// Mac/Safari preset) is the closest available stand-in for a ~2-year-old Mac.
const DEVICE = devices["Desktop Safari"];
const url = process.env.APP_URL || "http://localhost:3000";

const browser = await webkit.launch({ headless: false });
const context = await browser.newContext({ ...DEVICE });
const page = await context.newPage();
await page.goto(url);

// No timeout: stay open until the window is closed manually.
await new Promise((resolve) => {
  page.on("close", resolve);
  browser.on("disconnected", resolve);
});
