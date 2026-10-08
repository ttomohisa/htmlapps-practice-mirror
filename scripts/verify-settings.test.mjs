// Source-level settings regression tests. DOM stubs do not test camera/media behavior.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

const source = readFileSync(process.env.PRACTICE_MIRROR_HTML || new URL("../src/index.template.html", import.meta.url), "utf8");
function declaration(name) {
  const start = source.indexOf(`    function ${name}(`);
  assert.notEqual(start, -1, `Missing production function ${name}`);
  const next = source.slice(start + 1).search(/\n    (?:(?:async )?function |const |window\.)/);
  return source.slice(start, start + 1 + next);
}
function element(markup = "") {
  const attributes = new Map([...markup.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
  const listeners = new Map();
  return {
    attributes, listeners, value: attributes.get("value") || "", textContent: "", hidden: /\shidden(?:\s|>)/.test(markup),
    dataset: Object.fromEntries([...attributes].filter(([key]) => key.startsWith("data-")).map(([key, value]) => [key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), value])),
    setAttribute(key, value) { attributes.set(key, String(value)); },
    getAttribute(key) { return attributes.get(key) ?? null; },
    addEventListener(type, handler) { listeners.set(type, handler); },
    fire(type) { listeners.get(type)?.({ target: this }); },
    focus() {},
  };
}
function harness(saved = {}) {
  const nodes = [...source.matchAll(/<[^!][^>]*>/g)].map(match => element(match[0]));
  const els = Object.fromEntries(nodes.filter(node => node.getAttribute("id")).map(node => [node.getAttribute("id"), node]));
  const presets = nodes.filter(node => node.dataset.reviewSeconds !== undefined);
  const delays = nodes.filter(node => node.dataset.delay !== undefined);
  const storage = new Map(Object.entries(saved));
  const document = {
    activeElement: null, documentElement: { lang: "ja" },
    querySelectorAll(selector) {
      if (selector.includes("data-review-seconds")) return presets;
      if (selector.includes("data-delay")) return delays;
      const key = /^\[([\w-]+)\]$/.exec(selector)?.[1];
      return key ? nodes.filter(node => node.getAttribute(key) !== null) : [];
    },
  };
  const context = vm.createContext({
    els, document, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    APP_CONFIG: { name: "Practice Mirror", nameJa: "Practice Mirror" },
    requestAnimationFrame: callback => callback(), renderGuides() {}, updateReviewUI() {}, applyMirror() {}, setPracticeToolsOpen() {},
  });
  const constants = source.slice(source.indexOf("    const translations ="), source.indexOf("    const $ ="));
  const functions = ["readStorage", "writeStorage", "t", "applyLanguage", "updateDelayLabels", "setDelaySeconds", "normalizeCustomDelay", "updateReviewSettingsUI", "setReviewSeconds", "normalizeReviewSeconds"].map(declaration).join("\n");
  vm.runInContext(`${constants}\n${functions}\nfunction updatePhaseUI(){ updateDelayLabels(); }`, context);
  const listeners = source.split("\n").filter(line => /addEventListener/.test(line) && /data-review-seconds|customDelayTrigger\.addEventListener|customDelayInput\.addEventListener|reviewSecondsInput\.addEventListener/.test(line)).join("\n");
  vm.runInContext(listeners, context);
  const initialization = source.split("\n").find(line => line.trimStart().startsWith("const savedDelay="));
  vm.runInContext(initialization, context);
  vm.runInContext("applyLanguage('ja'); updateDelayLabels(); updateReviewSettingsUI();", context);
  return { els, presets, storage, run: code => vm.runInContext(code, context) };
}

test("invalid Review draft survives a language change with its error and last valid value", () => {
  const app = harness();
  app.run("setReviewSeconds(60)");
  app.els.reviewSecondsInput.value = "181";
  assert.equal(app.run("normalizeReviewSeconds()"), false);
  app.run("applyLanguage('en')");
  assert.equal(app.els.reviewSecondsInput.value, "181");
  assert.equal(app.els.reviewSecondsInput.getAttribute("aria-invalid"), "true");
  assert.equal(app.els.reviewSecondsError.textContent, "Enter a whole number from 10 to 180.");
  assert.equal(app.storage.get("practice-mirror-review-seconds"), "60");
});

test("empty Review draft is not silently reset by language refresh", () => {
  const app = harness();
  app.els.reviewSecondsInput.value = "";
  app.els.reviewSecondsInput.fire("input");
  app.run("applyLanguage('en')");
  assert.equal(app.els.reviewSecondsInput.value, "");
  assert.equal(app.run("normalizeReviewSeconds()"), false);
});

test("invalid custom delay remains visible when language changes", () => {
  const app = harness();
  app.els.customDelayTrigger.fire("click");
  app.els.customDelayInput.value = "31";
  assert.equal(app.run("normalizeCustomDelay()"), false);
  app.run("applyLanguage('en')");
  assert.equal(app.els.customDelayInput.value, "31");
  assert.equal(app.els.customDelayWrap.hidden, false);
  assert.equal(app.els.customDelayTrigger.getAttribute("aria-pressed"), "true");
  assert.equal(app.els.customDelayInput.getAttribute("aria-invalid"), "true");
});

test("valid custom delay matching a preset stays editable", () => {
  const app = harness();
  app.els.customDelayTrigger.fire("click");
  app.els.customDelayInput.value = "5";
  assert.equal(app.run("normalizeCustomDelay()"), true);
  app.run("applyLanguage('en')");
  assert.equal(app.els.customDelayWrap.hidden, false);
  assert.equal(app.els.customDelayInput.value, "5");
  assert.equal(app.storage.get("practice-mirror-delay"), "5");
});

test("Review presets select, persist, and recover from an invalid custom draft", () => {
  const app = harness();
  assert.deepEqual(app.presets.map(button => button.dataset.reviewSeconds), ["10", "30", "60", "180"]);
  for (const button of app.presets) {
    app.els.reviewSecondsInput.value = "181";
    app.run("normalizeReviewSeconds()");
    button.fire("click");
    assert.equal(app.els.reviewSecondsInput.value, button.dataset.reviewSeconds);
    assert.equal(app.els.reviewSecondsInput.getAttribute("aria-invalid"), "false");
    assert.equal(app.els.reviewSecondsError.textContent, "");
    assert.equal(app.storage.get("practice-mirror-review-seconds"), button.dataset.reviewSeconds);
    assert.deepEqual(app.presets.map(item => item.getAttribute("aria-pressed")), app.presets.map(item => String(item === button)));
  }
});

test("Review custom boundaries accept integers only and keep the last valid value", () => {
  const app = harness();
  for (const value of ["10", "180", "75"]) {
    app.els.reviewSecondsInput.value = value;
    assert.equal(app.run("normalizeReviewSeconds()"), true);
  }
  for (const value of ["", "9", "181", "12.5", "1000000000000000000000"]) {
    app.els.reviewSecondsInput.value = value;
    assert.equal(app.run("normalizeReviewSeconds()"), false);
    assert.equal(app.storage.get("practice-mirror-review-seconds"), "75");
  }
  assert.equal(harness(Object.fromEntries(app.storage)).els.reviewSecondsInput.value, "75");
});

test("language and Help controls expose localized title and destination labels", () => {
  const app = harness();
  assert.equal(app.els.languageButton.textContent, "EN");
  assert.equal(app.els.languageButton.getAttribute("aria-label"), "英語に切り替え");
  assert.equal(app.els.languageButton.getAttribute("title"), "英語に切り替え");
  assert.equal(app.els.helpButton.getAttribute("title"), "使い方と注意事項");
  app.run("applyLanguage('en')");
  assert.equal(app.els.languageButton.textContent, "JA");
  assert.equal(app.els.languageButton.getAttribute("aria-label"), "Switch to Japanese");
  assert.equal(app.els.languageButton.getAttribute("title"), "Switch to Japanese");
  assert.equal(app.els.helpButton.getAttribute("title"), "How to use and notes");
});

test("Review presets do not mutate active-session settings", () => {
  const app = harness();
  app.run("state.phase='practice'");
  app.presets.find(button => button.dataset.reviewSeconds === "60").fire("click");
  assert.equal(app.run("state.reviewSeconds"), 10);
  assert.equal(app.storage.has("practice-mirror-review-seconds"), false);
});

test("empty custom delay survives language changes and reload keeps the last valid delay", () => {
  const app = harness();
  app.run("setDelaySeconds(7,{custom:true})");
  app.els.customDelayInput.value = "";
  app.els.customDelayInput.fire("input");
  app.run("applyLanguage('en')");
  assert.equal(app.els.customDelayInput.value, "");
  assert.equal(app.els.customDelayWrap.hidden, false);
  assert.equal(app.run("normalizeCustomDelay()"), false);
  assert.equal(app.storage.get("practice-mirror-delay"), "7");
  const reloaded = harness(Object.fromEntries(app.storage));
  assert.equal(reloaded.els.customDelayInput.value, "7");
  assert.equal(reloaded.els.customDelayWrap.hidden, false);
});

test("complete app script parses and retains the local, camera-only boundary", () => {
  const built = source.replace("__APP_CONFIG_JSON__", "{}").replace("__BUILD_MANIFEST_JSON__", "{}").replace("__EMBEDDED_ASSET_BUNDLE_JSON__", "{}");
  for (const match of built.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  assert.match(source, /connect-src 'none'/);
  assert.match(source, /audio:false/);
  assert.doesNotMatch(source, /<script[^>]+src=["']https?:/);
});
