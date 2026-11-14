'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/index.template.html'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'app.config.json'),'utf8')).version;
test('the existing footer version is the unique final Help body item',()=>{
 assert.match(version,/^\d+\.\d+\.\d+$/);
 assert.equal((source.match(/id="helpVersion"/g)||[]).length,1);
 assert.match(source,/<p id="helpVersion">Practice Mirror v\d+\.\d+\.\d+<\/p>\s*<!-- APP:HELP:END -->\s*<\/div>\s*<\/dialog>/);
 assert.ok(source.includes(`<p id="helpVersion">Practice Mirror v${version}</p>`));
 const footer=source.match(/<footer>[\s\S]*?<\/footer>/)[0];assert.doesNotMatch(footer,/v\d+\.\d+\.\d+/);
 assert.match(source,/footer:"Practice Mirror · MIT License · 映像は端末内で処理されます"/);
 assert.match(source,/footer:"Practice Mirror · MIT License · Video is processed on this device"/);
 assert.ok(source.includes(`<span class="version-badge">v${version}</span>`));
});
test('moved metadata retains existing compact and Review visibility',()=>{
 assert.match(source,/@media \(max-width:760px\), \(orientation:landscape\) and \(max-height:620px\) and \(pointer:coarse\)\{\s*:root\{[^}]*\}footer,#helpVersion\{display:none\}/);
 assert.match(source,/body\.review-active footer,body\.review-active #helpVersion\{display:none\}/);
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,'app.config.json'),'utf8')).version,version);
});
