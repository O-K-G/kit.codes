import { webkit, devices } from "playwright";

// iPhone 15 Pro: the flagship iPhone as of ~2 years ago (Sept 2023 - Sept 2024).
const DEVICE = devices["iPhone 15 Pro"];
const url = process.env.APP_URL || "http://localhost:3000";

const browser = await webkit.launch({ headless: false });
// tls-proxy uses a self-signed cert (Caddy's `tls internal`); trust it.
const context = await browser.newContext({
  ...DEVICE,
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();
await page.goto(url);

// No timeout: stay open until the window is closed manually.
await new Promise((resolve) => {
  page.on("close", resolve);
  browser.on("disconnected", resolve);
});
