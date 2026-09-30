import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../service/worker.mjs';
const origin='https://xuwenwu.github.io';
const env={ALLOWED_ORIGINS:origin,AI_PROVIDER:'anthropic',AI_MODEL:'test-model',AI_API_KEY:'test-only',MATCH_LIMITER:{limit:async()=>({success:true})},TOTAL_LIMITER:{limit:async()=>({success:true})}};
const req=(body={introduction:'I study engineering'},extra={})=>new Request('https://worker.example/match',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
const criteria={level:'undergrad',cit:'',campus:'',type:'',interests:'engineering',location:'',funded:true};
test('rejects invalid origins, methods and unconfigured service',async()=>{
 assert.equal((await worker.fetch(req({}, {Origin:'https://evil.example'}),env)).status,403);
 assert.equal((await worker.fetch(req(),{...env,AI_API_KEY:''})).status,503);
 assert.equal((await worker.fetch(req(),{...env,MATCH_LIMITER:null})).status,503);
 assert.equal((await worker.fetch(new Request('https://worker.example/match',{headers:{Origin:origin}}),env)).status,405);
 assert.equal((await worker.fetch(new Request('https://worker.example/match',{method:'OPTIONS',headers:{Origin:origin}}),env)).status,204);
});
test('rejects excessive input and enforces both rate limits',async()=>{
 assert.equal((await worker.fetch(req({introduction:'x'.repeat(2001)}),env)).status,400);
 assert.equal((await worker.fetch(req({introduction:'x',extra:'x'.repeat(13000)}),env)).status,400);
 assert.equal((await worker.fetch(req(),{...env,TOTAL_LIMITER:{limit:async()=>({success:false})}})).status,429);
});
test('Anthropic adapter returns validated criteria without raw provider output',async t=>{
 t.mock.method(globalThis,'fetch',async(url,init)=>{assert.equal(url,'https://api.anthropic.com/v1/messages');assert.equal(init.headers['x-api-key'],'test-only');assert(!JSON.parse(init.body).system.includes('test-only'));return Response.json({content:[{type:'tool_use',name:'search_preferences',input:criteria}]});});
 const result=await worker.fetch(req(),env);assert.equal(result.status,200);assert.equal(result.headers.get('Access-Control-Allow-Origin'),origin);assert.deepEqual(await result.json(),{criteria});
});
test('OpenAI adapter uses structured output and disables stored responses',async t=>{
 t.mock.method(globalThis,'fetch',async(url,init)=>{const b=JSON.parse(init.body);assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(b.store,false);assert.equal(b.text.format.strict,true);return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(criteria)}]}]});});
 const result=await worker.fetch(req(),{...env,AI_PROVIDER:'openai'});assert.equal(result.status,200);assert.deepEqual(await result.json(),{criteria});
});
test('provider errors and fabricated enums fail closed',async t=>{
 t.mock.method(globalThis,'fetch',async()=>Response.json({content:[{type:'tool_use',name:'search_preferences',input:{...criteria,cit:'guessed'}}]}));
 const response=await worker.fetch(req(),env);assert.equal(response.status,502);assert.deepEqual(await response.json(),{error:'Matching temporarily unavailable'});
});
