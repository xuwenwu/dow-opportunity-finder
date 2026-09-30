const assert=require('node:assert/strict');
const endpoint=process.argv[2];
if(!endpoint||!endpoint.startsWith('https://'))throw Error('Pass the deployed HTTPS /match endpoint');
const cases=[
 {name:'Unspecified citizenship',introduction:'I am an undergraduate at San Diego State University looking for a paid robotics internship near San Diego.',level:'undergrad',cit:'',campus:'San Diego State University',funded:true},
 {name:'Explicit permanent resident',introduction:'I am a graduate student at SDSU. I am not a US citizen; I am a US permanent resident. I want a funded research internship in materials science.',level:'grad',cit:'pr',funded:true},
 {name:'Spanish and neither citizenship nor residency',language:'es',introduction:'Soy estudiante de licenciatura en SDSU. No soy ciudadano estadounidense ni residente permanente de Estados Unidos. Busco prácticas pagadas de robótica en San Diego.',level:'undergrad',cit:'other',campus:'San Diego State University',funded:true}
];
(async()=>{
 for(const c of cases){const r=await fetch(endpoint,{method:'POST',headers:{Origin:'https://xuwenwu.github.io','Content-Type':'application/json'},body:JSON.stringify({introduction:c.introduction,language:c.language||'en'}),signal:AbortSignal.timeout(30000)});const data=await r.json();console.log(c.name,JSON.stringify({status:r.status,...data}));assert.equal(r.status,200);for(const field of ['level','cit','campus','funded'])if(field in c)assert.equal(data.criteria[field],c[field],c.name+': '+field);}
 const blocked=await fetch(endpoint,{method:'POST',headers:{Origin:'https://unrelated.example','Content-Type':'application/json'},body:JSON.stringify({introduction:'test'})});assert.equal(blocked.status,403);
 console.log('PASS: live Anthropic extraction, explicit/omitted citizenship, Spanish, and origin restriction.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
