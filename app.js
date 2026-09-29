(function(){
"use strict";
var APP_SRC = '';
var CSS_SRC = '';
var DATA = JSON.parse(document.getElementById('data').textContent);
var editing = false, dirty = false, firstRender = true, artNs = null, rotTimer = null, filter = 'all';
var root = document.getElementById('root');

var I = {
  linkedin:'<svg class="pi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.8-2.05 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21h-4V9Z"/></svg>',
  instagram:'<svg class="pi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  facebook:'<svg class="pi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.3 4.3c-2.3 0-3.8 1.4-3.8 3.96v2.24H8v3h2.5V21h3Z"/></svg>',
  youtube:'<svg class="pi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>',
  tiktok:'<svg class="pi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.1 1.6 3.6 3.9 3.8v3.1a7 7 0 0 1-3.8-1.2v6.1a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.2a2.7 2.7 0 1 0 1.8 2.5V3h3Z"/></svg>',
  x:'<svg class="pi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
  other:'<svg class="pi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  mail:'<svg class="pi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  google:'<svg class="pi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.54 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12s4.15 9.25 9.25 9.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.07-1.07-.15-1.11Z"/></svg>',
  pin:'<svg class="pi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  play:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
};
var PNAME = {linkedin:'LinkedIn',instagram:'Instagram',facebook:'Facebook',tiktok:'TikTok',youtube:'YouTube',x:'X',other:'the web'};
var PLATFORM_OPTS = [['linkedin','LinkedIn'],['instagram','Instagram'],['facebook','Facebook'],['tiktok','TikTok'],['youtube','YouTube'],['x','X (Twitter)'],['other','Other']];
var STYLE_OPTS = [['jade','Jade'],['ink','Deep green'],['marigold','Marigold'],['rilus','Law blue'],['rilus2','Law navy'],['review','Review card (blue)'],['maat','Slate and gold'],['barb','Black and gold'],['barbw','White and gold'],['halp','Charcoal'],['halpcap','Charcoal with caption box'],['yt','Video dark']];
var LISTS = {
  videos:{fields:['fmt','title','sub','url','thumb','style','video'], kind:'tile', platform:'youtube', add:'Add video'},
  blogs:{fields:['who','title','url','thumb'], kind:'blog', add:'Add article'},
  newsletters:{fields:['title','sub','url','thumb'], kind:'env', icon:'mail', add:'Add newsletter'},
  local:{fields:['title','sub','url','thumb'], kind:'env', icon:'pin', add:'Add profile'},
  quotes:{fields:['q','name','role','photo'], kind:'quote', add:'Add testimonial'},
  skills:{fields:['title','text'], kind:'skill', add:'Add skill'},
  proof:{fields:['title','text'], kind:'proof', add:'Add fact'},
  strip:{fields:['title','text'], kind:'strip', add:'Add client name'}
};
var FIELD = {
  fmt:{label:'Format label',type:'text',hint:'For example Carousel, Reel, Video, Static'},
  title:{label:'Title or headline',type:'text'},
  sub:{label:'Short line under the title',type:'text'},
  who:{label:'Client and industry',type:'text',hint:'For example Rilus Law · Estate law'},
  url:{label:'Link',type:'url',hint:'Paste the full link to the live post, article or email'},
  thumb:{label:'Thumbnail',type:'image',hint:'Upload a screenshot. Without one, a styled card is shown.'},
  photo:{label:'Photo (optional)',type:'image'},
  style:{label:'Card style when there is no thumbnail',type:'select',opts:STYLE_OPTS,blank:'Use the client’s style'},
  video:{label:'Show a play button',type:'check'},
  q:{label:'What they said',type:'textarea'},
  name:{label:'Name',type:'text'},
  role:{label:'Title and company',type:'text'},
  text:{label:'Description',type:'textarea'}
};

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function safeUrl(u){u=String(u||'').trim(); return /^(https?:|mailto:|tel:)/i.test(u)?u:'#';}
function uid(){return Math.random().toString(36).slice(2,9);}
function imgSrc(s){s=String(s||''); return /^(data:image\/|\/_blob\/|https?:|images\/)/.test(s)?s:'';}
function list(k){return DATA.lists[k];}
function mailBtn(cls,label){ var e=DATA.profile.email||''; return '<a class="'+cls+'" href="mailto:'+esc(e)+'" data-act="email">'+esc(label)+'</a>'; }

/* ---------- render pieces ---------- */
function tools(act, id, opts){
  opts=opts||{};
  var h='<div class="tools'+(opts.inline?' inline':'')+'">';
  if(opts.move==='h') h+='<button type="button" data-act="'+act+'-move" data-id="'+id+'" data-dir="-1" aria-label="Move earlier">'+I.left+'</button><button type="button" data-act="'+act+'-move" data-id="'+id+'" data-dir="1" aria-label="Move later">'+I.right+'</button>';
  if(opts.move==='v') h+='<button type="button" data-act="'+act+'-move" data-id="'+id+'" data-dir="-1" aria-label="Move up">'+I.up+'</button><button type="button" data-act="'+act+'-move" data-id="'+id+'" data-dir="1" aria-label="Move down">'+I.down+'</button>';
  h+='<button type="button" '+(opts.wide?'class="wide" ':'')+'data-act="'+act+'-edit" data-id="'+id+'" aria-label="Edit">'+I.edit+(opts.wide?'Edit':'')+'</button>';
  return h+'</div>';
}

function tile(p, platform, styleFallback, logo){
  var style = p.style || styleFallback || 'jade';
  var label = (p.title||p.fmt||'Post')+' on '+PNAME[platform||'other']+' (opens in a new tab)';
  var inner, src = imgSrc(p.thumb);
  if(src){ inner='<img src="'+esc(src)+'" alt="" loading="lazy">'; }
  else {
    inner='<div class="mock s-'+esc(style)+'">'+(p.video?'<div class="play">'+I.play+'</div>':'')+
      (style==='review'?'<div class="stars" aria-hidden="true">★★★★★</div>':'')+
      (p.title?'<div class="hl">'+esc(p.title)+'</div>':'')+(p.sub?'<div class="sub">'+esc(p.sub)+'</div>':'')+
      (logo?'<div class="logo">'+esc(logo)+'</div>':'')+'</div>';
  }
  return '<a class="tile" href="'+esc(safeUrl(p.url))+'" target="_blank" rel="noopener" aria-label="'+esc(label)+'">'+
    (p.fmt?'<span class="fmt">'+esc(p.fmt)+'</span>':'')+inner+
    '<span class="pbadge" aria-hidden="true">'+(I[platform]||I.other)+'</span><span class="open">Open on '+esc(PNAME[platform||'other'])+' '+(I[platform]||I.other)+'</span></a>';
}

function allSocialTiles(){
  var groups=DATA.clients.map(function(c){ return c.posts.map(function(p){ return tile(p,c.platform,c.style,c.name); }); });
  groups.push(list('videos').items.map(function(p){ return tile(p,'youtube','yt','YouTube Shorts'); }));
  var out=[], more=true, k=0;
  while(more){ more=false; groups.forEach(function(g){ if(k<g.length){ out.push(g[k]); more=true; } }); k++; }
  return out;
}

function nav(){
  var links=[['work','Social'],['blogs','Writing'],['newsletters','Email'],['quotes','Clients']]
    .filter(function(l){return l[0]==='work'?DATA.clients.length:list(l[0]).items.length;});
  return '<nav class="nav" aria-label="Main"><div class="wrap"><a class="brand" href="#top">'+esc(DATA.profile.name)+'</a><ul>'+
    links.map(function(l){return '<li><a href="#'+l[0]+'">'+l[1]+'</a></li>';}).join('')+
    '</ul>'+mailBtn('btn solid','Hire me')+'</div></nav>';
}

function hero(){
  var P=DATA.profile, words=String(P.name||'').split(/\s+/).filter(Boolean);
  var rot=(P.rotating&&P.rotating.length)?P.rotating:[''];
  var tiles=allSocialTiles();
  var track=tiles.concat(tiles).join('');
  return '<header class="hero" id="top"><div class="wrap">'+tools('profile','p',{inline:true,wide:true})+
    '<h1>'+words.map(function(w){return '<span class="w"><span>'+esc(w)+'</span></span>';}).join(' ')+'</h1>'+
    '<div class="row"><p class="lede">'+esc(P.lede)+' <span class="rot" aria-live="off"><span>'+esc(rot[0])+'</span></span></p>'+
    '<div><p class="facts">'+esc(P.facts)+'</p><div class="ctas"><a class="btn solid" href="#about">About me</a>'+mailBtn('btn ghost','Email me')+'</div></div></div></div>'+
    (tiles.length?'<div class="ribbon" aria-label="A moving reel of recent posts"><div class="track" style="--dur:'+Math.max(40,tiles.length*4)+'s">'+track+'</div></div>':'')+
    '</header>';
}

function countPlatforms(){
  var seen={}; DATA.clients.forEach(function(c){ if(c.posts.length) seen[c.platform]=1; });
  return Object.keys(seen).map(function(k){return PNAME[k];});
}
function joinAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}

function paras(t){ return String(t||'').split(/\n\s*\n|\n/).map(function(s){return s.trim();}).filter(Boolean).map(function(s){return '<p>'+esc(s)+'</p>';}).join(''); }
function shows(){
  var S=DATA.about, posts=0; DATA.clients.forEach(function(c){posts+=c.posts.length;});
  var rows=[
    ['work',posts,'Social posts','Across '+joinAnd(countPlatforms().concat(list('local').items.length?['Google Business Profile']:[]))],
    ['videos',list('videos').items.length,list('videos').title,'Shorts with strong hooks and captions'],
    ['blogs',list('blogs').items.length,'Blog articles','SEO articles written for client websites'],
    ['newsletters',list('newsletters').items.length,'Email newsletters','Mailchimp campaigns, written and designed'],
    ['local',list('local').items.length,list('local').title,'Local search visibility for clients'],
    ['quotes',list('quotes').items.length,'Client words','What people say about working together']
  ].filter(function(r){return r[1]>0;});
  var caps=list('skills');
  return '<section class="about" id="about"><div class="wrap">'+tools('about','a',{inline:true,wide:true})+
    '<div class="grid2"><div><h2>'+esc(S.title)+'</h2><div class="story">'+paras(S.text)+'</div></div>'+
    '<aside class="proof" aria-label="At a glance">'+tools('sec','proof',{inline:true,wide:true})+'<h3>'+esc(list('proof').title)+'</h3>'+listBody('proof','pfl')+'</aside></div>'+
    '<div class="caps"><div class="caphead">'+tools('sec','skills',{inline:true,wide:true})+'<h3>'+esc(caps.title)+'</h3>'+(caps.desc?'<p>'+esc(caps.desc)+'</p>':'')+'</div>'+listBody('skills','skills')+'</div>'+
    '<div class="inds"><h3>'+esc(S.indTitle)+'</h3><ul>'+(S.industries||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'+
    '<div class="lead" id="shows"><h2>'+esc(S.lead)+'</h2>'+(S.leadSub?'<p>'+esc(S.leadSub)+'</p>':'')+'</div>'+
    '<ul class="showlist">'+rows.map(function(r){return '<li><a href="#'+r[0]+'"><span><b>'+esc(r[2])+'</b><span class="d">'+esc(r[3])+'</span></span><span class="ar" aria-hidden="true">↓</span></a></li>';}).join('')+'</ul>'+
    '</div></section>'+
    ((list('strip').items.length||editing)?'<div class="clients" aria-label="Clients I have worked with">'+listBody('strip','wrap strip')+'</div>':'');
}
function work(){
  var counts={all:0}, order=[];
  DATA.clients.forEach(function(c){ if(!(c.platform in counts)){counts[c.platform]=0;order.push(c.platform);} counts[c.platform]+=c.posts.length; counts.all+=c.posts.length; });
  if(filter!=='all' && filter!=='gbp' && !(filter in counts)) filter='all';
  var fb='<button type="button" data-act="filter" data-f="all" aria-pressed="'+(filter==='all')+'">All<span class="n">'+counts.all+'</span></button>'+
    order.map(function(k){return '<button type="button" data-act="filter" data-f="'+k+'" aria-pressed="'+(filter===k)+'">'+(I[k]||'')+esc(PNAME[k]==='the web'?'Other':PNAME[k])+'<span class="n">'+counts[k]+'</span></button>';}).join('')+
    (list('local').items.length?'<button type="button" data-act="filter" data-f="gbp" aria-pressed="'+(filter==='gbp')+'">'+I.google+'Google Business Profile<span class="n">'+list('local').items.length+'</span></button>':'')+
    ['videos','blogs','newsletters'].filter(function(k){return list(k).items.length;}).map(function(k){
      var ic={videos:I.youtube,blogs:'',newsletters:I.mail}[k], nm={videos:'YouTube',blogs:'Blogs',newsletters:'Newsletters'}[k];
      return '<button type="button" data-act="jump" data-to="'+k+'">'+ic+nm+'<span class="n">'+list(k).items.length+'</span></button>';}).join('');
  var W=DATA.work;
  return '<section class="block" id="work"><div class="wrap"><div class="head"><div>'+tools('sec','work',{inline:true,wide:true})+'<h2>'+esc(W.title)+'</h2></div><p>'+esc(W.desc)+'</p></div>'+
    '<div class="filters" role="group" aria-label="Filter by platform">'+fb+'</div>'+
    DATA.clients.map(function(c){
      return '<article class="client" data-pf="'+esc(c.platform)+'"'+(filter!=='all'&&c.platform!==filter?' hidden':'')+'><div>'+
        tools('client',c.id,{inline:true,move:'v',wide:true})+
        '<h3>'+esc(c.name)+'</h3><div class="meta"><span class="tag pf">'+esc(PNAME[c.platform]==='the web'?'Other':PNAME[c.platform])+'</span>'+c.tags.map(function(t){return '<span class="tag">'+esc(t)+'</span>';}).join('')+'</div>'+
        '<p class="note">'+esc(c.note)+'</p></div>'+((c.did&&c.did.length)?'<div class="didw"><h4 class="didh">What I did</h4><ul class="did">'+c.did.map(function(d){return '<li>'+esc(d)+'</li>';}).join('')+'</ul></div>':'<div></div>')+'<div class="grid">'+
        c.posts.map(function(p){return '<div class="item">'+tile(p,c.platform,c.style,c.name)+tools('post',c.id+':'+p.id,{move:'h'})+'</div>';}).join('')+
        '<button type="button" class="add" data-act="post-add" data-id="'+c.id+'">'+I.plus+'Add post</button></div></article>';
    }).join('')+
    '<button type="button" class="add" style="width:100%;margin-top:24px" data-act="client-add">'+I.plus+'Add client</button>'+
    ((list('local').items.length||editing)?'<div class="client gbp" id="local" data-pf="gbp"'+(filter!=='all'&&filter!=='gbp'?' hidden':'')+'><div>'+tools('sec','local',{inline:true,wide:true})+'<h3>'+esc(list('local').title)+'</h3><div class="meta"><span class="tag pf">Google Business Profile</span><span class="tag">Local search</span></div><p class="note">'+esc(list('local').desc)+'</p></div>'+listBody('local','stack')+'</div>':'')+
    '</div></section>';
}

function listItem(k, it){
  var L=LISTS[k];
  if(L.kind==='tile') return tile(it,L.platform,'yt','YouTube Shorts');
  if(L.kind==='blog'){ var s=imgSrc(it.thumb); return '<a class="wcard" href="'+esc(safeUrl(it.url))+'" target="_blank" rel="noopener">'+(s?'<div class="thumb"><img src="'+esc(s)+'" alt="" loading="lazy"></div>':'')+'<span class="who">'+esc(it.who)+'</span><h4>'+esc(it.title)+'</h4><span class="go"><span>Read the article</span><span aria-hidden="true">↗</span></span></a>'; }
  if(L.kind==='env'){ var s2=imgSrc(it.thumb); return '<a class="env" href="'+esc(safeUrl(it.url))+'" target="_blank" rel="noopener"><span class="ico">'+(s2?'<img src="'+esc(s2)+'" alt="">':I[L.icon])+'</span><span><b>'+esc(it.title)+'</b><span class="s">'+esc(it.sub)+'</span></span></a>'; }
  if(L.kind==='quote'){ var s3=imgSrc(it.photo); return '<figure class="quote"><blockquote>'+paras(it.q)+'</blockquote><figcaption>'+(s3?'<img src="'+esc(s3)+'" alt="">':'')+'<span><b>'+esc(it.name)+'</b>'+esc(it.role)+'</span></figcaption></figure>'; }
  if(L.kind==='strip') return '<span>'+esc(it.title)+(it.text?'<small>'+esc(it.text)+'</small>':'')+'</span>';
  if(L.kind==='proof') return '<div class="fact"><span class="pn">'+esc(it.title)+'</span><span>'+esc(it.text)+'</span></div>';
  if(L.kind==='skill') return '<div><h4>'+esc(it.title)+'</h4><p>'+esc(it.text)+'</p></div>';
}
function listBody(k, cls){
  var L=LISTS[k], items=list(k).items, move=(L.kind==='env'||L.kind==='proof')?'v':'h';
  if(L.kind==='strip') return '<div class="'+cls+'">'+items.map(function(it){return '<div class="item">'+listItem(k,it)+tools('item',k+':'+it.id,{move:'h'})+'</div>';}).join('')+'<button type="button" class="add" data-act="item-add" data-id="'+k+'">'+I.plus+esc(L.add)+'</button></div>';
  return '<div class="'+cls+'">'+items.map(function(it){return '<div class="item">'+listItem(k,it)+tools('item',k+':'+it.id,{move:move})+'</div>';}).join('')+
    '<button type="button" class="add" data-act="item-add" data-id="'+k+'">'+I.plus+esc(L.add)+'</button></div>';
}
function sectionHead(k){ var L=list(k); return '<div class="head"><div>'+tools('sec',k,{inline:true,wide:true})+'<h2>'+esc(L.title)+'</h2></div>'+(L.desc?'<p>'+esc(L.desc)+'</p>':'')+'</div>'; }
function block(k, cls){
  if(!list(k).items.length && !editing) return '';
  return '<section class="block" id="'+k+'"><div class="wrap">'+sectionHead(k)+listBody(k,cls)+'</div></section>';
}
function emailLocal(){
  var a=list('newsletters');
  if(!a.items.length && !editing) return '';
  function panel(k){ var L=list(k); if(!L.items.length && !editing) return ''; return '<div class="panel" id="'+k+'">'+tools('sec',k,{inline:true,wide:true})+'<h3>'+esc(L.title)+'</h3><p>'+esc(L.desc)+'</p>'+listBody(k,'stack')+'</div>'; }
  return '<section class="block" id="email"><div class="wrap">'+panel('newsletters')+'</div></section>';
}
function contact(){
  var C=DATA.contact, P=DATA.profile;
  return '<footer class="contact" id="contact"><div class="wrap">'+tools('contact','c',{inline:true,wide:true})+'<h2>'+esc(C.title)+'</h2><p>'+esc(C.text)+'</p><div class="ctas">'+
    (P.email?mailBtn('btn solid',P.email):'')+
    (P.email?'<a class="btn ghost" href="https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(P.email)+'" target="_blank" rel="noopener">Write in Gmail</a>':'')+
    (P.phone?'<a class="btn ghost" href="https://wa.me/'+esc(P.phone.replace(/[^0-9]/g,''))+'" target="_blank" rel="noopener">WhatsApp '+esc(P.phone)+'</a>':'')+
    (P.linkedin?'<a class="btn ghost" href="'+esc(safeUrl(P.linkedin))+'" target="_blank" rel="noopener">LinkedIn</a>':'')+
    '</div><div class="foot"><span>'+esc(C.footLeft)+'</span><span>'+esc(C.footRight)+'</span></div></div></footer>';
}

function render(){
  var y=window.scrollY;
  document.body.classList.toggle('editing',editing);
  document.body.classList.toggle('intro',firstRender);
  root.innerHTML = nav()+'<main>'+hero()+shows()+work()+block('videos','grid')+block('blogs','cards')+emailLocal()+block('quotes','quotes')+'</main>'+contact()+chrome();
  if(!firstRender) window.scrollTo(0,y);
  firstRender=false;
  startRotator();
}
function chrome(){
  if(!artNs) return '';
  if(!editing) return '<button type="button" class="btn solid edit-fab" data-act="edit-on">'+I.edit.replace('<svg','<svg width="16" height="16"')+'Edit portfolio</button>';
  return '<div class="editbar" role="region" aria-label="Editing"><div class="wrap"><span>'+(dirty?'You have unsaved changes.':'Editing. Use the pencil buttons to change anything, or the dashed boxes to add.')+'</span>'+
    '<span class="ctas"><button type="button" class="btn ghost small" data-act="edit-off">'+(dirty?'Discard':'Done')+'</button><button type="button" class="btn solid small" data-act="save"'+(dirty?'':' disabled')+'>Save and publish</button></span></div></div>';
}

function startRotator(){
  clearInterval(rotTimer);
  var r=DATA.profile.rotating||[]; if(r.length<2) return;
  var el=root.querySelector('.rot'); if(!el) return;
  var i=0, reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  rotTimer=setInterval(function(){
    i=(i+1)%r.length;
    if(reduce){ el.firstChild.textContent=r[i]; return; }
    el.className='rot out';
    setTimeout(function(){ el.firstChild.textContent=r[i]; el.className='rot in'; },330);
  },2600);
}

function openEmail(){
  var em=DATA.profile.email||''; if(!em) return;
  var copied=false;
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(em).then(function(){},function(){}); copied=true; } }catch(err){}
  window.location.href='mailto:'+em;
  toast((copied?'Email address copied: ':'Email: ')+em,5000);
}

/* ---------- editing ---------- */
function toast(msg,ms){
  var t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=msg; document.body.appendChild(t);
  setTimeout(function(){t.remove();},ms||3500);
}
function changed(){ dirty=true; render(); }
function move(arr, idx, dir){ var j=idx+dir; if(j<0||j>=arr.length) return; var t=arr[idx]; arr[idx]=arr[j]; arr[j]=t; changed(); }

function resizeImage(file){
  return new Promise(function(res,rej){
    var fr=new FileReader();
    fr.onerror=function(){rej(new Error('read'));};
    fr.onload=function(){
      var img=new Image();
      img.onerror=function(){rej(new Error('decode'));};
      img.onload=function(){
        var max=720, w=img.naturalWidth, h=img.naturalHeight, s=Math.min(1,max/w);
        var c=document.createElement('canvas'); c.width=Math.round(w*s); c.height=Math.round(h*s);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        var out=c.toDataURL('image/webp',0.74);
        if(out.indexOf('data:image/webp')!==0) out=c.toDataURL('image/jpeg',0.78);
        res(out);
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  });
}

var dlg=null;
function openForm(title, fields, obj, onSave, onDelete){
  if(dlg) dlg.remove();
  dlg=document.createElement('dialog');
  var temp={}; fields.forEach(function(f){temp[f.key]=obj[f.key];});
  var body=fields.map(function(f){
    var id='f_'+f.key, v=obj[f.key];
    if(f.type==='check') return '<label class="check"><input type="checkbox" id="'+id+'" data-k="'+f.key+'"'+(v?' checked':'')+'>'+esc(f.label)+'</label>';
    var ctl;
    if(f.type==='textarea') ctl='<textarea id="'+id+'" data-k="'+f.key+'">'+esc(v)+'</textarea>';
    else if(f.type==='linelist') ctl='<textarea id="'+id+'" data-k="'+f.key+'" style="min-height:150px">'+esc((v||[]).join('\n'))+'</textarea>';
    else if(f.type==='select') ctl='<select id="'+id+'" data-k="'+f.key+'">'+(f.blank!=null?'<option value="">'+esc(f.blank)+'</option>':'')+f.opts.map(function(o){return '<option value="'+o[0]+'"'+(v===o[0]?' selected':'')+'>'+esc(o[1])+'</option>';}).join('')+'</select>';
    else if(f.type==='image') ctl='<div class="imgfield" data-img="'+f.key+'"><div class="pv">'+(imgSrc(v)?'<img src="'+esc(imgSrc(v))+'" alt="">':'No image')+'</div><div class="btns"><label class="btn ghost small" for="'+id+'">Upload image</label><input class="sr" type="file" accept="image/*" id="'+id+'" data-file="'+f.key+'"><button type="button" class="btn ghost small" data-clear="'+f.key+'">Remove</button></div></div>';
    else ctl='<input type="'+(f.type==='url'?'url':'text')+'" id="'+id+'" data-k="'+f.key+'" value="'+esc(Array.isArray(v)?v.join(f.sep||', '):v)+'">';
    return '<div class="field"><label for="'+id+'">'+esc(f.label)+'</label>'+ctl+(f.hint?'<span class="hint">'+esc(f.hint)+'</span>':'')+'</div>';
  }).join('');
  dlg.innerHTML='<form method="dialog"><header><h3>'+esc(title)+'</h3></header><div class="body">'+body+'</div><footer>'+
    (onDelete?'<button type="button" class="btn ghost small danger" data-del>Delete</button>':'')+
    '<span class="r"><button type="button" class="btn ghost small" data-cancel>Cancel</button><button type="submit" class="btn solid small">Apply</button></span></footer></form>';
  document.body.appendChild(dlg);
  dlg.addEventListener('change',function(e){
    var k=e.target.getAttribute('data-file'); if(!k||!e.target.files[0]) return;
    var pv=dlg.querySelector('[data-img="'+k+'"] .pv'); pv.textContent='Processing…';
    resizeImage(e.target.files[0]).then(function(u){ temp[k]=u; pv.innerHTML='<img src="'+u+'" alt="">'; })
      .catch(function(){ pv.textContent='That file could not be read. Try a JPG or PNG.'; });
  });
  dlg.addEventListener('click',function(e){
    var c=e.target.closest('[data-clear]'); if(c){ temp[c.getAttribute('data-clear')]=''; dlg.querySelector('[data-img="'+c.getAttribute('data-clear')+'"] .pv').textContent='No image'; }
    if(e.target.closest('[data-cancel]')) dlg.close();
    var d=e.target.closest('[data-del]');
    if(d){ if(d.dataset.armed){ dlg.close(); onDelete(); } else { d.dataset.armed='1'; d.textContent='Click again to delete'; } }
  });
  dlg.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();
    fields.forEach(function(f){
      if(f.type==='image') return;
      var el=dlg.querySelector('[data-k="'+f.key+'"]'); if(!el) return;
      if(f.type==='check') temp[f.key]=el.checked;
      else if(f.type==='tags') temp[f.key]=el.value.split(f.sep||',').map(function(s){return s.trim();}).filter(Boolean);
      else if(f.type==='linelist') temp[f.key]=el.value.split('\n').map(function(s){return s.trim();}).filter(Boolean);
      else if(f.type==='lines') temp[f.key]=el.value.split('/').map(function(s){return s.trim();}).filter(Boolean);
      else temp[f.key]=el.value.trim();
    });
    Object.keys(temp).forEach(function(k){obj[k]=temp[k];});
    dlg.close(); onSave(obj);
  });
  dlg.addEventListener('close',function(){ setTimeout(function(){ if(dlg){dlg.remove();dlg=null;} },0); });
  dlg.showModal();
}
function specFor(keys){ return keys.map(function(k){ var f=FIELD[k]; var o={key:k}; for(var x in f) o[x]=f[x]; return o; }); }

var POST_FIELDS=['fmt','title','sub','url','thumb','style','video'];
function findClient(id){ for(var i=0;i<DATA.clients.length;i++) if(DATA.clients[i].id===id) return i; return -1; }

function act(e){
  var b=e.target.closest('[data-act]'); if(!b) return;
  var a=b.getAttribute('data-act'), id=b.getAttribute('data-id'), dir=+b.getAttribute('data-dir')||0;
  if(a==='email'){ e.preventDefault(); openEmail(); return; }
  if(a==='filter'){ filter=b.getAttribute('data-f'); root.querySelectorAll('.filters [data-f]').forEach(function(x){x.setAttribute('aria-pressed',x===b);}); root.querySelectorAll('.client').forEach(function(el){el.hidden=!(filter==='all'||el.getAttribute('data-pf')===filter);}); return; }
  if(a==='jump'){ var t=document.getElementById(b.getAttribute('data-to')); if(t) t.scrollIntoView(); return; }
  if(a==='edit-on'){ editing=true; render(); return; }
  if(a==='edit-off'){ if(dirty){ location.reload(); return; } editing=false; render(); return; }
  if(a==='save'){ save(b); return; }
  if(!editing) return;

  if(a==='profile-edit') return openForm('Introduction',[
    {key:'name',label:'Your name',type:'text'},
    {key:'lede',label:'Opening line',type:'text',hint:'The rotating words are added at the end of this line.'},
    {key:'rotating',label:'Rotating words',type:'lines',hint:'Separate each with a slash, for example estate law firms / real estate teams'},
    {key:'facts',label:'Supporting line',type:'textarea'},
    {key:'email',label:'Email',type:'text'},{key:'phone',label:'Phone',type:'text'},
    {key:'linkedin',label:'Your LinkedIn profile link (optional)',type:'url'}
  ].map(function(f){ if(f.key==='rotating'){ f.type='lines'; } return f; }), rotForm(DATA.profile), function(o){ o.rotating=o.rotating; changed(); });
  if(a==='about-edit') return openForm('About you',[
    {key:'title',label:'Heading',type:'text'},
    {key:'text',label:'Your story',type:'textarea',hint:'Start a new line for each new paragraph.'},
    {key:'indTitle',label:'Industries heading',type:'text'},
    {key:'industries',label:'Industries',type:'lines',hint:'Separate each with a slash'},
    {key:'lead',label:'Line before the work',type:'text'},
    {key:'leadSub',label:'Smaller line under it',type:'text'}],DATA.about,changed);
  if(a==='contact-edit') return openForm('Contact section',[{key:'title',label:'Heading',type:'text'},{key:'text',label:'Paragraph',type:'textarea'},{key:'footLeft',label:'Footer left',type:'text'},{key:'footRight',label:'Footer right',type:'text'}],DATA.contact,changed);
  if(a==='sec-edit'){ var tgt=id==='work'?DATA.work:list(id); return openForm('Section heading',[{key:'title',label:'Heading',type:'text'},{key:'desc',label:'Description',type:'textarea'}],tgt,changed); }

  if(a==='client-add'){ var nc={id:uid(),name:'',platform:'instagram',tags:[],note:'',did:[],style:'jade',posts:[]}; return openForm('New client',clientSpec(),nc,function(o){ if(!o.name) o.name='New client'; DATA.clients.push(o); changed(); }); }
  if(a==='client-edit'){ var ci=findClient(id); return openForm('Edit client',clientSpec(),DATA.clients[ci],changed,function(){ DATA.clients.splice(ci,1); changed(); }); }
  if(a==='client-move'){ return move(DATA.clients,findClient(id),dir); }

  if(a==='post-add'){ var c=DATA.clients[findClient(id)]; var np={id:uid(),fmt:'Post',title:'',sub:'',url:'',thumb:'',style:'',video:false}; return openForm('New post for '+c.name,specFor(POST_FIELDS),np,function(o){ c.posts.push(o); changed(); }); }
  if(a==='post-edit'||a==='post-move'){
    var pr=id.split(':'), c2=DATA.clients[findClient(pr[0])], pi=c2.posts.findIndex(function(p){return p.id===pr[1];});
    if(a==='post-move') return move(c2.posts,pi,dir);
    return openForm('Edit post',specFor(POST_FIELDS),c2.posts[pi],changed,function(){ c2.posts.splice(pi,1); changed(); });
  }
  if(a==='item-add'){ var ni={id:uid()}; return openForm(LISTS[id].add,specFor(LISTS[id].fields),ni,function(o){ list(id).items.push(o); changed(); }); }
  if(a==='item-edit'||a==='item-move'){
    var ir=id.split(':'), arr=list(ir[0]).items, ii=arr.findIndex(function(x){return x.id===ir[1];});
    if(a==='item-move') return move(arr,ii,dir);
    return openForm('Edit',specFor(LISTS[ir[0]].fields),arr[ii],changed,function(){ arr.splice(ii,1); changed(); });
  }
}
function rotForm(P){ var o=P; o.rotating=(P.rotating||[]); return o; }
function clientSpec(){ return [
  {key:'name',label:'Client name',type:'text'},
  {key:'platform',label:'Platform',type:'select',opts:PLATFORM_OPTS},
  {key:'tags',label:'Tags',type:'tags',hint:'Industry first, then location. Separate with commas.'},
  {key:'note',label:'One-line summary',type:'textarea'},
  {key:'did',label:'What you did for them',type:'linelist',hint:'One task per line'},
  {key:'style',label:'Card style for posts without thumbnails',type:'select',opts:STYLE_OPTS}
];}

/* the "lines" type shows joined by " / " */
var _openForm=openForm;
openForm=function(t,f,o,s,d){ f.forEach(function(x){ if(x.type==='lines') x.sep=' / '; }); return _openForm(t,f,o,s,d); };

function buildDoc(){
  var json=JSON.stringify(DATA).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+
    '<title>'+esc(DATA.profile.name)+' · Portfolio</title>\n'+
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+
    '<link href="https://fonts.googleapis.com/css2?family=Gloock&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">\n'+
    '<style id="css">'+CSS_SRC+'</style>\n</head>\n<body>\n<div id="root"></div>\n'+
    '<script type="application/json" id="data">'+json+'</scr'+'ipt>\n'+
    '<script id="app">'+APP_SRC+'</scr'+'ipt>\n</body>\n</html>\n';
}
function save(btn){
  if(!artNs){ toast('Saving isn’t available in this view.'); return; }
  var html=buildDoc();
  if(html.length>15.5e6){ toast('The page is too large to save. Remove a few thumbnails and try again.',6000); return; }
  btn.disabled=true; btn.textContent='Saving…';
  artNs.publish(html).then(function(){ dirty=false; toast('Published. The page will reload with your changes.'); })
  .catch(function(err){
    var code=err&&err.code;
    btn.disabled=false; btn.textContent='Save and publish';
    if(code==='conflict') toast('Someone saved a newer version. The page is reloading to it, so these edits weren’t kept.',6000);
    else if(code==='not_writer'||code==='not_granted'){ toast('This view is read-only, so changes can’t be saved.',6000); artNs=null; editing=false; render(); }
    else if(code==='rate_limited') toast('Saved too often in a short time. Wait a minute, then save again.',6000);
    else toast('The page couldn’t be saved ('+(code||'unknown error')+'). Try again.',6000);
  });
}

document.addEventListener('click',act);
window.addEventListener('beforeunload',function(e){ if(dirty){ e.preventDefault(); e.returnValue=''; } });
render();

if(window.claude && typeof window.claude.use==='function'){
  Promise.all([window.claude.use('artifact'), window.claude.use('user')]).then(function(r){
    var art=r[0], user=r[1]; if(!art) return;
    (user?user.canEdit():Promise.resolve(true)).then(function(ok){ if(ok){ artNs=art; render(); } });
  }).catch(function(){});
}
})();
