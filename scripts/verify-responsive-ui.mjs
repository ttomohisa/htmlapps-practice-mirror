// Camera-free responsive regression tests. Synthetic Practice/Review DOM states
// exercise CSS only; they do not claim physical-camera or media-flow coverage.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
await mkdir('tmp-review-ui', { recursive: true });
try {
  for (const [name, width, height, mobile] of [['desktop',1360,900,false],['desktop-short',1280,600,false],['phone-small',320,568,true],['phone',390,844,true],['phone-landscape-small',667,375,true],['phone-landscape',844,390,true],['phone-wide-landscape',932,430,true]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage();
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
    await page.goto(pathToFileURL(path.resolve('dist/index.html')).href);
    const titleSizes = [];
    for (const lang of ['ja','en','ja']) {
      if (await page.locator('html').getAttribute('lang') !== lang) await page.locator('#languageButton').click();
      const g = await page.evaluate(() => {
        const title = document.querySelector('.brand-name'), copy = document.querySelector('[data-i18n="heroCopy"]');
        const range = document.createRange(); range.selectNodeContents(title.firstChild);
        return { titleSize:getComputedStyle(title).fontSize, titleHeight:range.getBoundingClientRect().height, titleWidth:range.getBoundingClientRect().width,
          adjust:getComputedStyle(document.documentElement).webkitTextSizeAdjust,
          footer:getComputedStyle(document.querySelector('footer')).display,
          copyHeight:copy.getBoundingClientRect().height, lineHeight:parseFloat(getComputedStyle(copy).lineHeight),
          overflow:document.documentElement.scrollWidth > innerWidth };
      });
      titleSizes.push([g.titleSize,g.titleHeight]);
      check(g.titleHeight >= 10 && g.titleWidth >= 80, `${name}/${lang}: brand glyphs have nonzero readable geometry`);
      check(!g.overflow, `${name}/${lang}: no horizontal overflow`);
      if (mobile) { check(g.footer === 'none', `${name}/${lang}: footer hidden`); check(g.adjust === '100%', `${name}/${lang}: prevent mobile automatic text enlargement`); }
      if (name === 'desktop' && lang === 'en') check(g.copyHeight <= g.lineHeight + 1, 'Desktop English intro fits one line');
      if (lang === 'ja') {
        check(await page.locator('[data-i18n="heroTitle"]').textContent() === '動いた直後にさっきの自分を確認する', 'Exact Japanese tagline');
        check(await page.locator('[data-i18n="brandMeta"]').textContent() === '1〜30秒の遅延表示と振り返り', 'Natural Japanese brand subtitle');
      }
      await page.locator('#helpButton').click();
      const help = await page.evaluate(() => {
        const dialog=document.querySelector('#helpDialog'), body=dialog.querySelector('.dialog-body'), head=dialog.querySelector('.dialog-head');
        return { outerOverflow:dialog.scrollHeight-dialog.clientHeight, bodyScroll:body.scrollHeight>body.clientHeight,
          outerStyle:getComputedStyle(dialog).overflowY, backgroundOverflow:getComputedStyle(document.documentElement).overflowY, bottom:dialog.getBoundingClientRect().bottom,
          headTop:head.getBoundingClientRect().top, bodyTop:body.getBoundingClientRect().top };
      });
      check(help.backgroundOverflow === 'hidden', `${name}/${lang}: background page scrollbar is hidden while help is open`);
      check(help.outerOverflow <= 1 && help.outerStyle === 'hidden', `${name}/${lang}: only inner help scrolls ${JSON.stringify(help)}`);
      check(help.bottom <= height + 1, `${name}/${lang}: dialog stays in viewport`);
      await page.locator('.dialog-body').evaluate(el => { el.scrollTop=el.scrollHeight; });
      const lastVisible = await page.locator(`[data-lang-block="${lang}"] > :last-child`).evaluate(el => {
        const a=el.getBoundingClientRect(), b=el.closest('.dialog-body').getBoundingClientRect(); return a.bottom <= b.bottom + 1;
      });
      check(lastVisible, `${name}/${lang}: final help item reachable`);
      await page.keyboard.press('Escape');
      check(await page.locator('#helpDialog').isVisible() === false, `${name}/${lang}: Escape closes`);
      check(await page.locator('html').evaluate(el=>getComputedStyle(el).overflowY) !== 'hidden', `${name}/${lang}: background scrolling restored`);
      check(await page.locator('#helpButton').evaluate(el => el===document.activeElement), `${name}/${lang}: focus restored`);
      await page.locator('#helpButton').click(); await page.locator('#helpCloseButton').click();
      await page.locator('#helpButton').click(); await page.mouse.click(2,2);
      check(await page.locator('#helpDialog').isVisible() === false, `${name}/${lang}: backdrop closes`);
    }
    check(titleSizes.every(size => JSON.stringify(size)===JSON.stringify(titleSizes[0])), `${name}: title remains same size across languages`);
    for (const lang of ["ja", "en"]) {
    if (await page.locator("html").getAttribute("lang") !== lang) await page.locator("#languageButton").click();
    for (const review of [false,true]) {
      await page.evaluate(review => {
        document.querySelector('#startPanel').hidden=true;
        document.querySelector('#mirrorPanel').classList.add('active');
        document.querySelector('#stageOverlay').hidden=true;
        document.body.classList.toggle('review-active',review);
        document.querySelector('#reviewControls').hidden=!review;
      }, review);
      const geometry=await page.evaluate(review => {
        const stage=document.querySelector('#stageShell').getBoundingClientRect();
        return {stage:stage.toJSON(),controls:[...document.querySelectorAll(review ? '#practiceTools,#reviewControls' : '#practiceTools,#stageControls')].map(el=>el.getBoundingClientRect().toJSON()),overflow:document.documentElement.scrollWidth>innerWidth};
      },review);
      check(!geometry.overflow, `${name}/${review}: no active-state overflow`);
      if(mobile) check(geometry.controls.every(box=>box.y >= geometry.stage.bottom - 1), `${name}/${review}: all controls below video ${JSON.stringify(geometry)}`);
      // Expanded panels must stay in normal flow, including at very narrow widths.
      await page.locator('#practiceTools').evaluate(el=>el.classList.add('tools-open'));
      if (review) await page.locator('#reviewExportDetails').evaluate(el=>el.open=true);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), `${name}/${lang}/${review}: expanded panels do not overflow`);
      if (mobile && !review) {
        await page.locator('#fullscreenButton').evaluate(el=>el.disabled=false);
        await page.locator('#fullscreenButton').click();
        await page.waitForFunction(()=>!!document.fullscreenElement);
        const fs=await page.evaluate(()=>{
          const p=document.querySelector('#mirrorPanel'), s=document.querySelector('#stageShell').getBoundingClientRect();
          return {overflow:p.scrollWidth>p.clientWidth, bottom:s.bottom, controls:document.querySelector('#stageControls').getBoundingClientRect().top};
        });
        check(!fs.overflow && fs.controls>=fs.bottom-1, `${name}/${lang}: fullscreen controls below video without horizontal overflow`);
        await page.evaluate(()=>document.exitFullscreen());
        await page.waitForFunction(()=>!document.fullscreenElement);
      }
      await page.locator('#practiceTools').evaluate(el=>el.classList.remove('tools-open'));
      await page.screenshot({path:`tmp-review-ui/responsive-${name}-${lang}-${review?'review':'practice'}.png`});
    }
    }
    check(errors.length===0, `${name}: no console errors ${errors}`);
    check(requests.length===0, `${name}: no network requests ${requests}`);
    await context.close();
  }
} finally { await browser.close(); }
assert.deepEqual(failures, [], failures.join('\n'));
console.log('Responsive UI passed: desktop, short desktop, 320/390px portrait, 844/932px landscape; JA/EN, dialog, title, footer, synthetic Practice/Review.');
