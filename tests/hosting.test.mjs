import test from 'node:test';
import assert from 'node:assert/strict';
import host from '../hosting/_worker.js';
test('hosting serves only known public files without forwarding user data',async t=>{
 t.mock.method(globalThis,'fetch',async(url,init)=>{assert.equal(url,'https://xuwenwu.github.io/dow-opportunity-finder/index.html');assert.equal(init.headers,undefined);assert.equal(init.redirect,'manual');return new Response('<h1>Finder</h1>',{headers:{'Content-Type':'text/html','Set-Cookie':'example=1'}});});
 const r=await host.fetch(new Request('https://hsrufinder.pages.dev/?campus=private',{headers:{Cookie:'private=1',Authorization:'secret'}}));
 assert.equal(r.status,200);assert.equal(r.headers.get('Set-Cookie'),null);assert.equal(r.headers.get('Cache-Control'),'public, max-age=60');assert.equal(await r.text(),'<h1>Finder</h1>');
});
test('hosting rejects writes and unknown routes before upstream calls',async t=>{
 t.mock.method(globalThis,'fetch',()=>{throw Error('Must not call upstream');});
 assert.equal((await host.fetch(new Request('https://hsrufinder.pages.dev/',{method:'POST',body:'private'}))).status,405);
 for(const path of ['/service/worker.mjs','//evil.example','/data/unknown.json'])assert.equal((await host.fetch(new Request('https://hsrufinder.pages.dev'+path))).status,404);
});
test('hosting reads current data and preserves missing-file status',async t=>{
 t.mock.method(globalThis,'fetch',async(url)=>{assert.equal(url,'https://xuwenwu.github.io/dow-opportunity-finder/data/meta.json');return new Response('missing',{status:404});});
 assert.equal((await host.fetch(new Request('https://hsrufinder.pages.dev/data/meta.json'))).status,404);
});
test('hosting fails closed on an unexpected redirect',async t=>{
 t.mock.method(globalThis,'fetch',async()=>Response.redirect('https://unrelated.example'));
 const r=await host.fetch(new Request('https://hsrufinder.pages.dev/'));assert.equal(r.status,503);assert.equal(r.headers.get('Location'),null);
});
