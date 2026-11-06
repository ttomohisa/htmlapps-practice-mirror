'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {packageRelease}=require('../scripts/package-release.cjs');
const publish=require('../scripts/publish-release.cjs');
const sha='a'.repeat(40);
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'mirror-release-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'dist'));fs.mkdirSync(path.join(root,'docs/releases'),{recursive:true});
  fs.writeFileSync(path.join(root,'app.config.json'),JSON.stringify({slug:'practice-mirror',version:'1.1.0'}));
  for(const p of ['dist/index.html','practice-mirror.html'])fs.writeFileSync(path.join(root,p),'standalone v1.1.0');
  fs.writeFileSync(path.join(root,'dist/index.self-extract.html'),'self-extract HTML');
  fs.writeFileSync(path.join(root,'docs/releases/v1.1.0.md'),'Release notes\n');
  return {root,dir:path.join(root,'release')};
}
function api(options={}){
  const calls=[],draft={id:7,draft:true,assets:[],upload_url:'upload',html_url:'release-url',tag_name:'v1.1.0'};
  const github={paginate:async()=>options.existing?[options.existing]:[],rest:{
    git:{getRef:async()=>{if(options.tagSha)return{data:{object:{type:'commit',sha:options.tagSha}}};throw{status:404};},createRef:async args=>{calls.push(['tag',args]);return{data:{}};}},
    repos:{createRelease:async args=>{calls.push(['draft',args]);return{data:draft};},deleteReleaseAsset:async args=>calls.push(['delete',args]),
      uploadReleaseAsset:async args=>{calls.push(['upload',args]);if(options.failUpload)throw Error('Upload failed');return{data:{}};},
      updateRelease:async args=>{calls.push(['publish',args]);draft.draft=args.draft;return{data:draft};}}
  }};
  return {github,calls,draft,core:{notice(){},summary:{addHeading(){return this;},addLink(){return this;},async write(){}}}};
}
function run(dir,a,extra={}){return publish({github:a.github,core:a.core,context:{ref:'refs/heads/main',sha,repo:{owner:'owner',repo:'repo'},...extra},releaseDir:dir});}
test('packages both standalone variants and their checksums, bound to the tested commit',t=>{
  const f=fixture(t),m=packageRelease({root:f.root,commitSha:sha});
  assert.equal(m.tag,'v1.1.0');assert.equal(m.commit,sha);
  assert.deepEqual(m.assets.map(x=>x.name),['practice-mirror.html','practice-mirror.self-extract.html','SHA256SUMS']);
  assert.match(fs.readFileSync(path.join(f.dir,'SHA256SUMS'),'utf8'),/^[a-f0-9]{64}  practice-mirror\.html/m);
  assert.equal(fs.readFileSync(path.join(f.dir,'practice-mirror.html'),'utf8'),'standalone v1.1.0');
});
test('packaging rejects a stale root HTML before preparing assets',t=>{
  const f=fixture(t);fs.writeFileSync(path.join(f.root,'practice-mirror.html'),'stale');
  assert.throws(()=>packageRelease({root:f.root,commitSha:sha}),/root HTML/);
});
test('PR and non-main contexts cannot tag or publish',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const a=api();
  await assert.rejects(run(f.dir,a,{ref:'refs/pull/13/merge'}),/main/);assert.equal(a.calls.length,0);
});
test('corrupt assets fail before any tag or release mutation',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});fs.appendFileSync(path.join(f.dir,'practice-mirror.html'),'bad');const a=api();
  await assert.rejects(run(f.dir,a),/integrity/);assert.equal(a.calls.length,0);
});
test('creates the exact version tag and publishes only after all draft uploads',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const a=api();await run(f.dir,a);
  assert.deepEqual(a.calls.map(x=>x[0]),['tag','draft','upload','upload','upload','publish']);
  assert.equal(a.calls[0][1].sha,sha);assert.equal(a.calls[0][1].ref,'refs/tags/v1.1.0');
  assert.equal(a.calls[1][1].draft,true);assert.equal(a.calls.at(-1)[1].draft,false);
});
test('upload failure leaves a draft and never publishes a partial release',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const a=api({failUpload:true});
  await assert.rejects(run(f.dir,a),/Upload failed/);assert.equal(a.draft.draft,true);assert.ok(!a.calls.some(x=>x[0]==='publish'));
});
test('reruns never overwrite a published release or move its tag',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const a=api({existing:{tag_name:'v1.1.0',draft:false,html_url:'existing'}});
  const r=await run(f.dir,a);assert.equal(r.skipped,true);assert.equal(a.calls.length,0);
});
test('a tag pointing at another commit blocks draft publication',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const a=api({tagSha:'b'.repeat(40)});
  await assert.rejects(run(f.dir,a),/another commit/);assert.equal(a.calls.length,0);
});
test('an interrupted draft upload can be safely retried',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const existing={id:7,draft:true,tag_name:'v1.1.0',assets:[{id:9,name:'practice-mirror.html'}],upload_url:'upload',html_url:'url'};const a=api({existing,tagSha:sha});
  await run(f.dir,a);assert.equal(a.calls.filter(x=>x[0]==='tag').length,0);assert.equal(a.calls.filter(x=>x[0]==='draft').length,0);assert.equal(a.calls.filter(x=>x[0]==='delete').length,1);assert.equal(a.calls.at(-1)[0],'publish');
});
test('an artifact from another commit cannot create a release',async t=>{
  const f=fixture(t);packageRelease({root:f.root,commitSha:sha});const a=api();
  await assert.rejects(run(f.dir,a,{sha:'b'.repeat(40)}),/tested commit/);assert.equal(a.calls.length,0);
});
test('packaging rejects non-SemVer leading-zero stable versions',t=>{
  const f=fixture(t);fs.writeFileSync(path.join(f.root,'app.config.json'),JSON.stringify({slug:'practice-mirror',version:'01.1.0'}));
  assert.throws(()=>packageRelease({root:f.root,commitSha:sha}),/version/);
});
