import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve("dist");
const outputRoot = path.resolve("assets");

function mime(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const relative = url.pathname === "/" ? "index.html" : url.pathname.replace(/^[/]+/, "");
    const filePath = path.resolve(root, relative);
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    const bytes = await readFile(filePath);
    res.writeHead(200, { "content-type": mime(filePath), "cache-control": "no-store" });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const url = "http://127.0.0.1:" + address.port + "/";

const browser = await chromium.launch({ headless: true });

async function capture({ locale, viewport, mobile, output }) {
  const context = await browser.newContext({
    locale,
    viewport,
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const icon = document.querySelector("#startIcon");
    return icon && String(icon.getAttribute("src") || "").startsWith("data:image/svg+xml");
  });
  await page.screenshot({
    path: path.join(outputRoot, output),
    fullPage: true
  });
  await context.close();
}

try {
  await capture({ locale: "ja-JP", viewport: { width: 1440, height: 1000 }, mobile: false, output: "screenshot.png" });
  await capture({ locale: "en-US", viewport: { width: 1440, height: 1000 }, mobile: false, output: "screenshot-en.png" });
  await capture({ locale: "ja-JP", viewport: { width: 390, height: 844 }, mobile: true, output: "screenshot-mobile.png" });
  await capture({ locale: "en-US", viewport: { width: 390, height: 844 }, mobile: true, output: "screenshot-mobile-en.png" });
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
