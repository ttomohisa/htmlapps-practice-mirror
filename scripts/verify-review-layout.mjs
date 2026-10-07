import http from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const html=await readFile(path.resolve("dist/index.html"));
const out=path.resolve("tmp-review-ui");
await mkdir(out,{recursive:true});
const server=http.createServer((req,res)=>{res.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"});res.end(html);});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port;
const browser=await chromium.launch({headless:true});

async function forceReview(page){
  await page.evaluate(()=>{
    document.querySelector("#startPanel").hidden=true;
    const mirror=document.querySelector("#mirrorPanel"); mirror.classList.add("active","review-mode");
    document.body.classList.add("review-active");
    document.querySelector("#stageOverlay").hidden=true;
    document.querySelector("#reviewControls").hidden=false;
    document.querySelector("#reviewExportDetails").open=false;
    document.querySelector("#stageStatus").dataset.state="review";
    document.querySelector("#stageStatusText").textContent="Review";
    document.querySelector("#reviewDurationMeta").textContent="直前 10.0 秒を端末内で固定";
    document.querySelector("#reviewCurrentTime").textContent="0:03.2";
    document.querySelector("#reviewTotalTime").textContent="0:10.0";
    const canvas=document.querySelector("#delayCanvas"); canvas.width=1280; canvas.height=720;
    const ctx=canvas.getContext("2d"); ctx.fillStyle="#d8dedb"; ctx.fillRect(0,0,1280,720); ctx.fillStyle="#16624f"; ctx.fillRect(80,560,1120,12);
  });
}

async function validateReview(viewport,mobile,name){
  const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const page=await context.newPage(); await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:"networkidle"}); await forceReview(page);
  const stage=await page.locator("#stageShell").boundingBox();
  const seek=await page.locator("#reviewSeek").boundingBox();
  if(!stage||!seek) throw new Error(`${name}: review elements missing`);
  if(seek.y+seek.height>viewport.height+1) throw new Error(`${name}: seek bar below viewport: ${JSON.stringify({stage,seek,viewport})}`);
  const center=Math.abs((stage.x+stage.width/2)-viewport.width/2);
  if(center>Math.max(8,viewport.width*0.02)) throw new Error(`${name}: stage not horizontally centered (${center}px)`);
  if(mobile){
    const toolsDisplay=await page.locator("#stageToolRow").evaluate(el=>getComputedStyle(el).display);
    const toggleDisplay=await page.locator("#toolsToggleButton").evaluate(el=>getComputedStyle(el).display);
    if(toolsDisplay!=="none") throw new Error(`${name}: mobile tools panel should start closed`);
    if(toggleDisplay==="none") throw new Error(`${name}: mobile tools toggle missing`);
  }
  await page.screenshot({path:path.join(out,`${name}.png`),fullPage:false});
  await context.close();
}

async function validateFullscreen(){
  const viewport={width:1600,height:900};
  const context=await browser.newContext({viewport,deviceScaleFactor:1});
  const page=await context.newPage(); await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:"networkidle"});
  await page.evaluate(()=>{
    document.querySelector("#startPanel").hidden=true;
    document.querySelector("#mirrorPanel").classList.add("active");
    document.querySelector("#stageOverlay").hidden=true;
    document.querySelector("#fullscreenButton").disabled=false;
    const canvas=document.querySelector("#delayCanvas"); canvas.width=1280; canvas.height=720;
    const ctx=canvas.getContext("2d"); ctx.fillStyle="#d8dedb"; ctx.fillRect(0,0,1280,720);
  });
  if(await page.evaluate(()=>document.fullscreenEnabled)){
    await page.locator("#fullscreenButton").click();
    await page.waitForFunction(()=>Boolean(document.fullscreenElement),null,{timeout:3000});
    const stage=await page.locator("#stageShell").boundingBox();
    const controls=await page.locator("#stageControls").boundingBox();
    if(!stage||!controls) throw new Error("fullscreen layout elements missing");
    const stageCenter=stage.x+stage.width/2; const controlsCenter=controls.x+controls.width/2;
    if(Math.abs(stageCenter-viewport.width/2)>10) throw new Error(`fullscreen stage off center: ${stageCenter}`);
    if(Math.abs(stageCenter-controlsCenter)>10) throw new Error(`fullscreen controls not aligned: ${JSON.stringify({stage,controls})}`);
    await page.screenshot({path:path.join(out,"fullscreen.png"),fullPage:false});
  }else{ console.log("Fullscreen API unavailable in headless browser; skipped fullscreen assertion."); }
  await context.close();
}

try{
  await validateReview({width:1440,height:900},false,"review-desktop");
  await validateReview({width:390,height:844},true,"review-mobile");
  await validateFullscreen();
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
