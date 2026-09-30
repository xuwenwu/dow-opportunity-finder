/* Matching, saved collections and public links. Included inside the page closure. */
const FX={
 en:{find:'Find opportunities for me',intro:'Describe your background and goals',example:'Example: I am an SDSU engineering junior seeking paid summer research in robotics.',privacy:'Optional: describe your interests, education and goals. Do not include your name, email or other identifying details. Your introduction is not saved or included in shared links.',voice:'Use microphone',stop:'Stop recording',interpret:'Suggest search criteria with AI',offline:'AI matching is not connected yet. Use the editable preferences below to find opportunities.',consent:'Send my introduction to the AI service to suggest criteria.',review:'Review these preferences, then find matches. Location and interests affect order; eligibility and funding filter the list.',interests:'Interests (separate topics with commas)',location:'Preferred city or location',match:'Find matches',any:'Any / not specified',level:'Education or career level',cit:'Citizenship (optional)',campus:'Campus',type:'Opportunity type',funded:'Only funded opportunities',collections:'My saved opportunities and collections',device:'Saved in this browser only. Use a collection link or download to keep a portable copy.',saved:'My saved opportunities',saveResults:'Save collection',email:'Email',share:'Share',back:'Back to browsing',empty:'No matching opportunities. Broaden your preferences and try again.',matchTitle:'Your matches',check:'Possible fits, not a determination of eligibility. Confirm requirements and dates on the official pages.',interest:'Topics mentioned in the listing',near:'Listing mentions your preferred location',noTopic:'No explicit topic match in the listing; review the program details.',unknownCit:'Citizenship eligibility needs confirmation.',unknownLevel:'Education requirements need confirmation.',unknownDate:'Application timing needs confirmation.',timing:'Your preferred participation dates must be checked on the official page.',collectionTitle:'Collection name',choose:'Choose the opportunities to keep',save:'Save on this device',cancel:'Cancel',delete:'Delete',edit:'Edit collection',deleteAsk:'Delete this saved collection from this browser?',savedOK:'Saved on this device',storageError:'Browser storage is unavailable or full. Use Share or Download to keep a copy.',shareTitle:'Share opportunities',shareNote:'The link includes the selected opportunity IDs and collection title, with current listing details. It excludes your introduction, private notes and match explanations. Anyone with the link can view it.',copy:'Copy link',native:'Share using device',ig:'Download Instagram image',caption:'Copy caption',download:'Download list',recipient:'Recipient email (optional)',emailNote:'Opens your email app; you review and send the message. A link includes the entire collection.',link:'Collection link',close:'Close',unavailable:'Some opportunities are no longer published and are omitted. Expired published listings are marked on their cards.',badLink:'This shared link is invalid or too large. Ask the sender for a new link.',noItems:'There are no opportunities to save or share.',working:'Preparing editable preferences…',ready:'Preferences suggested. Review them before finding matches.',aiError:'AI matching is unavailable. Your text is still here; use the preferences below or try again later.',voiceError:'Voice input is unavailable or microphone access was denied. You can type instead.',voiceNote:'Voice availability depends on your browser. Speech may be processed by your browser’s speech service.',recording:'Listening… select Stop recording when finished.',notSupported:'Voice input is not supported in this browser. You can type instead.',copied:'Copied',copyFailed:'Automatic copy failed. Select and copy the text in the field.',savedEmpty:'No saved collections yet.',selected:'opportunities selected',remove:'Remove',all:'All',shared:'Shared opportunities'},
 es:{find:'Encuentra oportunidades para mí',intro:'Describe tu formación y tus objetivos',example:'Ejemplo: estudio ingeniería en SDSU y busco investigación de verano pagada en robótica.',privacy:'Opcional: describe tus intereses, estudios y objetivos. No incluyas tu nombre, correo ni datos que te identifiquen. Tu presentación no se guarda ni se comparte en los enlaces.',voice:'Usar micrófono',stop:'Detener grabación',interpret:'Sugerir criterios con IA',offline:'La IA aún no está conectada. Usa las preferencias editables para encontrar oportunidades.',consent:'Enviar mi presentación al servicio de IA para sugerir criterios.',review:'Revisa las preferencias y busca coincidencias. Lugar e intereses ordenan; requisitos y financiamiento filtran.',interests:'Intereses (separa los temas con comas)',location:'Ciudad o lugar preferido',match:'Buscar coincidencias',any:'Cualquiera / sin especificar',level:'Nivel académico o profesional',cit:'Ciudadanía (opcional)',campus:'Universidad',type:'Tipo de oportunidad',funded:'Solo oportunidades financiadas',collections:'Mis oportunidades y colecciones guardadas',device:'Guardadas solo en este navegador. Comparte el enlace o descarga una copia para conservarlas.',saved:'Mis oportunidades guardadas',saveResults:'Guardar colección',email:'Correo',share:'Compartir',back:'Volver a explorar',empty:'No hay coincidencias. Amplía tus preferencias e inténtalo de nuevo.',matchTitle:'Tus coincidencias',check:'Posibles opciones, sin garantía de elegibilidad. Confirma requisitos y fechas en las páginas oficiales.',interest:'Temas mencionados en la oportunidad',near:'La oportunidad menciona el lugar que prefieres',noTopic:'Sin coincidencia explícita de tema; revisa los detalles del programa.',unknownCit:'Confirma los requisitos de ciudadanía.',unknownLevel:'Confirma los requisitos académicos.',unknownDate:'Confirma las fechas de solicitud.',timing:'Confirma las fechas de participación en la página oficial.',collectionTitle:'Nombre de la colección',choose:'Elige las oportunidades que deseas conservar',save:'Guardar en este dispositivo',cancel:'Cancelar',delete:'Eliminar',edit:'Editar colección',deleteAsk:'¿Eliminar esta colección de este navegador?',savedOK:'Guardado en este dispositivo',storageError:'El almacenamiento no está disponible o está lleno. Comparte o descarga una copia.',shareTitle:'Compartir oportunidades',shareNote:'El enlace incluye los identificadores y el título de la colección, con detalles actualizados. Excluye tu presentación, notas privadas y explicaciones. Cualquiera con el enlace puede verla.',copy:'Copiar enlace',native:'Compartir con el dispositivo',ig:'Descargar imagen para Instagram',caption:'Copiar texto',download:'Descargar lista',recipient:'Correo del destinatario (opcional)',emailNote:'Abre tu aplicación de correo; tú revisas y envías el mensaje. El enlace incluye toda la colección.',link:'Enlace de la colección',close:'Cerrar',unavailable:'Algunas oportunidades ya no están publicadas y se omiten. Las vencidas se indican en sus tarjetas.',badLink:'El enlace no es válido o es demasiado largo. Solicita otro enlace.',noItems:'No hay oportunidades para guardar o compartir.',working:'Preparando preferencias editables…',ready:'Preferencias sugeridas. Revísalas antes de buscar.',aiError:'La IA no está disponible. Tu texto sigue aquí; usa las preferencias o vuelve a intentarlo.',voiceError:'No se puede usar el micrófono. Puedes escribir.',voiceNote:'La voz depende del navegador y puede procesarse mediante su servicio de reconocimiento.',recording:'Escuchando… selecciona Detener grabación al terminar.',notSupported:'Este navegador no admite voz. Puedes escribir.',copied:'Copiado',copyFailed:'No se pudo copiar. Selecciona y copia el texto del campo.',savedEmpty:'No hay colecciones guardadas.',selected:'oportunidades seleccionadas',remove:'Quitar',all:'Todas',shared:'Oportunidades compartidas'}
};
FX.en.newSearch='New search';FX.es.newSearch='Nueva búsqueda';
FX.en.editSearch='Edit search';FX.es.editSearch='Editar búsqueda';
FX.en.voiceDone='Transcript added. Review the text before sending it to AI.';
FX.es.voiceDone='Transcripción agregada. Revisa el texto antes de enviarlo a la IA.';
FX.en.collectionNote='Selected opportunities with current listing details. Save this collection to keep it on this device.';
FX.es.collectionNote='Oportunidades seleccionadas con detalles actuales. Guarda la colección para conservarla en este dispositivo.';
const F=k=>FX[st.lang][k]||FX.en[k]||k;
const feature={mode:null,ids:[],title:'',localId:null,matches:new Map(),criteria:null,collections:[],endpoint:'',busy:false,request:null,recognition:null};
try{feature.collections=(lsGet('dow.collections.v1')||[]).slice(0,100).map(c=>({...OpportunityTools.collection(c),localId:String(c.localId||'')}));}catch(_){}
const discovery=document.createElement('section');discovery.id='discovery';discovery.className='discovery';
discovery.innerHTML=`<details class="panel" id="matchPanel"><summary><h2 data-fx="find"></h2></summary>
 <label class="f"><span data-fx="intro"></span><textarea id="matchIntro" maxlength="2000" aria-describedby="matchPrivacy matchVoiceNote"></textarea></label>
 <p id="matchPrivacy" class="hint" data-fx="privacy"></p><p id="matchVoiceNote" class="hint" data-fx="voiceNote"></p>
 <div class="actions"><button class="btn" id="matchVoice" type="button" data-fx="voice"></button></div>
 <p class="hint" id="matchOffline" data-fx="offline"></p>
 <label class="check" id="matchConsentRow" hidden><input id="matchConsent" type="checkbox"><span data-fx="consent"></span></label>
 <button class="btn" type="button" id="matchInterpret" data-fx="interpret" hidden></button>
 <p id="matchStatus" role="status" class="hint"></p>
 <form id="matchForm"><p class="hint" data-fx="review"></p><div class="match-fields">
 <label class="f"><span data-fx="level"></span><select id="matchLevel"><option value=""></option><option value="undergrad">Undergraduate</option><option value="grad">Graduate student</option><option value="postdoc">Postdoc</option><option value="faculty">Faculty</option></select></label>
 <label class="f"><span data-fx="cit"></span><select id="matchCit"><option value=""></option><option value="us">U.S. citizen</option><option value="pr">Permanent resident</option><option value="other">Neither</option></select></label>
 <label class="f"><span data-fx="campus"></span><select id="matchCampus"></select></label>
 <label class="f"><span data-fx="type"></span><select id="matchType"></select></label>
 <label class="f"><span data-fx="interests"></span><input id="matchInterests" type="text" maxlength="300" placeholder="robotics, materials, engineering"></label>
 <label class="f"><span data-fx="location"></span><input id="matchLocation" type="text" maxlength="120"></label></div>
 <label class="check"><input id="matchFunded" type="checkbox" checked><span data-fx="funded"></span></label>
 <div class="search-actions"><button class="btn primary" type="submit" data-fx="match"></button><button class="btn" type="button" data-feature="new-search" data-fx="newSearch"></button></div></form></details>
 <details class="panel"><summary><h2 data-fx="collections"></h2></summary><p class="hint" data-fx="device"></p><button class="btn" type="button" data-feature="saved" data-fx="saved"></button><div id="collectionList"></div></details>`;
document.querySelector('nav.tabs').after(discovery);
const featureView=document.createElement('section');featureView.id='featureView';featureView.hidden=true;
featureView.innerHTML='<div class="results-head"><h2 id="featureTitle" tabindex="-1"></h2><div class="search-actions"><button class="btn primary" type="button" data-feature="edit-search" data-fx="editSearch"></button><button class="btn" type="button" data-feature="new-search" data-fx="newSearch"></button><button class="btn" type="button" data-feature="back" data-fx="back"></button></div></div><p class="hint" id="featureNote"></p><div class="collection-toolbar" id="featureToolbar"></div><div class="list" id="featureList"></div>';
$('#view-list').before(featureView);
const toolbar=document.createElement('div');toolbar.id='resultsToolbar';toolbar.className='collection-toolbar';$('#resultCount').parentElement.after(toolbar);
const editDialog=document.createElement('dialog');editDialog.className='feature-dialog';editDialog.setAttribute('aria-labelledby','collectionHeading');
editDialog.innerHTML='<form id="collectionForm"><h2 id="collectionHeading" data-fx="saveResults"></h2><label class="f"><span data-fx="collectionTitle"></span><input id="collectionName" type="text" maxlength="100" required></label><fieldset><legend data-fx="choose"></legend><div id="collectionChoices"></div></fieldset><p class="hint" id="collectionStatus" role="status"></p><div class="actions"><button class="btn primary" type="submit" data-fx="save"></button><button class="btn" type="button" data-feature="close-edit" data-fx="cancel"></button></div></form>';
document.body.append(editDialog);
const shareDialog=document.createElement('dialog');shareDialog.className='feature-dialog';shareDialog.setAttribute('aria-labelledby','shareHeading');
shareDialog.innerHTML='<h2 id="shareHeading" data-fx="shareTitle"></h2><p class="hint" data-fx="shareNote"></p><label class="f"><span data-fx="link"></span><textarea id="shareLink" readonly></textarea></label><div class="actions"><button class="btn" data-feature="copy-share" data-fx="copy"></button><button class="btn" id="nativeShare" data-feature="native-share" data-fx="native"></button><button class="btn" data-feature="download-share" data-fx="download"></button></div><div class="actions" id="socialLinks"></div><div class="actions"><button class="btn" data-feature="image-share" data-fx="ig"></button><button class="btn" data-feature="caption-share" data-fx="caption"></button></div><form id="shareEmailForm"><label class="f"><span data-fx="recipient"></span><input type="email" id="shareRecipient" maxlength="254"></label><p class="hint" data-fx="emailNote"></p><button class="btn primary" type="submit" data-fx="email"></button></form><p class="hint" id="shareStatus" role="status"></p><button class="btn" data-feature="close-share" data-fx="close"></button>';
document.body.append(shareDialog);
let editing=null,sharing=null;
function listingLink(o){const u=new URL(location.href);u.search='';u.hash='opportunity='+encodeURIComponent(o.id);return u.href;}
function collectionLink(c){const u=new URL(location.href);u.search='';u.hash='collection='+encodeURIComponent(JSON.stringify(OpportunityTools.collection(c)));return u.href;}
function currentItems(){return feature.mode?feature.ids.map(id=>published().find(o=>o.id===id)).filter(Boolean):(st.currentResults||[]);}
function currentTitle(){return feature.mode?feature.title:F('shared');}
function toolButtons(){return ['saveResults','email','share'].map(k=>'<button type="button" class="btn'+(k==='saveResults'?' primary':'')+'" data-feature="'+k+'">'+esc(F(k))+'</button>').join('');}
function translateFeatures(){
 document.querySelectorAll('[data-fx]').forEach(e=>e.textContent=F(e.dataset.fx));
 $('#matchIntro').placeholder=F('example');
 const options=(sel,values)=>{const old=sel.value;sel.innerHTML='<option value="">'+esc(F('any'))+'</option>'+values.map(([v,l])=>'<option value="'+esc(v)+'">'+esc(l)+'</option>').join('');sel.value=old;};
 options($('#matchLevel'),['undergrad','grad','postdoc','faculty'].map(k=>[k,k==='faculty'?T('tFaculty'):T(k)]));
 options($('#matchCit'),[['us',T('usCit')],['pr',T('prCit')],['other',T('otherCit')]]);
 options($('#matchCampus'),CAMPUSES.map(c=>[c[0],c[0]]));
 options($('#matchType'),[...new Set(published().map(o=>o.type))].sort().map(t=>[t,t]));
 $('#matchVoice').textContent=F(feature.recognition?'stop':'voice');
 $('#nativeShare').hidden=!navigator.share;
}
function renderFeatures(){
 translateFeatures();
 if(feature.mode==='saved')feature.ids=[...st.saved];
 $('#matchForm button[type=submit]').disabled=!st.loaded;
 toolbar.innerHTML=toolButtons();toolbar.querySelectorAll('button').forEach(b=>b.disabled=!st.loaded||!st.currentResults?.length);
 $('#collectionList').innerHTML=feature.collections.length?feature.collections.map(c=>'<div class="collection-row"><button class="linkbtn" type="button" data-feature="open-collection" data-key="'+esc(c.localId)+'">'+esc(c.title)+' ('+c.ids.length+')</button><button class="btn small" type="button" data-feature="delete-collection" data-key="'+esc(c.localId)+'">'+esc(F('delete'))+'</button></div>').join(''):'<p class="hint">'+esc(F('savedEmpty'))+'</p>';
 featureView.hidden=!feature.mode;
 if(!feature.mode)return;
 $('#view-list').hidden=true;$('#soonRail').hidden=true;
 $('#featureTitle').textContent=feature.title;
 featureView.querySelector('[data-feature="edit-search"]').hidden=feature.mode!=='matches';
 $('#featureToolbar').innerHTML=toolButtons()+(feature.localId?'<button class="btn" type="button" data-feature="edit-collection">'+esc(F('edit'))+'</button>':'');
 const items=currentItems();
 $('#featureNote').textContent=feature.mode==='matches'?F('check')+' '+F('timing'):(items.length<feature.ids.length?F('unavailable'):F('collectionNote'));
 $('#featureList').innerHTML=st.loaded?(items.length?items.map(card).join(''):'<p class="empty">'+esc(F('empty'))+'</p>'):'<p class="empty">'+esc(T('loading'))+'</p>';
 $('#featureToolbar').querySelectorAll('button').forEach(b=>b.disabled=!st.loaded||!items.length);
 if(feature.needsScroll&&st.loaded){feature.needsScroll=false;requestAnimationFrame(()=>{featureView.scrollIntoView({block:'start',behavior:'instant'});$('#featureTitle').focus({preventScroll:true});});}
}
function showItems(ids,title,mode='collection',localId=null){feature.ids=[...new Set(ids)];feature.title=title;feature.mode=mode;feature.localId=localId;feature.needsScroll=true;st.tab='students';render();}
function clearFeature(){feature.mode=null;feature.matches.clear();feature.localId=null;if(location.hash.startsWith('#collection=')||location.hash.startsWith('#opportunity='))history.replaceState(null,'',location.pathname+location.search);}
function openSearch(reset=false){
 if(reset){
  feature.request?.abort();feature.request=null;feature.busy=false;$('#matchInterpret').disabled=false;
  if(feature.recognition){const r=feature.recognition;feature.recognition=null;r.onresult=r.onerror=r.onend=null;r.abort?r.abort():r.stop();}
  $('#matchIntro').value='';$('#matchConsent').checked=false;$('#matchStatus').textContent='';
  fillCriteria({funded:true});feature.criteria=null;
 }
 clearFeature();st.tab='students';render();$('#matchPanel').open=true;
 $('#matchPanel').scrollIntoView({block:'start',behavior:'instant'});$('#matchIntro').focus({preventScroll:true});
}
function writeCollections(next){try{localStorage.setItem('dow.collections.v1',JSON.stringify(next));feature.collections=next;return true;}catch(_){return false;}}
function editCollection(existing){
 const items=currentItems();if(!items.length)return toast(F('noItems'));
 if(items.length>200)return toast(F('badLink'));
 editing=existing||null;$('#collectionName').value=existing?.title||currentTitle();
 $('#collectionChoices').innerHTML=items.map(o=>'<label class="check"><input type="checkbox" name="opportunity" value="'+esc(o.id)+'" checked><span>'+esc(o.title)+'</span></label>').join('');
 $('#collectionStatus').textContent='';editDialog.showModal();
}
function beginShare(items,title,single=false){
 if(!items.length)return toast(F('noItems'));
 try{sharing={...OpportunityTools.collection({v:1,title,ids:items.map(o=>o.id)}),items};sharing.url=single?listingLink(items[0]):collectionLink(sharing);}catch(_){return toast(F('badLink'));}
 $('#shareLink').value=sharing.url;$('#shareRecipient').value='';$('#shareStatus').textContent='';
 const u=encodeURIComponent(sharing.url),t=encodeURIComponent(sharing.title);
 $('#socialLinks').innerHTML=[['LinkedIn','https://www.linkedin.com/sharing/share-offsite/?url='+u],['X','https://twitter.com/intent/tweet?text='+t+'&url='+u],['Facebook','https://www.facebook.com/sharer/sharer.php?u='+u],['Bluesky','https://bsky.app/intent/compose?text='+encodeURIComponent(sharing.title+' '+sharing.url)]].map(([name,url])=>'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+name+'</a>').join('');
 shareDialog.showModal();
}
async function copyShare(value){$('#shareLink').value=value;try{await navigator.clipboard.writeText(value);$('#shareStatus').textContent=F('copied');}catch(_){$('#shareLink').focus();$('#shareLink').select();$('#shareStatus').textContent=F('copyFailed');}}
function shareBody(){return sharing.title+'\n\n'+sharing.items.slice(0,5).map(o=>o.title+(o.deadline?' — '+fmt(o.deadline):'')).join('\n')+(sharing.items.length>5?'\n…':'')+'\n\n'+sharing.url;}
async function collectionImage(){
 const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
 x.fillStyle='#FFF6E3';x.fillRect(0,0,1080,1350);x.fillStyle='#0D6E5A';x.fillRect(0,0,1080,28);
 function wrap(s,y,size,maxLines){x.font='bold '+size+'px sans-serif';let line='',n=0;for(const word of s.split(/\s+/)){if(x.measureText(line+' '+word).width>920&&line){x.fillText(line,80,y,920);y+=size*1.3;line='';if(++n>=maxLines-1){line='…';break;}}line+=(line?' ':'')+word;}x.fillText(line,80,y,920);return y+size*1.5;}
 x.fillStyle='#14231E';let y=wrap(sharing.title,125,58,3)+40;
 sharing.items.slice(0,5).forEach((o,i)=>{y=wrap((i+1)+'. '+o.title,y,34,2)+18;});
 x.fillStyle='#4F6059';x.font='30px sans-serif';x.fillText(sharing.items.length+' '+F('selected'),80,1160);x.fillText('DoW Opportunity Finder',80,1220);x.font='24px sans-serif';x.fillText('xuwenwu.github.io/dow-opportunity-finder/',80,1270);
 const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(blob)await saveFile('opportunities-instagram.png',blob);
 $('#shareStatus').textContent=F('caption')+': '+F('shareNote');
}
$('#collectionForm').addEventListener('submit',e=>{
 e.preventDefault();const ids=[...editDialog.querySelectorAll('input[name=opportunity]:checked')].map(n=>n.value);
 if(!ids.length){$('#collectionStatus').textContent=F('noItems');return;}
 if(!editing&&feature.collections.length>=100){$('#collectionStatus').textContent=F('storageError');return;}
 const c={...OpportunityTools.collection({v:1,title:$('#collectionName').value,ids}),localId:editing?.localId||crypto.randomUUID()};
 if(!writeCollections([...feature.collections.filter(x=>x.localId!==c.localId),c])){$('#collectionStatus').textContent=F('storageError');return;}
 editDialog.close();showItems(c.ids,c.title,'collection',c.localId);toast(F('savedOK'));
});
$('#shareEmailForm').addEventListener('submit',e=>{e.preventDefault();const recipient=$('#shareRecipient').value.trim();if(/[\r\n]/.test(recipient))return;let body=shareBody();if(body.length>1400)body=sharing.title+'\n\n'+sharing.url;const a=document.createElement('a');a.href='mailto:'+encodeURIComponent(recipient)+'?subject='+encodeURIComponent(sharing.title)+'&body='+encodeURIComponent(body);a.click();});
function readCriteria(){return OpportunityTools.criteria({level:$('#matchLevel').value,cit:$('#matchCit').value,campus:$('#matchCampus').value,type:$('#matchType').value,interests:$('#matchInterests').value,location:$('#matchLocation').value,funded:$('#matchFunded').checked});}
function fillCriteria(c){for(const [key,id] of Object.entries({level:'matchLevel',cit:'matchCit',campus:'matchCampus',type:'matchType',interests:'matchInterests',location:'matchLocation'}))$('#'+id).value=c[key]||'';$('#matchFunded').checked=c.funded===true;}
$('#matchForm').addEventListener('submit',e=>{e.preventDefault();feature.criteria=readCriteria();const results=OpportunityTools.rank(st.opps,feature.criteria,iso(today));feature.matches=new Map(results.map(m=>[m.id,m]));showItems(results.map(m=>m.id),F('matchTitle'),'matches');});
$('#matchInterpret').addEventListener('click',async()=>{
 if(!feature.endpoint||feature.busy)return;
 if(!$('#matchConsent').checked){$('#matchStatus').textContent=F('consent');return;}
 const intro=$('#matchIntro').value.trim();if(!intro){$('#matchIntro').focus();return;}
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);feature.request=controller;
 feature.busy=true;$('#matchInterpret').disabled=true;$('#matchStatus').textContent=F('working');
 try{const r=await fetch(feature.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({introduction:intro,language:st.lang}),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('Unavailable');const response=await r.json();if(feature.request!==controller)return;if(!response.criteria||typeof response.criteria!=='object')throw Error('Invalid response');fillCriteria(OpportunityTools.criteria(response.criteria));$('#matchStatus').textContent=F('ready');}
 catch(_){if(feature.request===controller)$('#matchStatus').textContent=F('aiError');}
 finally{clearTimeout(timeout);if(feature.request===controller){feature.request=null;feature.busy=false;$('#matchInterpret').disabled=false;}}
});
$('#matchVoice').addEventListener('click',()=>{
 if(feature.recognition){feature.recognition.stop();return;}
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){$('#matchStatus').textContent=F('notSupported');return;}
 const r=new Speech();r.lang=st.lang==='es'?'es-US':'en-US';r.interimResults=false;r.continuous=true;
 const before=$('#matchIntro').value;let spoken='';r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)spoken+=' '+e.results[i][0].transcript;$('#matchIntro').value=(before+' '+spoken).trim().slice(0,2000);};
 r.onerror=()=>{$('#matchStatus').textContent=F('voiceError');};r.onend=()=>{feature.recognition=null;$('#matchVoice').textContent=F('voice');if($('#matchStatus').textContent===F('recording'))$('#matchStatus').textContent=F('voiceDone');};
 try{r.start();feature.recognition=r;$('#matchVoice').textContent=F('stop');$('#matchStatus').textContent=F('recording');}catch(_){$('#matchStatus').textContent=F('voiceError');}
});
document.addEventListener('click',e=>{if(e.target.closest('[data-door]'))clearFeature();},true);
document.querySelector('.hsearch').addEventListener('submit',clearFeature,true);
document.querySelector('nav.tabs').addEventListener('click',e=>{if(e.target.closest('[data-tab]'))clearFeature();},true);
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-feature]');if(!b)return;const action=b.dataset.feature;
 if(action==='back'){clearFeature();render();}
 if(action==='new-search')openSearch(true);
 if(action==='edit-search')openSearch();
 if(action==='saved')showItems([...st.saved],F('saved'),'saved');
 if(action==='saveResults')editCollection();
 if(action==='edit-collection')editCollection(feature.collections.find(c=>c.localId===feature.localId));
 if(action==='open-collection'){const c=feature.collections.find(c=>c.localId===b.dataset.key);if(c)showItems(c.ids,c.title,'collection',c.localId);}
 if(action==='delete-collection'&&confirm(F('deleteAsk'))){if(!writeCollections(feature.collections.filter(c=>c.localId!==b.dataset.key)))return toast(F('storageError'));if(feature.localId===b.dataset.key)clearFeature();render();}
 if(action==='share'||action==='email'){beginShare(currentItems(),currentTitle());if(action==='email')$('#shareRecipient').focus();}
 if(action==='item-share'||action==='item-email'){const o=published().find(o=>o.id===b.dataset.id);if(o)beginShare([o],o.title,true);if(action==='item-email')$('#shareRecipient').focus();}
 if(action==='close-edit')editDialog.close();if(action==='close-share')shareDialog.close();
 if(action==='copy-share')await copyShare(sharing.url);
 if(action==='caption-share')await copyShare(shareBody());
 if(action==='image-share')await collectionImage();
 if(action==='download-share')await saveFile('opportunities.txt',sharing.title+'\n\n'+sharing.items.map(o=>[o.title,o.fundingNote,o.deadline?fmt(o.deadline):o.deadlineNote,o.url].filter(Boolean).join('\n')).join('\n\n')+'\n\n'+sharing.url);
 if(action==='native-share'&&navigator.share){try{await navigator.share({title:sharing.title,text:sharing.title,url:sharing.url});}catch(err){if(err.name!=='AbortError')$('#shareStatus').textContent=F('copyFailed');}}
});
function readSharedLink(){
 if(!/^#(collection|opportunity)=/.test(location.hash))return;
 try{
 if(location.hash.length>30000)throw Error('Too large');
 if(location.hash.startsWith('#collection=')){const c=OpportunityTools.collection(JSON.parse(decodeURIComponent(location.hash.slice(12))));showItems(c.ids,c.title);}
 else{const id=decodeURIComponent(location.hash.slice(13));const c=OpportunityTools.collection({v:1,title:F('shared'),ids:[id]});showItems(c.ids,c.title);}
 }catch(_){toast(F('badLink'));}
}
window.addEventListener('hashchange',()=>{feature.mode=null;feature.matches.clear();feature.localId=null;readSharedLink();render();});
// Only a maintainer-controlled HTTPS endpoint is accepted; never a URL query parameter.
fetch('data/features.json').then(r=>r.ok?r.json():{}).then(c=>{if(typeof c.matchEndpoint==='string'&&/^https:\/\//.test(c.matchEndpoint)){feature.endpoint=c.matchEndpoint;$('#matchOffline').hidden=true;$('#matchConsentRow').hidden=false;$('#matchInterpret').hidden=false;}}).catch(()=>{});
queueMicrotask(readSharedLink);

function matchReason(o){
 if(feature.mode!=='matches')return '';
 const m=feature.matches.get(o.id);if(!m)return '';
 const notes=[];
 if(m.hits.length)notes.push(F('interest')+': '+m.hits.join(', '));
 else if(feature.criteria?.interests)notes.push(F('noTopic'));
 if(m.near)notes.push(F('near'));
 if(m.unknownCit)notes.push(F('unknownCit'));
 if(m.unknownLevel)notes.push(F('unknownLevel'));
 if(m.unknownDate)notes.push(F('unknownDate'));
 return notes.length?'<div class="match-reason">'+notes.map(n=>'<span>'+esc(n)+'</span>').join('')+'</div>':'';
}
