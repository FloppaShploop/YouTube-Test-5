const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>StreamTube</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#0f0f0f;color:#f1f1f1;font-family:Arial,Helvetica,sans-serif}header{height:64px;display:flex;align-items:center;gap:18px;padding:0 22px;border-bottom:1px solid #272727;position:sticky;top:0;background:rgba(15,15,15,.96);backdrop-filter:blur(10px);z-index:5}.logo{font-weight:800;font-size:22px;white-space:nowrap}.logo span{color:#ff3b30}.search{display:flex;flex:1;max-width:760px;margin:auto}.search input{width:100%;background:#181818;border:1px solid #3a3a3a;border-radius:24px 0 0 24px;color:white;padding:12px 17px;font-size:15px;outline:none}.search button{border:1px solid #3a3a3a;border-left:0;background:#252525;color:white;padding:0 22px;border-radius:0 24px 24px 0;cursor:pointer}.wrap{display:flex;min-height:calc(100vh - 64px)}aside{width:220px;border-right:1px solid #272727;padding:18px 12px;flex:none}aside button{width:100%;text-align:left;background:none;border:0;color:#ddd;padding:12px;border-radius:10px;font-size:14px;cursor:pointer}aside button:hover{background:#222}main{max-width:1400px;width:100%;margin:auto;padding:28px}.hero{padding:10px 0 24px}.hero h1{font-size:32px;margin:0 0 8px}.muted{color:#aaa}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:24px}.card{cursor:pointer;min-width:0}.thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;background:#222;display:block}.ct{padding:10px 3px}.title{font-size:16px;font-weight:700;line-height:1.35}.channel{color:#aaa;font-size:13px;margin-top:6px}.desc{color:#999;font-size:13px;margin-top:7px;line-height:1.4}.player{width:100%;aspect-ratio:16/9;border:0;border-radius:12px;background:#000}.back{margin-bottom:18px;background:#222;border:0;color:white;padding:9px 14px;border-radius:8px;cursor:pointer}.info{padding:18px 0;border-bottom:1px solid #2b2b2b}.info h1{font-size:22px;margin:0 0 10px}.related{margin-top:24px}.error{padding:18px;background:#321719;border:1px solid #713036;border-radius:10px;color:#ffb8bc}.loading{color:#aaa;padding:30px 0}@media(max-width:800px){aside{display:none}main{padding:18px}.grid{grid-template-columns:1fr}.logo{font-size:18px}header{padding:0 10px;gap:8px}.search button{padding:0 14px}}
</style>
</head>
<body>
<header><div class="logo">Stream<span>Tube</span></div><form class="search" id="searchForm"><input id="q" placeholder="Search YouTube..." autocomplete="off"><button type="submit">Search</button></form></header>
<div class="wrap"><aside><button type="button" onclick="home()">⌂ Home</button><button type="button" onclick="popular()">Popular</button><button type="button" onclick="askUrl()">Watch by URL</button></aside><main id="app"><div class="hero"><h1>StreamTube</h1><div class="muted">Search YouTube and watch videos through the official YouTube player.</div></div><div id="content"><div class="loading">Loading videos...</div></div></main></div>
<script>
(function(){
  var app=document.getElementById('app');
  var content=document.getElementById('content');
  var q=document.getElementById('q');
  document.getElementById('searchForm').addEventListener('submit',function(e){e.preventDefault();search(q.value);});
  window.esc=function(s){s=s==null?'':String(s);return s.replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  window.card=function(v){
    var id=window.esc(v.id);
    return '<article class="card" onclick="watch(\\''+id+'\\')"><img class="thumb" src="'+window.esc(v.thumb)+'" loading="lazy" alt=""><div class="ct"><div class="title">'+window.esc(v.title)+'</div><div class="channel">'+window.esc(v.channel)+'</div><div class="desc">'+window.esc(v.description||'')+'</div></div></article>';
  };
  window.api=async function(url){var r=await fetch(url);var d=await r.json().catch(function(){return {error:'Server returned an invalid response.'};});if(!r.ok)throw new Error(d.error||'Request failed');return d;};
  window.renderCards=function(items){return '<div class="grid">'+(items||[]).map(window.card).join('')+'</div>';};
  window.search=async function(term){term=(term||'').trim();if(!term)return;content.innerHTML='<div class="loading">Searching...</div>';try{var d=await window.api('/api/search?q='+encodeURIComponent(term));content.innerHTML=window.renderCards(d.items);}catch(e){content.innerHTML='<div class="error">'+window.esc(e.message)+'</div>';}};
  window.popular=function(){window.search('popular music');};
  window.watch=async function(id){app.innerHTML='<button class="back" onclick="home()">&larr; Back</button><div class="loading">Loading video...</div>';try{var d=await window.api('/api/video?id='+encodeURIComponent(id));app.innerHTML='<button class="back" onclick="home()">&larr; Back</button><iframe class="player" src="https://www.youtube.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe><section class="info"><h1>'+window.esc(d.title)+'</h1><div class="muted">'+window.esc(d.channel)+' &middot; '+window.esc(d.views||'')+' views</div><p class="desc">'+window.esc(d.description||'')+'</p></section><section class="related"><h2>Related videos</h2><div id="rel" class="grid"><div class="loading">Loading...</div></div></section>';try{var r=await window.api('/api/related?id='+encodeURIComponent(id));document.getElementById('rel').innerHTML=window.renderCards(r.items);}catch(e){var rel=document.getElementById('rel');if(rel)rel.innerHTML='<div class="muted">No related videos available.</div>';}}catch(e){app.innerHTML='<button class="back" onclick="home()">&larr; Back</button><div class="error">'+window.esc(e.message)+'</div>';}};
  window.home=function(){location.href='/';};
  window.askUrl=function(){var u=prompt('Paste a YouTube URL or video ID:');if(u)window.parseUrl(u);};
  window.parseUrl=async function(u){try{var d=await window.api('/api/parse?input='+encodeURIComponent(u));window.watch(d.id);}catch(e){content.innerHTML='<div class="error">'+window.esc(e.message)+'</div>';}};
  async function homeLoad(){try{var d=await window.api('/api/search?q=technology&limit=12');content.innerHTML=window.renderCards(d.items);}catch(e){content.innerHTML='<div class="error">'+window.esc(e.message)+'<br><br>Add the YOUTUBE_API_KEY Cloudflare secret, then redeploy.</div>';}}
  homeLoad();
})();
</script>
</body>
</html>`;

function videoId(input){
  const s=String(input||'').trim();
  if(/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try{
    const u=new URL(s.startsWith('http')?s:'https://'+s);
    const host=u.hostname.replace(/^www\./,'').toLowerCase();
    if(['youtu.be','youtube.com','m.youtube.com','music.youtube.com','youtube-nocookie.com'].includes(host)){
      const v=u.searchParams.get('v');
      if(v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      const parts=u.pathname.split('/').filter(Boolean);
      if(['embed','shorts','live','v'].includes(parts[0]) && /^[A-Za-z0-9_-]{11}$/.test(parts[1]||'')) return parts[1];
    }
  }catch(e){}
  return null;
}

async function yt(env,path){
  if(!env.YOUTUBE_API_KEY) throw new Error('YOUTUBE_API_KEY is not configured.');
  const u=new URL('https://www.googleapis.com/youtube/v3/'+path);
  u.searchParams.set('key',env.YOUTUBE_API_KEY);
  const r=await fetch(u);
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error?.message||'YouTube API request failed.');
  return d;
}

function out(items){
  return (items||[]).map(x=>({
    id:x.id?.videoId||x.id,
    title:x.snippet?.title||'',
    channel:x.snippet?.channelTitle||'',
    description:x.snippet?.description||'',
    thumb:x.snippet?.thumbnails?.high?.url||x.snippet?.thumbnails?.medium?.url||x.snippet?.thumbnails?.default?.url||''
  })).filter(x=>x.id);
}

function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=60'}});
}

export default {
  async fetch(request,env){
    const u=new URL(request.url);
    try{
      if(request.method!=='GET') return json({error:'Method not allowed.'},405);
      if(u.pathname==='/api/parse'){
        const id=videoId(u.searchParams.get('input'));
        if(!id) return json({error:'That is not a valid YouTube URL or video ID.'},400);
        return json({id});
      }
      if(u.pathname==='/api/search'){
        const q=u.searchParams.get('q')?.trim();
        if(!q) return json({error:'Missing search query.'},400);
        const limit=Math.min(Math.max(Number(u.searchParams.get('limit')||12),1),24);
        const d=await yt(env,'search?part=snippet&type=video&videoEmbeddable=true&safeSearch=moderate&regionCode=US&maxResults='+limit+'&q='+encodeURIComponent(q));
        return json({items:out(d.items)});
      }
      if(u.pathname==='/api/video'){
        const id=videoId(u.searchParams.get('id'));
        if(!id) return json({error:'Invalid video ID.'},400);
        const d=await yt(env,'videos?part=snippet,statistics&id='+encodeURIComponent(id));
        const x=d.items?.[0];
        if(!x) return json({error:'Video not found.'},404);
        return json({id,title:x.snippet.title,channel:x.snippet.channelTitle,description:x.snippet.description,views:x.statistics?.viewCount||'0'});
      }
      if(u.pathname==='/api/related'){
        const id=videoId(u.searchParams.get('id'));
        if(!id) return json({error:'Invalid video ID.'},400);
        const vd=await yt(env,'videos?part=snippet&id='+encodeURIComponent(id));
        const title=vd.items?.[0]?.snippet?.title;
        if(!title) return json({items:[]});
        const d=await yt(env,'search?part=snippet&type=video&videoEmbeddable=true&safeSearch=moderate&regionCode=US&maxResults=12&q='+encodeURIComponent(title));
        return json({items:out(d.items).filter(x=>x.id!==id).slice(0,10)});
      }
      if(u.pathname.startsWith('/api/')) return json({error:'Not found.'},404);
      return new Response(HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    }catch(e){
      return json({error:e?.message||'Unexpected server error.'},500);
    }
  }
};
