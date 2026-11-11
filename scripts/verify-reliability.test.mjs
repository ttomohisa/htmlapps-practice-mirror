import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("../src/index.template.html",import.meta.url),"utf8");
function extract(from,to){
  const start=source.indexOf(from);
  const end=source.indexOf(to,start+from.length);
  assert.ok(start>=0&&end>start,`Could not extract ${from}`);
  return source.slice(start,end);
}
function execute(code,context){
  const sandbox=vm.createContext(context);
  vm.runInContext(code,sandbox);
  return sandbox;
}

test("Wake Lock acquisition is deduplicated and released if Stop wins the race",async()=>{
  const state={phase:"preview",wakeEnabled:true,wakeLock:null,reliability:{suspended:false}};
  let resolveRequest,requests=0,releases=0;
  const context=execute(extract("    function wakeLockNeeded(){","    async function releaseWakeLock(){"),{
    state,document:{visibilityState:"visible"},
    navigator:{wakeLock:{request:()=>{ requests+=1; return new Promise(resolve=>{resolveRequest=resolve;}); }}},
    updatePracticeUxButtons(){}
  });
  const first=context.requestWakeLock();
  const second=context.requestWakeLock();
  assert.equal(requests,1,"only one lock request is allowed");
  state.phase="idle";
  resolveRequest({release:async()=>{releases+=1;},addEventListener(){}});
  await Promise.all([first,second]);
  assert.equal(releases,1,"late lock must be released");
  assert.equal(state.wakeLock,null,"stopped sessions must never retain a lock");
});

test("background phase changes immediately without waiting for Wake Lock release",async()=>{
  const state={
    phase:"practice",reliability:{suspended:false,suspendedFrom:null},
    exportGeneration:0,exporting:false,generation:3,encodedQueue:[1],historyPackets:[2],reviewReady:true
  };
  let releases=0,stopped=0;
  const context=execute(extract("    async function suspendSessionForBackground(){","    async function resumeSessionFromBackground(){"),{
    state,stopReliabilityWatchdog(){stopped+=1;},clearControlsAutoHide(){},
    setControlsHidden(){},cancelLiveLoops(){},disposeLiveCodecs(){},
    clearReviewState(){},pauseReview(){},disposeReviewDecoder(){},
    setOverlay(){},updatePhaseUI(){},updateReviewUI(){},updateExportUI(){},
    updateReliabilityDiagnostics(){},announce(){},t:key=>key,
    releaseWakeLock(){releases+=1;return new Promise(()=>{});}
  });
  await context.suspendSessionForBackground();
  assert.equal(state.phase,"suspended");
  assert.equal(state.reliability.suspended,true);
  assert.equal(state.generation,4);
  assert.deepEqual(Array.from(state.historyPackets),[]);
  assert.equal(stopped,1);
  assert.equal(releases,1);
});

test("late Review resume failure cannot overwrite a second suspension",async()=>{
  const reliability={suspended:true,suspendedFrom:"review"};
  const state={phase:"suspended",generation:2,reliability,review:{packets:[{type:"key"}],positionUs:1000,lastDecoderError:null}};
  let degraded=0;
  const ctx=execute(extract("    async function resumeSessionFromBackground(){","    async function stopPractice("),{
    state,document:{visibilityState:"visible"},els:{stageOverlay:{hidden:false}},
    updatePhaseUI(){},requestWakeLock(){},
    seekReview:async()=>{reliability.suspended=true;state.phase="suspended";throw Error("obsolete decoder");},
    degradeReview(){degraded+=1;},AppToast:{show(){}},t:key=>key,
    updateReliabilityDiagnostics(){},handleRuntimeFailure(){throw Error("stale runtime error");}
  });
  await ctx.resumeSessionFromBackground();
  assert.equal(state.phase,"suspended");
  assert.equal(reliability.suspended,true);
  assert.equal(degraded,0);
});

test("long-history export finds the preceding key frame",()=>{
  const ctx=execute(extract("    function keyPacketIndexAt(","    async function drawExportStartFrame("),{});
  const packets=Array.from({length:5401},(_,i)=>({timestamp:i*33333,type:i%60===0?"key":"delta"}));
  assert.equal(ctx.keyPacketIndexAt(packets,179*1e6),5340);
  assert.equal(ctx.keyPacketIndexAt(packets,0),0);
  assert.equal(ctx.keyPacketIndexAt([{timestamp:5,type:"delta"}],5),-1);
});

test("frame stepping follows actual packets rather than an assumed frame interval",()=>{
  const state={review:{
    visibleStartUs:15_000_000,endUs:25_000_000,durationUs:10_000_000,
    positionUs:200_000,packets:[
      {timestamp:15_000_000},{timestamp:15_100_000},
      {timestamp:15_280_000},{timestamp:15_500_000},{timestamp:25_000_000}
    ]
  }};
  const ctx=execute(extract("    function adjacentReviewFrameUs(","    async function stepReview("),{state});
  assert.equal(ctx.adjacentReviewFrameUs(-1),100_000);
  assert.equal(ctx.adjacentReviewFrameUs(1),280_000);
  state.review.positionUs=0;
  assert.equal(ctx.adjacentReviewFrameUs(-1),0);
  state.review.positionUs=10_000_000;
  assert.equal(ctx.adjacentReviewFrameUs(1),10_000_000);
});

test("Undo of cleared guides does not remove guides added afterwards",()=>{
  const state={guides:[{id:1,position:50},{id:2,position:25}]};
  let undo;
  const ctx=execute(extract("    function clearGuides(){","    function applyMirror(){"),{
    state,renderGuides(){},announce(){},t:key=>key,
    AppToast:{show(options){undo=options.onAction;}}
  });
  ctx.clearGuides();
  assert.equal(state.guides.length,0);
  state.guides.push({id:3,position:75});
  undo();
  assert.deepEqual(Array.from(state.guides,guide=>guide.id),[1,2,3]);
});

test("Japanese and English share the camera-interrupted Review translation key",()=>{
  assert.equal((source.match(/cameraInterruptedReview:/g)||[]).length,2);
  assert.equal(source.includes("cameraInterrupted見返し:"),false);
});

test("desktop camera selection uses a specific device ID",()=>{
  const ctx=execute(extract("    function cameraConstraintsForDevice(","    async function switchCamera("),{
    qualityProfile:()=>({width:1280,height:720,fps:30})
  });
  const value=ctx.cameraConstraintsForDevice("external-usb-camera");
  assert.equal(value.audio,false);
  assert.equal(value.video.deviceId.exact,"external-usb-camera");
  assert.equal(Object.hasOwn(value.video,"facingMode"),false);
});

test("desktop camera switching uses deviceId after facingMode exact selection fails",async()=>{
  const fakeStream=id=>({
    getVideoTracks:()=>[{getSettings:()=>({deviceId:id})}],
    getTracks:()=>[{stop(){}}]
  });
  const state={
    phase:"preview",stream:fakeStream("cam-a"),facingMode:"user",generation:1,
    cameraSwitching:false,cameraSwitchToken:0,reliability:{suspended:false},
    exporting:false,historyPackets:[1],reviewReady:true
  };
  const requests=[],saved=[];
  let stops=0;
  const ctx=execute(extract("    function cameraConstraintsForDevice(","    function capabilityReport(){"),{
    state,qualityProfile:()=>({width:1280,height:720,fps:30}),
    cameraConstraints:(mode,{exact}={})=>({audio:false,video:{facingMode:exact?{exact:mode}:{ideal:mode}}}),
    navigator:{mediaDevices:{
      enumerateDevices:async()=>[{kind:"videoinput",deviceId:"cam-a"},{kind:"videoinput",deviceId:"cam-b"}],
      getUserMedia:async options=>{
        requests.push(options);
        if(options.video.facingMode?.exact) throw Error("facing mode unsupported");
        return fakeStream(options.video.deviceId.exact);
      }
    }},
    updatePracticeUxButtons(){},cancelLiveLoops(){},disposeLiveCodecs(){},t:key=>key,
    setOverlay(){},showControls(){},stopStream(){stops+=1;state.stream=null;},
    activateCameraStream:async stream=>{state.stream=stream;return true;},
    writeStorage:(key,value)=>saved.push([key,value])
  });
  await ctx.switchCamera();
  assert.equal(requests.length,2);
  assert.equal(requests[0].video.facingMode.exact,"environment");
  assert.equal(requests[1].video.deviceId.exact,"cam-b");
  assert.equal(state.stream.getVideoTracks()[0].getSettings().deviceId,"cam-b");
  assert.equal(state.cameraSwitching,false);
  assert.equal(stops,1);
  assert.equal(saved[0][1],"environment");
});
