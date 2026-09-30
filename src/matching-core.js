/* AI interprets preferences; this deterministic matcher uses only published records. */
(function(root){
  const text=(v,n=200)=>typeof v==='string'?v.trim().slice(0,n):'';
  const choice=(v,a)=>a.includes(v)?v:'';
  function criteria(c={}){
    return {level:choice(c.level,['undergrad','grad','postdoc','faculty']),cit:choice(c.cit,['us','pr','other']),
      campus:text(c.campus),type:text(c.type,80),interests:text(c.interests,300),location:text(c.location,120),funded:c.funded===true};
  }
  function rank(records,input,day){
    const c=criteria(input),terms=c.interests.toLowerCase().split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean);
    return records.filter(o=>o.status==='published').flatMap(o=>{
      if(o.deadline&&o.deadline<day)return [];
      if(c.level==='faculty'&&o.audience!=='faculty')return [];
      if(c.level&&c.level!=='faculty'&&(o.audience!=='student'||(o.levels?.length&&!o.levels.includes(c.level))))return [];
      if(c.cit==='pr'&&o.cit==='us'||c.cit==='other'&&['us','us_pr'].includes(o.cit))return [];
      if(c.campus&&o.campuses?.length&&!o.campuses.includes(c.campus))return [];
      if(c.type&&o.type!==c.type)return [];
      if(c.funded&&!['full','stipend','travel','grant'].includes(o.funding))return [];
      const hay=[o.title,o.summary,o.summary_es,o.eligibility,...(o.disciplines||[]),...(o.topics||[])].join(' ').toLowerCase();
      const hits=terms.filter(t=>hay.includes(t));
      const near=!!c.location&&[o.location,...(o.sites||[]).map(s=>s.name)].join(' ').toLowerCase().includes(c.location.toLowerCase());
      return [{id:o.id,score:hits.length*10+(near?5:0),hits,near,
        unknownCit:!c.cit||!['us','us_pr','open'].includes(o.cit),
        unknownLevel:!!c.level&&c.level!=='faculty'&&!o.levels?.length,unknownDate:!o.deadline}];
    }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  }
  function collection(v){
    if(!v||v.v!==1||!Array.isArray(v.ids)||v.ids.length>200)throw Error('Invalid collection');
    if(v.ids.some(id=>typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(id)))throw Error('Invalid opportunity ID');
    const ids=[...new Set(v.ids)];if(!ids.length)throw Error('Empty collection');
    return {v:1,title:text(v.title,100)||'Opportunities',ids};
  }
  const api={criteria,rank,collection};root.OpportunityTools=api;
  if(typeof module!=='undefined')module.exports=api;
})(globalThis);
