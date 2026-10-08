// Browser UI tests use normal controls only. They never start or simulate a camera.
import assert from "node:assert/strict";
import http from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const html = await readFile(new URL("../dist/index.html", import.meta.url));
const config = JSON.parse(await readFile(new URL("../app.config.json", import.meta.url), "utf8"));
await mkdir("tmp-review-ui", { recursive: true });
const server = http.createServer((request, response) => {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 320, height: 640 }]) {
    const context = await browser.newContext({ viewport, locale: "en-US" });
    const page = await context.newPage();
    const errors = [], externalRequests = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => {
      const url = new URL(request.url());
      if (!["data:", "blob:", "file:"].includes(url.protocol) && !(url.hostname === "127.0.0.1" && url.port === String(server.address().port))) externalRequests.push(request.url());
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: "networkidle" });
    const geometry = await page.evaluate(() => {
      const badge = document.querySelector(".version-badge").getBoundingClientRect();
      const brand = document.querySelector(".brand-name").getBoundingClientRect();
      return { width: innerWidth, contentWidth: document.documentElement.scrollWidth, badgeRight: badge.right, brandRight: brand.right };
    });
    assert.ok(geometry.contentWidth <= geometry.width, `No horizontal overflow: ${JSON.stringify(geometry)}`);
    assert.ok(geometry.badgeRight <= geometry.brandRight + 1, `Version remains visible: ${JSON.stringify(geometry)}`);
    for (const id of ["languageButton", "helpButton"]) {
      const box = await page.locator(`#${id}`).boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, `${id} retains a 44px hit target`);
    }
    await page.locator("#reviewSettings summary").click();
    for (const value of ["10", "30", "60", "180"]) {
      const button = page.locator(`[data-review-seconds="${value}"]`);
      await button.click();
      assert.equal(await page.locator("#reviewSecondsInput").inputValue(), value);
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, "Preset has at least a 44px hit target");
    }
    await page.locator("#reviewSecondsInput").fill("181");
    await page.locator("#reviewSecondsInput").blur();
    await page.locator("#languageButton").click();
    assert.equal(await page.locator("#reviewSecondsInput").inputValue(), "181");
    assert.equal(await page.locator("#reviewSecondsInput").getAttribute("aria-invalid"), "true");
    assert.equal(await page.locator('[data-review-seconds][aria-pressed="true"]').count(), 0);
    await page.locator('[data-review-seconds="60"]').click();
    assert.equal(await page.locator("#reviewSecondsInput").getAttribute("aria-invalid"), "false");
    await page.locator("#customDelayTrigger").click();
    await page.locator("#customDelayInput").fill("31");
    await page.locator("#customDelayInput").blur();
    await page.locator("#languageButton").click();
    assert.equal(await page.locator("#customDelayInput").inputValue(), "31");
    assert.equal(await page.locator("#customDelayWrap").isVisible(), true);
    await page.locator("#customDelayInput").fill("5");
    await page.locator("#customDelayInput").blur();
    assert.equal(await page.locator("#customDelayWrap").isVisible(), true);
    await page.locator("#reviewSecondsInput").fill("75");
    await page.locator("#reviewSecondsInput").blur();
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("#reviewSettings summary").click();
    assert.equal(await page.locator("#reviewSecondsInput").inputValue(), "75");
    await page.locator("#helpButton").click();
    assert.equal(await page.locator("#helpDialog").isVisible(), true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement?.id === "helpButton");
    assert.equal(await page.locator("#helpDialog").isVisible(), false);
    await page.screenshot({ path: `tmp-review-ui/settings-${viewport.width}.png`, fullPage: true });
    for (const relative of ["../dist/index.html", "../practice-mirror.html", "../dist/index.self-extract.html"]) {
      await page.goto(new URL(relative, import.meta.url).href, { waitUntil: "networkidle" });
      await page.locator("#reviewSettings summary").waitFor({ state: "visible" });
      assert.equal(await page.locator(".version-badge").textContent(), `v${config.version}`);
      await page.locator("#reviewSettings summary").click();
      await page.locator('[data-review-seconds="30"]').click();
      assert.equal(await page.locator("#reviewSecondsInput").inputValue(), "30");
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, []);
    console.log(`Camera-free settings UI passed at ${viewport.width}x${viewport.height}; file:// readable/root/self-extract passed; no external requests or page errors`);
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
