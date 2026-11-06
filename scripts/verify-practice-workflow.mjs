// Synthetic camera integration: real Canvas, VideoEncoder/Decoder and MediaRecorder.
// This does not certify physical-camera, iOS/Safari or Android behavior.
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const html=(await readFile('dist/index.html','utf8')).replace('    const savedDelay=', '    window.testMirror={state,els,startReview,stopPractice,seekReview,setReviewRange,playReview,pauseReview,reviewExportWindow,suspendSessionForBackground,resumeSessionFromBackground};\n    const savedDelay=');
const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(html);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
await mkdir('tmp-review-ui',{recursive:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,locale:'ja-JP',acceptDownloads:true});
  await context.addInitScript(()=>{
    const constraints=[];window.cameraRequests=constraints;
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{value:async options=>{
      constraints.push(options);
      const canvas=document.createElement('canvas');canvas.width=360;canvas.height=640;
      const ctx=canvas.getContext('2d');let frame=0;
      const paint=()=>{ctx.fillStyle='#e4e7e1';ctx.fillRect(0,0,360,640);ctx.fillStyle='#16624f';ctx.fillRect(0,580,360,4);ctx.strokeStyle='#43534c';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.arc(180,180,24,0,Math.PI*2);ctx.moveTo(180,205);ctx.lineTo(180,370);ctx.moveTo(180,250);ctx.lineTo(85,300+Math.sin(frame/15)*50);ctx.moveTo(180,250);ctx.lineTo(275,300-Math.sin(frame/15)*50);ctx.moveTo(180,370);ctx.lineTo(125,560);ctx.moveTo(180,370);ctx.lineTo(235,560);ctx.stroke();ctx.fillStyle='#24382e';ctx.font='18px sans-serif';ctx.fillText(`TEST ${frame++}`,20,40);};
      paint();const timer=setInterval(paint,66);const stream=canvas.captureStream(15);const track=stream.getVideoTracks()[0];const stop=track.stop.bind(track);track.stop=()=>{clearInterval(timer);stop();};return stream;
    }});
    Object.defineProperty(navigator.mediaDevices,'enumerateDevices',{value:async()=>[{kind:'videoinput',deviceId:'front'},{kind:'videoinput',deviceId:'back'}]});
  });
  const page=await context.newPage();const errors=[];const external=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(`http://127.0.0.1:${server.address().port}`))external.push(r.url());});
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  assert.equal(await page.locator('#delayCanvas').evaluate(canvas=>canvas.getContext('2d').getContextAttributes().desynchronized),false,'video presentation must use synchronized compositing to avoid scanout tearing');
  await page.locator('[data-delay="3"]').click();await page.locator('#startButton').click();
  await page.waitForFunction(()=>window.testMirror.state.phase==='preview',null,{timeout:5000});
  assert.equal(await page.evaluate(()=>window.testMirror.state.encoder),null,'positioning must not start delayed encoding');
  assert.equal(await page.evaluate(()=>window.cameraRequests[0].video.facingMode.ideal),'user');
  await page.locator('#beginPracticeButton').click();
  await page.waitForFunction(()=>window.testMirror.state.phase==='practice');
  await page.waitForFunction(()=>!document.querySelector('#reviewButton').disabled,null,{timeout:20000});
  await page.waitForFunction(()=>window.testMirror.state.latestRenderedTimestamp>=5e6);
  // Idle touch users must be able to enter Review without first revealing settings.
  await page.evaluate(()=>document.activeElement?.blur());
  await page.waitForFunction(()=>document.querySelector('#mirrorPanel').classList.contains('controls-hidden'),null,{timeout:7000});
  const persistent=await page.locator('#reviewButton').evaluate(button=>{
    const panel=button.closest('#stageControls'),style=getComputedStyle(panel);
    return {opacity:Number(style.opacity),pointerEvents:style.pointerEvents,inert:Boolean(button.closest('[inert]')),hidden:Boolean(button.closest('[aria-hidden="true"]')),tabIndex:button.tabIndex};
  });
  assert.equal(persistent.opacity,1,'Review stays visible after the auxiliary auto-hide timeout');
  assert.notEqual(persistent.pointerEvents,'none','Review remains tappable');
  assert.equal(persistent.inert,false);assert.equal(persistent.hidden,false);assert.ok(persistent.tabIndex>=0);
  assert.equal(await page.locator('#practiceTools').evaluate(node=>node.inert),true,'hidden auxiliary controls leave the focus order');
  await page.locator('#stageShell').tap();
  await page.waitForFunction(()=>!document.querySelector('#mirrorPanel').classList.contains('controls-hidden'));
  assert.equal(await page.locator('#practiceTools').evaluate(node=>node.inert),false,'video tap reveals auxiliary controls');
  await page.waitForFunction(()=>document.querySelector('#mirrorPanel').classList.contains('controls-hidden'),null,{timeout:7000});
  await page.evaluate(()=>document.addEventListener('click',event=>{if(event.target.closest('#reviewButton'))window.reviewClickAnchor=window.testMirror.state.latestRenderedTimestamp;},{capture:true,once:true}));
  await page.locator('#reviewButton').tap();
  const anchor=await page.evaluate(()=>window.reviewClickAnchor);
  await page.waitForFunction(()=>window.testMirror.state.phase==='review');
  const snapshot=await page.evaluate(()=>{const r=window.testMirror.state.review;return {end:r.endUs,pos:r.positionUs,duration:r.durationUs,playing:r.playing};});
  assert.equal(snapshot.end,anchor);assert.equal(snapshot.pos,snapshot.duration);assert.equal(snapshot.playing,false);
  assert.equal(await page.evaluate(()=>window.testMirror.setReviewRange(1e6,3e6)),true);
  await page.locator('#loopButton').click();
  assert.equal(await page.locator('#loopButton').getAttribute('aria-pressed'),'true');
  assert.match(await page.locator('#loopButton').innerText(),/ON/);
  await page.locator('#languageButton').click();
  assert.match(await page.locator('#loopButton').innerText(),/Loop.*ON/s);
  await page.locator('#loopButton').click();
  assert.equal(await page.locator('#loopButton').getAttribute('aria-pressed'),'false');
  assert.match(await page.locator('#loopButton').innerText(),/OFF/);
  await page.locator('#languageButton').click();
  await page.locator('#loopButton').click();await page.locator('#playPauseButton').click();
  await page.waitForTimeout(4500);
  const loop=await page.evaluate(()=>{const r=window.testMirror.state.review;return {pos:r.positionUs,playing:r.playing};});
  assert.ok(loop.playing&&loop.pos>=1e6&&loop.pos<=3e6,JSON.stringify(loop));
  await page.locator('#playPauseButton').click();
  await page.locator('#reviewExportDetails summary').click();await page.locator('#outputFilename').fill('my-range');
  const downloaded=page.waitForEvent('download');await page.locator('#saveClipButton').click();const file=await downloaded;
  assert.equal(file.suggestedFilename(),'my-range.webm');const downloadPath=await file.path();
  const b64=(await readFile(downloadPath)).toString('base64');
  const media=await page.evaluate(async data=>{const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));const video=document.createElement('video');video.muted=true;const url=URL.createObjectURL(new Blob([bytes],{type:'video/webm'}));video.src=url;await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=reject;});const duration=video.duration;await new Promise(resolve=>{video.onseeked=resolve;video.currentTime=1;});const time=video.currentTime;video.remove();URL.revokeObjectURL(url);return{duration,time};},b64);
  assert.ok(Math.abs(media.duration-2)<0.2,JSON.stringify(media));assert.ok(Math.abs(media.time-1)<0.2);
  await page.locator('#reviewExportDetails summary').click();
  for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[667,375],[844,390],[1360,900]]){
    await page.setViewportSize({width,height});
    // setViewportSize may resolve before the browser dispatches resize and fitStage runs.
    await page.waitForFunction(()=>{
      const stage=document.querySelector('#stageShell').getBoundingClientRect();
      const landscape=innerWidth>innerHeight&&innerHeight<=620;
      const limit=Math.max(120,innerHeight-66-(landscape?24:300));
      return stage.height<=limit+1&&stage.width<=innerWidth;
    });
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{scrollTo(0,0);document.querySelector(".session-side").scrollTop=0;resolve();}))));
    for(const lang of ['ja','en']){
      if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('#languageButton').click();
      const g=await page.evaluate(()=>{const a=document.querySelector('#stageShell').getBoundingClientRect(),b=document.querySelector('#reviewSeek').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,aspect:a.width/a.height,seekBottom:b.bottom};});
      assert.equal(g.overflow,false,`${width}/${lang}`);assert.ok(Math.abs(g.aspect-360/640)<0.02,JSON.stringify(g));assert.ok(g.seekBottom<=height+1,`${width}/${lang}: seek must remain on screen ${JSON.stringify(g)}`);
      if(width<=760 || (width>height && height<=620)){
        const controls=await page.evaluate(()=>{
          const box=id=>document.getElementById(id).getBoundingClientRect().toJSON();
          return {back:box('frameBackButton'),play:box('playPauseButton'),forward:box('frameForwardButton'),seek:box('reviewSeek')};
        });
        assert.ok(controls.back.x<controls.play.x&&controls.play.x<controls.forward.x,'frame controls flank play');
        assert.ok(Math.abs(controls.back.y+controls.back.height/2-controls.play.y-controls.play.height/2)<2,'transport aligns vertically');
        assert.ok(controls.seek.bottom<=controls.play.y,'seek stays immediately before playback controls');
        await page.locator('#frameBackButton').focus();
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('#playPauseButton').evaluate(node=>node===document.activeElement),true,'keyboard reaches play after back');
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('#frameForwardButton').evaluate(node=>node===document.activeElement),true,'keyboard reaches forward after play');
      }
      await page.locator('#rangeDetails').evaluate(node=>node.open=true);
      const range=await page.locator('.range-fields').evaluate(node=>({width:node.clientWidth,scroll:node.scrollWidth}));
      assert.ok(range.scroll<=range.width,`${width}/${lang}: range controls overflow`);
      await page.locator('.session-side').evaluate(node=>node.scrollTop=0);
      await page.screenshot({path:`tmp-review-ui/review-${width}-${lang}.png`,fullPage:true});
      await page.locator("#rangeDetails").screenshot({path:`tmp-review-ui/range-${width}-${lang}.png`});
      await page.locator('#rangeDetails').evaluate(node=>node.open=false);
    }
  }
  await page.locator('#returnButton').click();await page.waitForFunction(()=>window.testMirror.state.phase==='warming');
  assert.equal(await page.locator('#cameraVideo').isVisible(),true,'live position view during warmup');
  await page.evaluate(()=>window.testMirror.stopPractice());
  assert.equal(await page.locator('#startButton').isVisible(),true);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('PASS preview → practice → displayed-frame review → loop → 2s seekable export → resume/stop; 14 responsive states; no runtime requests/errors');
  await context.close();
}finally{await browser.close();await new Promise(r=>server.close(r));}
