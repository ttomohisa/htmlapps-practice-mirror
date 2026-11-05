import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/index.template.html',import.meta.url),'utf8');
function fn(name){
  const start=source.indexOf(`    function ${name}(`);
  assert.notEqual(start,-1,`Missing ${name}`);
  const end=source.slice(start+1).search(/\n    (?:async function |function |const |window\.)/);
  return source.slice(start,start+1+end);
}
function app(extra={}){
  const state={phase:'review',delaySeconds:15,reviewSeconds:10,latestEncodedTimestamp:40e6,latestRenderedTimestamp:25e6,historyPruneTimestamp:0,captureTargetFps:30,frameIntervalUs:1e6/30,exporting:false,review:{durationUs:10e6,visibleStartUs:15e6,endUs:25e6,rangeStartUs:0,rangeEndUs:10e6,positionUs:5e6,degraded:false},historyPackets:Array.from({length:1201},(_,i)=>({timestamp:Math.round(i*1e6/30),type:i%60===0?'key':'delta',data:new Uint8Array(1)})),...extra};
  const context=vm.createContext({state,MIN_REVIEW_READY_US:10e6,REVIEW_HISTORY_MARGIN_US:3e6,MAX_HISTORY_BYTES:64*1024*1024,pauseReview(){},updateReviewUI(){},seekReview(){},announce(){},t:k=>k});
  const run=code=>vm.runInContext(code,context);
  run(['reviewTargetDurationUs','reviewHistoryKeepUs','historyReady','pruneHistory','buildReviewSnapshot'].map(fn).join('\n'));
  return {state,run,add:name=>run(fn(name))};
}
test('15s delay / 10s review keeps the displayed 25s frame and the preceding movement',()=>{
  const a=app();a.run('pruneHistory()');const s=a.run('buildReviewSnapshot(25e6)');
  assert.equal(s.endUs,25e6);assert.equal(s.visibleStartUs,15e6);assert.equal(s.durationUs,10e6);
  assert.equal(s.packets[0].type,'key');assert.ok(s.packets.some(p=>p.timestamp===25e6));
});
test('snapshot freezes its requested anchor even if newer frames arrive',()=>{
  const a=app();a.state.latestRenderedTimestamp=26e6;
  assert.equal(a.run('buildReviewSnapshot(25e6)').endUs,25e6);
});
test('short available history starts at a decodable keyframe, never before it',()=>{
  const a=app();a.state.historyPackets=a.state.historyPackets.filter(p=>p.timestamp>=20.5e6);
  const s=a.run('buildReviewSnapshot(25e6)');assert.ok(s);assert.equal(s.visibleStartUs,22e6);assert.equal(s.durationUs,3e6);assert.equal(s.packets[0].type,'key');
});
test('missing displayed frame is not silently replaced by recent capture',()=>{
  const a=app();a.state.historyPackets=a.state.historyPackets.filter(p=>p.timestamp>=30e6);
  assert.equal(a.run('buildReviewSnapshot(25e6)'),null);
});
test('maximum settings retain 210 seconds plus decode margin without unbounded history',()=>{
  const a=app({delaySeconds:30,reviewSeconds:180,latestEncodedTimestamp:240e6,historyPackets:Array.from({length:7201},(_,i)=>({timestamp:Math.round(i*1e6/30),type:i%60===0?'key':'delta',data:new Uint8Array(1)}))});
  a.run('pruneHistory()');assert.equal(a.state.historyPackets[0].type,'key');assert.ok(a.state.historyPackets.length<6500);const s=a.run('buildReviewSnapshot(210e6)');assert.equal(s.visibleStartUs,30e6);
});
test('memory pruning keeps a keyframe and respects the byte ceiling',()=>{
  const a=app({historyPackets:Array.from({length:100},(_,i)=>({timestamp:i*1e6,type:i%2===0?'key':'delta',data:{byteLength:1024*1024}})),latestEncodedTimestamp:99e6,delaySeconds:30,reviewSeconds:180});
  a.run('pruneHistory()');assert.ok(a.state.historyPackets.length<=64);assert.equal(a.state.historyPackets[0].type,'key');
});
test('range rejects empty, reversed, non-finite and out-of-bounds input without losing selection',()=>{
  const a=app();a.add('setReviewRange');a.add('reviewExportWindow');
  assert.equal(a.run('setReviewRange(2e6,6e6)'),true);
  for(const args of ['6e6,2e6','0,0','-1,5e6','0,11e6','NaN,5e6']) assert.equal(a.run(`setReviewRange(${args})`),false);
  const w=a.run('reviewExportWindow()');assert.equal(w.visibleStartUs,17e6);assert.equal(w.endUs,21e6);assert.equal(w.durationUs,4e6);
  a.state.exporting=true;assert.equal(a.run('setReviewRange(0,10e6)'),false);
});
