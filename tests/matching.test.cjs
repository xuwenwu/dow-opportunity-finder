const test=require('node:test'),assert=require('node:assert/strict');
const {rank,collection,criteria}=require('../src/matching-core.js');
const base={id:'a',status:'published',audience:'student',levels:['undergrad'],cit:'open',funding:'stipend',type:'Internship',summary:'Robotics and materials research',location:'San Diego',deadline:'2027-01-01'};
const day='2026-09-30';
test('filters hard constraints but keeps unknown eligibility marked',()=>{
 const records=[base,{...base,id:'us',cit:'us'},{...base,id:'unknown',cit:'unknown',levels:[]},{...base,id:'late',deadline:'2026-09-01'},{...base,id:'pending',status:'pending'},{...base,id:'grad',levels:['grad']},{...base,id:'campus',campuses:['Elsewhere']},{...base,id:'unpaid',funding:'unpaid'}];
 const out=rank(records,{level:'undergrad',cit:'other',campus:'SDSU',funded:true},day);
 assert.deepEqual(out.map(o=>o.id),['a','unknown']);assert.equal(out[1].unknownCit,true);assert.equal(out[1].unknownLevel,true);
});
test('interests and location rank, not silently exclude nationwide options',()=>{
 const records=[{...base,id:'b',summary:'Chemistry',location:'Elsewhere'},base];
 const result=rank(records,{interests:'robotics, materials',location:'San Diego'},day);
 assert.equal(result[0].id,'a');assert.deepEqual(result[0].hits,['robotics','materials']);assert.equal(result.length,2);assert.equal(records[0].id,'b');
});
test('today deadline stays available; unknown dates are flagged',()=>{const out=rank([{...base,deadline:day},{...base,id:'b',deadline:null}],{},day);assert.equal(out.length,2);assert.equal(out[1].unknownDate,true);});
test('faculty and permanent resident constraints',()=>{const records=[base,{...base,id:'pr',cit:'us_pr'},{...base,id:'us',cit:'us'},{...base,id:'fac',audience:'faculty',levels:['faculty']}];assert.equal(rank(records,{level:'faculty'},day)[0].id,'fac');assert(!rank(records,{cit:'pr'},day).some(o=>o.id==='us'));});
test('collections reject untrusted structures and keep only public fields',()=>{
 for(const bad of [null,{v:2,ids:['a']},{v:1,ids:[]},{v:1,ids:['<img>']},{v:1,ids:Array(201).fill('a')}])assert.throws(()=>collection(bad));
 assert.deepEqual(collection({v:1,title:'Colección',ids:['a','a'],introduction:'private',notes:'private'}),{v:1,title:'Colección',ids:['a']});
 assert.equal(criteria({cit:'assumed',funded:'true'}).cit,'');assert.equal(criteria({funded:'true'}).funded,false);
});
