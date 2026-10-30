let sb=null;
const U=window.ORG_CONFIG.SUPABASE_URL,K=window.ORG_CONFIG.SUPABASE_ANON_KEY;

async function init(){
  if(!window.supabase){
    const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';document.head.appendChild(s);await new Promise(r=>s.onload=r);
  }
  sb=window.supabase.createClient(U,K);
}

document.getElementById('loginForm').onsubmit=async e=>{
  e.preventDefault();
  if(document.getElementById('email').value==='alnahda27@gmail.com'&&document.getElementById('pass').value==='reda@2027'){
    await init();document.getElementById('auth').style.display='none';document.getElementById('wrap').style.display='grid';localStorage.setItem('a','1');loadAll();
  }else document.getElementById('err').textContent='خطأ';
};
document.getElementById('logout').onclick=()=>{localStorage.removeItem('a');location.reload();};

document.querySelectorAll('.menu button').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.menu button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
    document.getElementById(b.dataset.tab).classList.add('on');
    document.getElementById('pageTitle').textContent=b.innerText.trim();
  }
});

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);}

async function loadAll(){
  const hc=await sb.from('home_content').select('*').limit(1).maybeSingle();
  if(hc.data){document.getElementById('hta').value=hc.data.hero_title_ar||'';document.getElementById('hte').value=hc.data.hero_title_en||'';document.getElementById('hsa').value=hc.data.hero_subtitle_ar||'';document.getElementById('hse').value=hc.data.hero_subtitle_en||'';}
  const cc=await sb.from('contact_info').select('*').limit(1).maybeSingle();
  if(cc.data){document.getElementById('ce').value=cc.data.email||'';document.getElementById('cp').value=cc.data.phone||'';document.getElementById('ca').value=cc.data.address_ar||'';document.getElementById('cen').value=cc.data.address_en||'';}
  const pg=await sb.from('pages').select('*');
  (pg.data||[]).forEach(p=>{if(p.slug==='vision'){document.getElementById('va').value=p.content_ar||'';document.getElementById('ve').value=p.content_en||'';}if(p.slug==='about'){document.getElementById('aa').value=p.content_ar||'';document.getElementById('ae').value=p.content_en||'';}});
  await loadProj();
}

async function loadProj(){
  const {data}=await sb.from('projects').select('*').order('sort_order',{ascending:true});
  const list=document.getElementById('projList');list.innerHTML='';
  (data||[]).forEach(p=>{
    const div=document.createElement('div');div.className='item';
    div.innerHTML=`<div><b>${p.title_ar}</b><br><small>${p.title_en}</small></div><button class="btn" onclick='openEdit(${JSON.stringify(p).replace(/'/g,"&#39;")})'>تعديل</button>`;
    list.appendChild(div);
  });
}

window.openEdit=p=>{
  document.getElementById('pid').value=p.id||'';
  document.getElementById('ptar').value=p.title_ar||'';
  document.getElementById('pten').value=p.title_en||'';
  document.getElementById('pct').value=p.category||'tech';
  document.getElementById('pimg').value=p.image_url||'';
  document.getElementById('ptgar').value=p.tag_ar||'';
  document.getElementById('ptgen').value=p.tag_en||'';
  document.getElementById('pdar').value=p.desc_ar||'';
  document.getElementById('pden').value=p.desc_en||'';
  document.getElementById('pdtar').value=p.details_ar||'';
  document.getElementById('pdten').value=p.details_en||'';
  document.getElementById('modal').classList.add('on');
};
window.closeModal=()=>document.getElementById('modal').classList.remove('on');

document.getElementById('addNew').onclick=()=>{
  document.getElementById('pid').value='';
  document.getElementById('ptar').value='';document.getElementById('pten').value='';
  document.getElementById('pct').value='tech';document.getElementById('pimg').value='';
  document.getElementById('ptgar').value='';document.getElementById('ptgen').value='';
  document.getElementById('pdar').value='';document.getElementById('pden').value='';
  document.getElementById('pdtar').value='';document.getElementById('pdten').value='';
  document.getElementById('modal').classList.add('on');
};

window.saveProject=async()=>{
  const id=document.getElementById('pid').value;
  const obj={
    title_ar:document.getElementById('ptar').value,
    title_en:document.getElementById('pten').value,
    category:document.getElementById('pct').value,
    image_url:document.getElementById('pimg').value,
    tag_ar:document.getElementById('ptgar').value,
    tag_en:document.getElementById('ptgen').value,
    desc_ar:document.getElementById('pdar').value,
    desc_en:document.getElementById('pden').value,
    details_ar:document.getElementById('pdtar').value,
    details_en:document.getElementById('pdten').value,
    updated_at:new Date().toISOString()
  };
  if(id){
    const r = await sb.from('projects').update(obj).eq('id',id);
    if(r.error){toast('خطأ في التحديث');return;}
  }else{
    const r = await sb.from('projects').insert([{...obj,sort_order:Date.now()}]);
    if(r.error){toast('خطأ في الإضافة');return;}
  }
  closeModal();await loadProj();toast('تم الحفظ');
};

window.saveContact=async()=>{
  await sb.from('contact_info').update({email:document.getElementById('ce').value,phone:document.getElementById('cp').value,address_ar:document.getElementById('ca').value,address_en:document.getElementById('cen').value,updated_at:new Date().toISOString()}).neq('id','00000000-0000-0000-0000-000000000000');
  toast('تم الحفظ');
};
window.saveVision=async()=>{
  await sb.from('pages').update({content_ar:document.getElementById('va').value,content_en:document.getElementById('ve').value,updated_at:new Date().toISOString()}).eq('slug','vision');
  toast('تم الحفظ');
};
window.saveAbout=async()=>{
  await sb.from('pages').update({content_ar:document.getElementById('aa').value,content_en:document.getElementById('ae').value,updated_at:new Date().toISOString()}).eq('slug','about');
  toast('تم الحفظ');
};
window.saveHome=async()=>{
  await sb.from('home_content').update({hero_title_ar:document.getElementById('hta').value,hero_title_en:document.getElementById('hte').value,hero_subtitle_ar:document.getElementById('hsa').value,hero_subtitle_en:document.getElementById('hse').value,updated_at:new Date().toISOString()}).neq('id','00000000-0000-0000-0000-000000000000');
  toast('تم الحفظ');
};

if(localStorage.getItem('a')==='1'){document.getElementById('auth').style.display='none';document.getElementById('wrap').style.display='grid';init().then(loadAll);}
