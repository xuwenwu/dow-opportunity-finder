const {chromium}=require(process.env.CODEX_TASK_PLAYWRIGHT_MODULE||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../docs');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);try{res.setHeader('Content-Type',file.endsWith('.json')?'application/json':'text/html; charset=utf-8');res.end(fs.readFileSync(file===root?path.join(root,'index.html'):file));}catch(_){res.writeHead(404).end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url=process.argv[2]||'http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch(fs.existsSync(chromium.executablePath())?{headless:true}:{headless:true,channel:'msedge'});
 const context=await browser.newContext({viewport:{width:1360,height:1000}});
 await context.addInitScript(()=>localStorage.setItem('prefs',JSON.stringify({campus:'University of Texas at El Paso',radius:50})));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
 const ids=()=>page.locator('#featureList .opp').evaluateAll(ns=>ns.map(n=>n.dataset.id));
 async function checkMap(campus){
  assert(await page.locator('#featureMap').isVisible());
  const list=await ids(),data=await page.evaluate(async()=>await(await fetch('data/opportunities.json')).json());
  const expected=data.filter(o=>list.includes(o.id)&&(o.sites||[]).some(s=>Number.isFinite(s.lat)&&Number.isFinite(s.lon))).map(o=>o.id).sort();
  const mapped=await page.locator('#featureMap').evaluate(el=>[...new Set(Object.values(el._groups).flatMap(g=>g.items.map(o=>o.id)))].sort());
  assert.deepEqual(mapped,expected);
  assert((await page.locator('#featureMap').innerText()).includes(`Showing locations for ${mapped.length} of ${list.length} matches.`));
  assert.equal(await page.locator('#featureMap .map-me title').allTextContents().then(t=>t[0]||''),campus);
  assert.equal(await page.locator('#featureMap svg').getAttribute('viewBox'),'0.00 0.00 975.00 610.00');
  if(mapped.length){
   const pin=page.locator('#featureMap .map-pin').first();await pin.focus();await page.keyboard.press('Enter');
   const jump=page.locator('#featureMap .map-pop button').first(),id=await jump.getAttribute('data-jump');await jump.click();
   assert.deepEqual(await ids(),list);assert(await page.locator('#featureView').isVisible());
   assert.equal(await page.evaluate(()=>document.activeElement.dataset.id),id);
   assert.equal(await page.locator('#h-campus').inputValue(),'University of Texas at El Paso');
  }
  return {total:list.length,mapped:mapped.length};
 }
 try{
  await page.goto(url);await page.locator('#list .opp').first().waitFor();
  await page.getByRole('tab',{name:'Near my campus',exact:true}).click();
  assert(await page.locator('#mapBox').isVisible());
  const browsingView=await page.locator('#mapBox svg').getAttribute('viewBox');assert.notEqual(browsingView,'0.00 0.00 975.00 610.00');
  await page.getByRole('heading',{name:'Find opportunities for me',exact:true}).click();
  await page.locator('#matchLevel').selectOption('undergrad');
  await page.getByRole('button',{name:'Find matches',exact:true}).click();
  console.log('No campus:',await checkMap(''));
  assert.equal(await page.locator('#featureList .chip.mi').count(),0);
  await page.getByRole('button',{name:'Edit search',exact:true}).click();
  await page.route('**/data/features.json',r=>r.fulfill({json:{matchEndpoint:'https://matching.example/match'}}));
  await page.route('https://matching.example/match',r=>r.fulfill({json:{criteria:{level:'undergrad',campus:'San Diego State University',type:'Scholarship',funded:true}}}));
  await page.reload();await page.locator('#list .opp').first().waitFor();
  await page.getByRole('heading',{name:'Find opportunities for me',exact:true}).click();
  await page.locator('#matchIntro').fill('I am an SDSU student looking for a scholarship.');
  await page.locator('#matchConsent').check();await page.locator('#matchInterpret').click();
  await page.getByText('Preferences suggested. Review them before finding matches.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Find matches',exact:true}).click();
  console.log('AI scholarship:',await checkMap('San Diego State University'));
  await page.getByRole('button',{name:'Edit search',exact:true}).click();await page.locator('#matchType').selectOption('');
  await page.getByRole('button',{name:'Find matches',exact:true}).click();
  console.log('Campus matches:',await checkMap('San Diego State University'));
  for(const text of await page.locator('#featureList .chip.mi').allTextContents())assert(text.includes('SDSU'));
  for(const width of [1360,390]){
   await page.setViewportSize({width,height:1000});await page.locator('#featureMap').scrollIntoViewIfNeeded();
   const pin=page.locator('#featureMap .map-pin').first();await pin.click();assert(await page.locator('#featureMap .map-pop').isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   fs.mkdirSync(path.join(root,'../build/qa'),{recursive:true});await page.screenshot({path:path.join(root,`../build/qa/matches-map-${width}.png`)});
   await page.locator('#featureTitle').click();
  }
  await page.getByRole('button',{name:'Español',exact:true}).click();assert((await page.locator('#featureMap').innerText()).includes('Ubicaciones de tus coincidencias'));
  await page.getByRole('button',{name:'English',exact:true}).click();
  await page.getByRole('button',{name:'Back to browsing',exact:true}).click();await page.getByRole('tab',{name:'Near my campus',exact:true}).click();
  assert.equal(await page.locator('#mapBox svg').getAttribute('viewBox'),browsingView);
  assert.equal(await page.locator('#mapBox .map-me title').textContent(),'University of Texas at El Paso');
  await page.locator('#mapBox .map-pin').first().click();assert(await page.locator('#mapBox .map-pop').isVisible());
  // Empty matching results should have no stale pins or campus map.
  await page.getByRole('heading',{name:'Find opportunities for me',exact:true}).click();
  if(!await page.locator('#matchForm').isVisible())await page.getByRole('heading',{name:'Find opportunities for me',exact:true}).click();
  await page.locator('#matchLevel').selectOption('faculty');await page.locator('#matchType').selectOption('Scholarship');
  await page.getByRole('button',{name:'Find matches',exact:true}).click();
  assert.equal(await page.locator('#featureList .opp').count(),0);assert(await page.locator('#featureMap').isHidden());
  assert.deepEqual(errors,[]);console.log('PASS: matching maps, exact pin membership, AI scholarship flow, campus isolation, pin navigation, mobile, Spanish, empty results and browsing map regression',url);
 }finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
