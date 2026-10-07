import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const htmlPath=path.resolve("dist/index.html");
const html=await readFile(htmlPath);
const server=http.createServer((req,res)=>{
  res.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"});
  res.end(html);
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port;
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1000,height:700}});
  await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:"networkidle"});
  const result=await page.evaluate(async()=>{
    const candidates=["video/webm;codecs=vp8","video/webm;codecs=vp9","video/webm"];
    const mime=candidates.find(type=>MediaRecorder.isTypeSupported(type));
    if(!mime) throw new Error("No WebM MediaRecorder type in test browser");
    const assetUrl=await StandaloneAssets.blobUrlAsync("fix-webm-duration","main");
    await new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src=assetUrl;
      script.onload=()=>{script.remove();resolve();};
      script.onerror=()=>reject(new Error("Embedded duration helper failed to load"));
      document.head.append(script);
    });
    URL.revokeObjectURL(assetUrl);
    if(typeof window.ysFixWebmDuration!=="function") throw new Error("Duration helper global missing");

    const canvas=document.createElement("canvas");
    canvas.width=320; canvas.height=180;
    const ctx=canvas.getContext("2d");
    const stream=canvas.captureStream(15);
    const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:600000});
    const chunks=[];
    recorder.ondataavailable=e=>{if(e.data?.size) chunks.push(e.data);};
    const stopped=new Promise((resolve,reject)=>{
      recorder.onstop=resolve;
      recorder.onerror=e=>reject(e.error||new Error("MediaRecorder error"));
    });
    const start=performance.now();
    recorder.start();
    for(let i=0;i<30;i+=1){
      ctx.fillStyle=i%2?"#16624f":"#20211f";
      ctx.fillRect(0,0,320,180);
      ctx.fillStyle="#fff"; ctx.font="24px sans-serif"; ctx.fillText(String(i),24,40);
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    recorder.stop();
    await stopped;
    stream.getTracks().forEach(track=>track.stop());
    const durationMs=performance.now()-start;
    const raw=new Blob(chunks,{type:mime});
    const fixed=await window.ysFixWebmDuration(raw,durationMs,{logger:false});
    const url=URL.createObjectURL(fixed);
    const video=document.createElement("video");
    video.preload="metadata"; video.muted=true; video.src=url; document.body.append(video);
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error("metadata timeout")),5000);
      video.onloadedmetadata=()=>{clearTimeout(timer);resolve();};
      video.onerror=()=>{clearTimeout(timer);reject(new Error("fixed WebM metadata load failed"));};
    });
    const duration=video.duration;
    if(!Number.isFinite(duration)||duration<=0.5) throw new Error(`Invalid fixed duration: ${duration}`);
    const target=Math.min(duration*0.55,Math.max(0.25,duration-0.2));
    const seeked=await new Promise(resolve=>{
      const timer=setTimeout(()=>resolve(false),5000);
      video.onseeked=()=>{clearTimeout(timer);resolve(Math.abs(video.currentTime-target)<0.35);};
      video.currentTime=target;
    });
    const currentTime=video.currentTime;
    const ranges=video.seekable.length;
    video.remove(); URL.revokeObjectURL(url);
    return {mime,rawBytes:raw.size,fixedBytes:fixed.size,duration,target,currentTime,seeked,seekableRanges:ranges};
  });
  console.log(JSON.stringify(result));
  if(!result.seeked) throw new Error(`Fixed WebM did not seek: ${JSON.stringify(result)}`);
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
