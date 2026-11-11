// Adversarial, synthetic-camera integration: real WebCodecs/MediaRecorder.
// Not a substitute for physical Android/iOS or a 180-second wall-clock soak.
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const raw = await readFile('dist/index.html','utf8');
const hook = '    const savedDelay=';
assert.ok(raw.includes(hook),'test hook is missing');
const html = raw.replace(hook, '    window.deepTest={state,els,startPractice,beginPractice,stopPractice,switchCamera,startReview,returnToPractice,seekReview,stepReview,suspendSessionForBackground,resumeSessionFromBackground,saveReviewClip};\n'+hook);
const server = http.createServer((req,res)=>{
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
  res.end(html);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const baseUrl='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
await mkdir('test-results',{recursive:true});
const results=[];
async function fixture(){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,acceptDownloads:true});
  await context.addInitScript(()=>{
    const harness={requests:[],streams:[],locks:[],deferNext:false,pending:null,hidden:false};
    window.__harness=harness;
    const makeStream=()=>{
      const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;
      const ctx=canvas.getContext('2d');let n=0;
      const paint=()=>{
        ctx.fillStyle=(n%2)?'#16624f':'#dde3db';
        ctx.fillRect(0,0,320,180);
        ctx.fillStyle='#152d23';ctx.fillRect(20+(n%100),50,40,40);n+=1;
      };
      paint();
      const timer=setInterval(paint,50);
      const stream=canvas.captureStream(20);
      const track=stream.getVideoTracks()[0];
      const originalStop=track.stop.bind(track);
      track.stop=()=>{clearInterval(timer);originalStop();};
      const streamId='cam-'+(harness.streams.length%2+1);
      track.getSettings=()=>({deviceId:streamId,width:320,height:180,frameRate:20});
      harness.streams.push({stream,track,streamId});
      return stream;
    };
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async options=>{
      harness.requests.push(options);
      if(harness.deferNext){
        harness.deferNext=false;
        return new Promise(resolve=>{
          harness.pending={resolve:()=>{
            const stream=makeStream();
            harness.pending=null;
            resolve(stream);
          }};
        });
      }
      return makeStream();
    }});
    Object.defineProperty(navigator.mediaDevices,'enumerateDevices',{configurable:true,value:async()=>[
      {kind:'videoinput',deviceId:'cam-1',label:'Synthetic A'},
      {kind:'videoinput',deviceId:'cam-2',label:'Synthetic B'}
    ]});
    Object.defineProperty(navigator,'wakeLock',{configurable:true,value:{
      request:async()=>{
        const lock={released:false,addEventListener(){},async release(){this.released=true;}};
        harness.locks.push(lock);
        return lock;
      }
    }});
    Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>harness.hidden?'hidden':'visible'});
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>harness.hidden});
    harness.setHidden=value=>{
      harness.hidden=Boolean(value);
      document.dispatchEvent(new Event('visibilitychange'));
    };
    harness.getTracks=()=>harness.streams.map(item=>item.track.readyState);
  });
  const page=await context.newPage();
  const pageErrors=[],external=[];
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('request',req=>{
    if(/^https?:/i.test(req.url())&&!req.url().startsWith(baseUrl)) external.push(req.url());
  });
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  return {page,context,pageErrors,external};
}
async function expectIdle(f){
  const state=await f.page.evaluate(()=>({
    phase:deepTest.state.phase,
    stream:Boolean(deepTest.state.stream),
    encoder:deepTest.state.encoder,
    decoder:deepTest.state.decoder,
    reviewPackets:deepTest.state.review.packets.length,
    historyPackets:deepTest.state.historyPackets.length,
    tracks:__harness.getTracks(),
    exporting:deepTest.state.exporting
  }));
  assert.equal(state.phase,'idle',JSON.stringify(state));
  assert.equal(state.stream,false);
  assert.equal(state.encoder,null);
  assert.equal(state.decoder,null);
  assert.equal(state.reviewPackets,0);
  assert.equal(state.historyPackets,0);
  assert.equal(state.exporting,false);
  assert.ok(state.tracks.every(v=>v==='ended'),JSON.stringify(state));
}
async function initialPreview(f){
  await f.page.locator('#startButton').click();
  await f.page.waitForFunction(()=>deepTest.state.phase==='preview');
}
async function practice(f,delay=3){
  if(delay!==10){
    await f.page.locator('[data-delay="'+delay+'"]').click();
  }
  await initialPreview(f);
  await f.page.locator('#beginPracticeButton').click();
  await f.page.waitForFunction(()=>['warming','practice'].includes(deepTest.state.phase));
}
async function checked(name,fn){
  const started=Date.now();
  await fn();
  results.push({name,result:'pass',ms:Date.now()-started});
  console.log('PASS '+name+' ('+(Date.now()-started)+' ms)');
}
let f=null;
try {
  await checked('stopping while initial permission request is unresolved releases the late stream',async()=>{
    f=await fixture();
    await f.page.evaluate(()=>{__harness.deferNext=true;});
    await f.page.locator('#startButton').click();
    await f.page.waitForFunction(()=>Boolean(__harness.pending));
    await f.page.evaluate(()=>deepTest.stopPractice());
    await f.page.evaluate(()=>__harness.pending.resolve());
    await f.page.waitForFunction(()=>__harness.streams.length===1&&__harness.getTracks()[0]==='ended');
    await expectIdle(f);
    assert.deepEqual(f.pageErrors,[]);
    assert.deepEqual(f.external,[]);
    await f.context.close();f=null;
  });

  await checked('stopping while camera switch is unresolved does not revive the old session',async()=>{
    f=await fixture();
    await initialPreview(f);
    await f.page.evaluate(()=>{__harness.deferNext=true;void deepTest.switchCamera();});
    await f.page.waitForFunction(()=>Boolean(__harness.pending));
    await f.page.evaluate(()=>deepTest.stopPractice());
    await f.page.evaluate(()=>__harness.pending.resolve());
    await f.page.waitForFunction(()=>__harness.streams.length>=2&&__harness.getTracks().every(x=>x==='ended'));
    await expectIdle(f);
    assert.deepEqual(f.pageErrors,[]);
    assert.deepEqual(f.external,[]);
    await f.context.close();f=null;
  });

  await checked('rapid background/foreground transitions rebuild the pipeline without retaining locks',async()=>{
    f=await fixture();
    await practice(f,3);
    for(let cycle=0;cycle<5;cycle+=1){
      await f.page.evaluate(()=>__harness.setHidden(true));
      await f.page.waitForFunction(()=>deepTest.state.phase==='suspended');
      const hidden=await f.page.evaluate(()=>({
        pipelineClosed:deepTest.state.encoder===null&&deepTest.state.decoder===null,
        hidden:deepTest.state.reliability.suspended,
        history:deepTest.state.historyPackets.length
      }));
      assert.ok(hidden.pipelineClosed&&hidden.hidden&&hidden.history===0,JSON.stringify(hidden));
      await f.page.evaluate(()=>__harness.setHidden(false));
      await f.page.waitForFunction(()=>['warming','practice'].includes(deepTest.state.phase));
    }
    await f.page.waitForFunction(()=>deepTest.state.phase==='practice',{timeout:20000});
    await f.page.waitForFunction(()=>deepTest.state.reviewReady,{timeout:12000});
    await f.page.evaluate(()=>deepTest.stopPractice());
    await expectIdle(f);
    const locks=await f.page.evaluate(()=>__harness.locks.map(x=>x.released));
    assert.ok(locks.every(Boolean),'all acquired wake locks must be released: '+JSON.stringify(locks));
    assert.deepEqual(f.pageErrors,[]);
    assert.deepEqual(f.external,[]);
    await f.context.close();f=null;
  });

  await checked('Review preserves its packets and position after simulated visibility changes',async()=>{
    f=await fixture();
    await practice(f,3);
    await f.page.waitForFunction(()=>deepTest.state.reviewReady,{timeout:20000});
    await f.page.evaluate(()=>deepTest.startReview());
    await f.page.waitForFunction(()=>deepTest.state.phase==='review');
    const initial=await f.page.evaluate(()=>({length:deepTest.state.review.packets.length,pos:deepTest.state.review.positionUs}));
    assert.ok(initial.length>0);
    for(let i=0;i<4;i+=1){
      await f.page.evaluate(()=>__harness.setHidden(true));
      await f.page.waitForFunction(()=>deepTest.state.phase==='suspended');
      assert.equal(await f.page.evaluate(()=>deepTest.state.review.packets.length),initial.length);
      await f.page.evaluate(()=>__harness.setHidden(false));
      await f.page.waitForFunction(()=>deepTest.state.phase==='review'&&!deepTest.state.reliability.suspended);
      await f.page.waitForFunction(()=>deepTest.state.review.outputMode==='play',{timeout:6000});
      assert.equal(await f.page.evaluate(()=>deepTest.state.review.degraded),false);
    }
    const final=await f.page.evaluate(()=>({length:deepTest.state.review.packets.length,pos:deepTest.state.review.positionUs}));
    assert.equal(final.length,initial.length);
    assert.ok(Math.abs(final.pos-initial.pos)<120000,JSON.stringify({initial,final}));
    await f.page.evaluate(()=>deepTest.stopPractice());
    await expectIdle(f);
    assert.deepEqual(f.pageErrors,[]);
    await f.context.close();f=null;
  });

  await checked('180-second equivalent synthetic history exports a short tail using real WebCodecs and MediaRecorder',async()=>{
    f=await fixture();
    await practice(f,3);
    await f.page.waitForFunction(()=>deepTest.state.reviewReady,{timeout:20000});
    // Wait for at least 1.5s of displayed history before freezing.
    await f.page.waitForFunction(()=>{
      const r=deepTest.state;
      return Number.isFinite(r.latestRenderedTimestamp)&&Number.isFinite(r.firstEncodedTimestamp)&&r.latestRenderedTimestamp-r.firstEncodedTimestamp>1_600_000;
    },null,{timeout:16000});
    await f.page.evaluate(()=>deepTest.startReview());
    await f.page.waitForFunction(()=>deepTest.state.phase==='review');
    const details=await f.page.evaluate(()=>{
      const r=deepTest.state.review;
      const original=r.packets;
      const shift=177_000_000;
      const first=original[0].timestamp, end=original[original.length-1].timestamp;
      const filler=Array.from({length:5400},(_,i)=>({
        timestamp:first+Math.round((shift-100_000)*i/5400),type:'delta',duration:33333,data:new Uint8Array([1])
      }));
      r.packets=[...filler,...original.map(packet=>({...packet,timestamp:packet.timestamp+shift}))];
      r.endUs+=shift;
      r.durationUs+=shift;
      r.rangeStartUs=r.durationUs-1_000_000;
      r.rangeEndUs=r.durationUs;
      r.positionUs=r.durationUs;
      window.__decodeCalls=0;
      const NativeDecoder=window.VideoDecoder;
      window.VideoDecoder=new Proxy(NativeDecoder,{construct(target,args){
        const decoder=Reflect.construct(target,args);
        const nativeDecode=decoder.decode.bind(decoder);
        decoder.decode=chunk=>{window.__decodeCalls+=1;return nativeDecode(chunk);};
        return decoder;
      }});
      return {count:r.packets.length,duration:r.durationUs/1e6,tailStart:first+shift,tailEnd:end+shift};
    });
    assert.ok(details.count>5400&&details.duration>178&&details.duration<185,JSON.stringify(details));
    const downloaded=f.page.waitForEvent('download',{timeout:30000});
    await f.page.locator('#saveClipButton').click();
    const file=await downloaded;
    const bytes=await readFile(await file.path());
    assert.ok(bytes.byteLength>1000,'empty WebM export');
    const media=await f.page.evaluate(async base64=>{
      const array=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
      const url=URL.createObjectURL(new Blob([array],{type:'video/webm'}));
      const video=document.createElement('video');video.preload='metadata';video.muted=true;video.src=url;
      try{
        await new Promise((resolve,reject)=>{
          const t=setTimeout(()=>reject(new Error('metadata timeout')),8000);
          video.onloadedmetadata=()=>{clearTimeout(t);resolve();};
          video.onerror=()=>{clearTimeout(t);reject(Error('bad WebM'));};
        });
        const duration=video.duration,seek=Math.min(0.5,duration/2);
        await new Promise((resolve,reject)=>{
          const t=setTimeout(()=>reject(new Error('seek timeout')),8000);
          video.onseeked=()=>{clearTimeout(t);resolve();};
          video.currentTime=seek;
        });
        return {duration,seeked:video.currentTime};
      }finally{video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
    },bytes.toString('base64'));
    assert.ok(media.duration>0.65&&media.duration<1.4,JSON.stringify(media));
    assert.ok(Math.abs(media.seeked-0.5)<0.2,JSON.stringify(media));
    const decoded=await f.page.evaluate(()=>window.__decodeCalls);
    assert.ok(decoded<450,'export decoded too many frames from prefix: '+decoded);
    await f.page.waitForFunction(()=>deepTest.state.exporting===false);
    await f.page.evaluate(()=>deepTest.stopPractice());
    await expectIdle(f);
    assert.deepEqual(f.external,[]);
    assert.deepEqual(f.pageErrors,[]);
    results.push({name:'virtual-tail-metrics',durationSeconds:details.duration,packets:details.count,decodeCalls:decoded,webmSeconds:media.duration});
    await f.context.close();f=null;
  });
} catch(error) {
  if(f){
    try{await f.page.screenshot({path:'test-results/deep-reliability-failure.png'});}catch{}
    console.error('Page exceptions: '+JSON.stringify(f.pageErrors));
    console.error('External requests: '+JSON.stringify(f.external));
    try{console.error('State: '+JSON.stringify(await f.page.evaluate(()=>({phase:deepTest.state.phase,suspended:deepTest.state.reliability.suspended,exporting:deepTest.state.exporting,streams:__harness.getTracks()}))));}catch{}
  }
  results.push({name:'failure',error:String(error?.stack||error)});
  throw error;
} finally{
  await writeFile('test-results/deep-reliability.json',JSON.stringify(results,null,2));
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
