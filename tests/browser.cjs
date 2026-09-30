const {chromium}=require(process.env.CODEX_TASK_PLAYWRIGHT_MODULE||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../docs');
(async()=>{
 const server=http.createServer((req,res)=>{const relative=decodeURIComponent(new URL(req.url,'http://local').pathname);const file=path.resolve(root,'.'+relative+(relative.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',file.endsWith('.json')?'application/json':'text/html; charset=utf-8');res.end(fs.readFileSync(file));}catch(_){res.writeHead(404).end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch(fs.existsSync(chromium.executablePath())?{headless:true}:{headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1360,height:1000}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message);});page.setDefaultTimeout(10000);
 try{
 await page.goto(url);await page.locator('#list .opp').first().waitFor();
 fs.mkdirSync(path.resolve(__dirname,'../build/qa'),{recursive:true});
 fs.writeFileSync(path.resolve(__dirname,'../build/qa/initial.txt'),await page.locator('body').ariaSnapshot());
 console.log('Loaded opportunity finder');
 
 await page.getByRole('heading',{name:'Find opportunities for me',exact:true}).click();
 console.log('Matching form:',(await page.locator('#matchPanel').ariaSnapshot()).slice(0,1400));
 await page.getByRole('combobox',{name:'Education or career level',exact:true}).selectOption('undergrad');
 await page.getByRole('combobox',{name:'Citizenship (optional)',exact:true}).selectOption('other');
 await page.getByLabel('Interests (separate topics with commas)',{exact:true}).fill('materials, engineering');
 await page.getByRole('button',{name:'Find matches',exact:true}).click();
 await page.getByRole('heading',{name:'Your matches',exact:true}).waitFor();
 const matches=await page.locator('#featureList .opp').count();assert(matches>0);
 const data=JSON.parse(fs.readFileSync(path.join(root,'data/opportunities.json'),'utf8'));
 for(const id of await page.locator('#featureList .opp').evaluateAll(nodes=>nodes.map(n=>n.dataset.id))){
   const o=data.find(o=>o.id===id);assert(!['us','us_pr'].includes(o.cit));assert.equal(o.status,'published');
 }
 // Search results expose an editable return path and a clean restart.
 await page.locator('#featureView').getByRole('button',{name:'Edit search',exact:true}).click();
 assert.equal(await page.locator('#featureView').isHidden(),true);
 assert.equal(await page.locator('#matchLevel').inputValue(),'undergrad');
 assert.equal(await page.locator('#matchCit').inputValue(),'other');
 assert.equal(await page.locator('#matchInterests').inputValue(),'materials, engineering');
 await page.getByLabel('Describe your background and goals',{exact:true}).fill('Previous search introduction');
 await page.getByRole('button',{name:'Find matches',exact:true}).click();
 // Opening Share on a card must put usable links above adjacent cards.
 for(const width of [1360,390]){
  await page.setViewportSize({width,height:1000});
  const card=page.locator('#featureList .opp').first(),id=await card.getAttribute('data-id');
  await card.getByRole('button',{name:'Share',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.waitFor();
  assert((await page.getByLabel('Collection link',{exact:true}).inputValue()).endsWith('#opportunity='+encodeURIComponent(id)));
  const linkedin=dialog.getByRole('link',{name:'LinkedIn',exact:true});await linkedin.scrollIntoViewIfNeeded();
  assert(await linkedin.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}));
  assert.equal(await dialog.getByRole('link',{name:'Bluesky',exact:true}).count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:path.resolve(__dirname,'../build/qa/share-fixed-'+width+'.png')});
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);
 }
 await page.locator('#featureView').getByRole('button',{name:'New search',exact:true}).click();
 assert.equal(await page.locator('#featureView').isHidden(),true);
 assert.equal(await page.locator('#matchIntro').inputValue(),'');
 for(const id of ['matchLevel','matchCit','matchCampus','matchType','matchInterests','matchLocation'])assert.equal(await page.locator('#'+id).inputValue(),'');
 assert.equal(await page.locator('#matchFunded').isChecked(),true);
 assert.equal(await page.locator('#matchConsent').isChecked(),false);
 assert.equal(await page.locator('#matchIntro').evaluate(el=>el===document.activeElement),true);
 await page.getByRole('button',{name:'Find matches',exact:true}).click();
 assert((await page.locator('#featureList .opp').count())>0);
 await page.screenshot({path:path.resolve(__dirname,'../build/qa/new-search-mobile.png')});
 await page.setViewportSize({width:1360,height:1000});
 await page.getByRole('button',{name:'Back to browsing',exact:true}).click();
 await page.locator('#resultsToolbar').getByRole('button',{name:'Save collection',exact:true}).click();
 console.log('Collection dialog:',(await page.getByRole('dialog').ariaSnapshot()).slice(0,800));
 await page.getByLabel('Collection name',{exact:true}).fill('Engineering summer 2027');
 const choices=page.locator('#collectionChoices input');for(let i=2;i<await choices.count();i++)await choices.nth(i).uncheck();
 const selected=await choices.evaluateAll(nodes=>nodes.filter(n=>n.checked).map(n=>n.value));
 await page.getByRole('button',{name:'Save on this device',exact:true}).click();
 assert.equal(await page.locator('#featureList .opp').count(),2);
 await page.locator('#featureToolbar').getByRole('button',{name:'Share',exact:true}).click();
 console.log('Sharing dialog:',(await page.getByRole('dialog').ariaSnapshot()).slice(0,1300));
 const link=await page.getByLabel('Collection link',{exact:true}).inputValue();
 assert(link.includes('#collection='));assert(!link.includes('materials'));assert(!link.includes('other'));
 await page.getByLabel('Recipient email (optional)',{exact:true}).fill('advisor@example.edu');
 await page.evaluate(()=>{const original=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.href.startsWith('mailto:'))window.testMail=this.href;else original.call(this);};});
 await page.getByRole('dialog').getByRole('button',{name:'Email',exact:true}).click();
 const mail=await page.evaluate(()=>window.testMail);assert(mail.startsWith('mailto:advisor%40example.edu'));assert(decodeURIComponent(mail).includes(link));
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download list',exact:true}).click();
 const downloaded=await download;await downloaded.saveAs(path.resolve(__dirname,'../build/qa/collection.txt'));
 assert(fs.readFileSync(path.resolve(__dirname,'../build/qa/collection.txt'),'utf8').includes('Engineering summer 2027'));
 const imageDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download Instagram image',exact:true}).click();
 await (await imageDownload).saveAs(path.resolve(__dirname,'../build/qa/instagram.png'));
 await page.getByRole('button',{name:'Close',exact:true}).click();
 const fresh=await browser.newContext({viewport:{width:390,height:844}});
 await fresh.addInitScript(()=>localStorage.setItem('prefs',JSON.stringify({level:'postdoc',cit:'other',campus:'University of Texas at El Paso',radius:50})));
 const recipient=await fresh.newPage();recipient.on('pageerror',e=>errors.push(e.message));await recipient.goto(link);await recipient.locator('#featureList .opp').first().waitFor();
 assert.deepEqual(await recipient.locator('#featureList .opp').evaluateAll(ns=>ns.map(n=>n.dataset.id)),selected);
 assert.equal(await recipient.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await recipient.locator('#featureTitle').scrollIntoViewIfNeeded();await recipient.screenshot({path:path.resolve(__dirname,'../build/qa/mobile-collection.png')});
 await recipient.locator('#featureList .opp').first().getByRole('button',{name:'Email',exact:true}).click();
 const single=await recipient.getByLabel('Collection link',{exact:true}).inputValue();assert(single.includes('#opportunity='));
 await recipient.getByRole('button',{name:'Close',exact:true}).click();await recipient.goto(single);await recipient.locator('#featureList .opp').first().waitFor();assert.equal(await recipient.locator('#featureList .opp').count(),1);
 // Hash navigation without reload must preserve the new link.
 await recipient.evaluate(url=>{location.hash=new URL(url).hash;},link);await recipient.waitForFunction(()=>document.querySelectorAll('#featureList .opp').length===2);
 await recipient.getByRole('button',{name:'Español',exact:true}).click();
 assert.equal(await recipient.locator('#featureToolbar').getByRole('button',{name:'Guardar colección',exact:true}).count(),1);
 await fresh.close();
 await page.reload();await page.locator('#list .opp').first().waitFor();
 await page.getByRole('heading',{name:'My saved opportunities and collections',exact:true}).click();
 await page.getByRole('button',{name:'Engineering summer 2027 (2)',exact:true}).click();
 await page.getByRole('button',{name:'Edit collection',exact:true}).click();
 await page.locator('#collectionChoices input').last().uncheck();
 await page.getByRole('button',{name:'Save on this device',exact:true}).click();assert.equal(await page.locator('#featureList .opp').count(),1);
 await page.locator('#featureToolbar').getByRole('button',{name:'Share',exact:true}).click();
 const one=await page.getByLabel('Collection link',{exact:true}).inputValue();assert(one.includes('#collection='));
 await page.getByRole('button',{name:'Close',exact:true}).click();
 await page.getByRole('tab',{name:'Faculty',exact:true}).click();assert.equal(await page.locator('#featureView').isHidden(),true);
 // A mocked provider connection exercises consent, suggestions and failure without spending API credits.
 await page.route('**/data/features.json',r=>r.fulfill({json:{matchEndpoint:'https://matching.example/match'}}));
 let requests=0;await page.route('https://matching.example/match',r=>{requests++;return r.fulfill({json:{criteria:{level:'undergrad',cit:'',campus:'San Diego State University',type:'Internship',interests:'robotics',location:'San Diego',funded:true}}});});
 await page.reload();await page.locator('#list .opp').first().waitFor();await page.getByRole('heading',{name:'Find opportunities for me',exact:true}).click();
 await page.getByLabel('Describe your background and goals',{exact:true}).fill('I am a junior at SDSU seeking paid robotics research.');
 await page.getByRole('button',{name:'Suggest search criteria with AI',exact:true}).click();assert.equal(requests,0);
 await page.getByLabel('Send my introduction to the AI service to suggest criteria.',{exact:true}).check();
 await page.getByRole('button',{name:'Suggest search criteria with AI',exact:true}).click();await page.getByText('Preferences suggested. Review them before finding matches.',{exact:true}).waitFor();
 assert.equal(await page.getByRole('combobox',{name:'Citizenship (optional)',exact:true}).inputValue(),'');
 
 assert.equal(await page.locator('#matchCampus').inputValue(),'San Diego State University');
 assert.equal(await page.locator('#featureView').isHidden(),true);
 await page.route('https://matching.example/match',r=>r.fulfill({status:503,json:{error:'Unavailable'}}));
 await page.getByRole('button',{name:'Suggest search criteria with AI',exact:true}).click();await page.getByText('AI matching is unavailable. Your text is still here; use the preferences below or try again later.',{exact:true}).waitFor();
 assert((await page.locator('#matchIntro').inputValue()).includes('junior'));
 await page.evaluate(()=>{window.SpeechRecognition=class{start(){setTimeout(()=>this.onresult({resultIndex:0,results:[Object.assign([{transcript:'materials research'}],{isFinal:true})]}),0);}stop(){this.onend();}};});
 await page.getByRole('button',{name:'Use microphone',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#matchIntro').value.includes('materials research'));
 await page.getByRole('button',{name:'Stop recording',exact:true}).click();
 await page.locator('#discovery').scrollIntoViewIfNeeded();await page.screenshot({path:path.resolve(__dirname,'../build/qa/desktop-matching.png')});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.resolve(__dirname,'../build/qa/mobile-matching.png')});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);

 // New search can cancel an in-flight suggestion without restoring stale input.
 let started,release;const pending=new Promise(r=>started=r),released=new Promise(r=>release=r);
 await page.route('https://matching.example/match',async r=>{started();await released;try{await r.fulfill({json:{criteria:{level:'faculty',cit:'us',campus:'',type:'',interests:'stale',location:'',funded:false}}});}catch(_){}});
 await page.getByRole('button',{name:'Suggest search criteria with AI',exact:true}).click();await pending;
 await page.locator('#matchForm').getByRole('button',{name:'New search',exact:true}).click();release();
 await page.waitForFunction(()=>!document.querySelector('#matchInterpret').disabled);
 assert.equal(await page.locator('#matchIntro').inputValue(),'');assert.equal(await page.locator('#matchStatus').textContent(),'');
 assert.equal(await page.locator('#matchLevel').inputValue(),'');
 await page.getByRole('button',{name:'Español',exact:true}).click();
 assert.equal(await page.locator('#matchForm').getByRole('button',{name:'Nueva búsqueda',exact:true}).count(),1);
 await page.getByRole('button',{name:'English',exact:true}).click();

 // Individual saves survive reload, and storage failures never claim success.
 await page.goto(url);await page.locator('#list .opp').first().waitFor();
 const firstSave=page.locator('#list .opp').first().getByRole('button',{name:'Save',exact:true});await firstSave.click();
 await page.reload();await page.locator('#list .opp').first().waitFor();assert.equal(await page.locator('#list .opp').first().getByRole('button',{name:'Saved',exact:true}).count(),1);
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='saved'||key==='dow.collections.v1')throw new DOMException('Full','QuotaExceededError');return original.call(this,key,value);};});
 const bp=await blocked.newPage();await bp.goto(url);await bp.locator('#list .opp').first().waitFor();
 await bp.locator('#list .opp').first().getByRole('button',{name:'Save',exact:true}).click();
 assert.equal(await bp.locator('#list .opp').first().getByRole('button',{name:'Save',exact:true}).count(),1);
 assert((await bp.locator('#toast').textContent()).includes('storage'));
 await bp.locator('#resultsToolbar').getByRole('button',{name:'Save collection',exact:true}).click();
 await bp.getByRole('button',{name:'Save on this device',exact:true}).click();assert((await bp.locator('#collectionStatus').textContent()).includes('storage'));
 await blocked.close();
 // Missing records are explicitly reported and are never replaced by other results.
 await page.goto(url+'#collection='+encodeURIComponent(JSON.stringify({v:1,title:'Unavailable test',ids:[selected[0],'removed-example']})));
 await page.locator('#featureList .opp').first().waitFor();assert.equal(await page.locator('#featureList .opp').count(),1);assert((await page.locator('#featureNote').textContent()).includes('no longer published'));
 // Malformed and adversarial public links stay inert.
 await page.goto(url+'#collection='+encodeURIComponent(JSON.stringify({v:1,title:'<img src=x onerror=alert(1)>',ids:[selected[0]]})));
 await page.locator('#featureList .opp').first().waitFor();assert.equal(await page.locator('#featureTitle img').count(),0);
 await page.goto(url+'#collection=%oops');await page.locator('#list .opp').first().waitFor();assert.equal(await page.locator('#featureView').isHidden(),true);
 assert.deepEqual(errors,[]);
 console.log('PASS: unobstructed sharing, edit/new search, cancellation, matching, collection save/edit/reload, recipient isolation, single links, hash changes, email, downloads, Spanish, AI consent/failure, voice mock, mobile layout and malformed links.');


 await page.screenshot({path:path.resolve(__dirname,'../build/qa/desktop.png')});
 }finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
