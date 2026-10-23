'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/index.template.html'),'utf8');
test('the existing footer version is the unique final Help body item',()=>{
 assert.equal((source.match(/id="helpVersion"/g)||[]).length,1);
 assert.match(source,/<p id="helpVersion">Practice Mirror v1\.0\.2<\/p>\s*<!-- APP:HELP:END -->\s*<\/div>\s*<\/dialog>/);
 const footer=source.match(/<footer>[\s\S]*?<\/footer>/)[0];assert.doesNotMatch(footer,/v1\.0\.2/);
 assert.match(source,/footer:"Practice Mirror · 映像は端末内で処理されます。"/);
 assert.match(source,/footer:"Practice Mirror · Video is processed on this device\."/);
 assert.match(source,/<span class="version-badge">v1\.0\.2<\/span>/);
});
test('moved metadata retains existing compact and Review visibility',()=>{
 assert.match(source,/@media \(max-width:760px\), \(orientation:landscape\) and \(max-height:620px\) and \(pointer:coarse\)\{\s*:root\{[^}]*\}footer,#helpVersion\{display:none\}/);
 assert.match(source,/body\.review-active footer,body\.review-active #helpVersion\{display:none\}/);
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,'app.config.json'),'utf8')).version,'1.0.2');
});
