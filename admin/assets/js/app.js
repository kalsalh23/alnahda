let sb=null;
const U=window.ORG_CONFIG.SUPABASE_URL;
const K=window.ORG_CONFIG.SUPABASE_ANON_KEY;

async function init(){
  if(!window.supabase){
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    document.head.appendChild(s);
    await new Promise(r=>{s.onload=r;});
  }
  sb=window.supabase.createClient(U,K);
}

document.getElementById('lf').onsubmit=async(e)=>{
  e.preventDefault();
  if(document.getElementById('em').value.trim()==='alnahda27@gmail.com' && document.getElementById('pw').value.trim()==='reda@2027'){
    await init();
    document.getElementById('lg').style.display='none';
    document.getElementById('ap').style.display='grid';
    localStorage.setItem('adm','1');
    await loadAll();
  }else{
    document.getElementById('le').textContent='خطأ في بيانات الدخول';
  }
};

document.getElementById('lo').onclick=()=>{localStorage.removeItem('adm');location.reload();};

document.querySelectorAll('.sb-nav button').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.sb-nav button').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on'));
    document.getElementById(btn.dataset.p).classList.add('on');
    document.getElementById('ht').textContent=btn.innerText.trim();
  }
});

function toast(m){
  const t=document.getElementById('tst');
  t.textContent=m;t.classList.add('s');
  setTimeout(()=>t.classList.remove('s'),2000);
}

async function loadAll(){
  await loadHome();
  await loadContact();
  await loadPages();
  await loadProjects();
}

async function loadHome(){
  const {data}=await sb.from('home_content').select('*').limit(1).maybeSingle();
  if(data){
    document.getElementById('hta').value=data.hero_title_ar||'';
    document.getElementById('hte').value=data.hero_title_en||'';
    document.getElementById('hsa').value=data.hero_subtitle_ar||'';
    document.getElementById('hse').value=data.hero_subtitle_en||'';
  }else{
    await sb.from('home_content').insert([{hero_title_ar:'',hero_title_en:'',hero_subtitle_ar:'',hero_subtitle_en:''}]);
  }
}

async function loadContact(){
  const {data}=await sb.from('contact_info').select('*').limit(1).maybeSingle();
  if(data){
    document.getElementById('ce').value=data.email||'';
    document.getElementById('cp').value=data.phone||'';
    document.getElementById('ca').value=data.address_ar||'';
    document.getElementById('cen').value=data.address_en||'';
  }else{
    await sb.from('contact_info').insert([{email:'info@irg.group',phone:'',address_ar:'',address_en:''}]);
  }
}

async function loadPages(){
  const {data}=await sb.from('pages').select('*');
  const pages=data||[];
  const v=pages.find(p=>p.slug==='vision');
  if(v){document.getElementById('va').value=v.content_ar||'';document.getElementById('ve').value=v.content_en||'';}
  else await sb.from('pages').insert([{slug:'vision',title_ar:'الرؤية',title_en:'Vision',content_ar:'',content_en:''}]);
  const a=pages.find(p=>p.slug==='about');
  if(a){document.getElementById('aa').value=a.content_ar||'';document.getElementById('ae').value=a.content_en||'';}
  else await sb.from('pages').insert([{slug:'about',title_ar:'من نحن',title_en:'About',content_ar:'',content_en:''}]);
}

async function loadProjects(){
  const {data}=await sb.from('projects').select('*').order('sort_order',{ascending:true});
  const arr=data||[];
  document.getElementById('cnt').textContent=arr.length;
  const pl=document.getElementById('pl');
  pl.innerHTML='';
  arr.forEach(p=>{
    const div=document.createElement('div');
    div.className='pr';
    div.innerHTML=`<div class="pr-h"><div><b>${p.title_ar||''}</b> / ${p.title_en||''}</div><div class="btns"><button class="b" onclick="toggle('${p.id}')">تعديل</button><button class="b" onclick="del('${p.id}')">حذف</button></div></div><div class="pr-b" id="b${p.id}"><div class="g2"><div class="f"><label>عنوان عربي</label><input id="ta${p.id}" value="${(p.title_ar||'').replace(/"/g,'&quot;')}"></div><div class="f"><label>عنوان إنجليزي</label><input id="te${p.id}" value="${(p.title_en||'').replace(/"/g,'&quot;')}"></div></div><div class="g2"><div class="f"><label>تصنيف</label><select id="tc${p.id}"><option value="defense" ${p.category==='defense'?'selected':''}>الصناعات الدفاعية</option><option value="tech" ${p.category==='tech'?'selected':''}>التقنيات</option><option value="health" ${p.category==='health'?'selected':''}>الصحة</option></select></div><div class="f"><label>صورة</label><input id="ti${p.id}" value="${p.image_url||''}"></div></div><div class="f"><label>وصف عربي</label><textarea id="da${p.id}">${p.desc_ar||''}</textarea></div><div class="f"><label>وصف إنجليزي</label><textarea id="de${p.id}">${p.desc_en||''}</textarea></div><button class="bp" onclick="upd('${p.id}')">حفظ المشروع</button></div>`;
    pl.appendChild(div);
  });
}

window.toggle=id=>{document.getElementById('b'+id).classList.toggle('o');};
window.del=async id=>{if(confirm('حذف المشروع؟')){await sb.from('projects').delete().eq('id',id);loadProjects();toast('تم الحذف');}};
window.upd=async id=>{
  await sb.from('projects').update({
    title_ar:document.getElementById('ta'+id).value,
    title_en:document.getElementById('te'+id).value,
    category:document.getElementById('tc'+id).value,
    image_url:document.getElementById('ti'+id).value,
    desc_ar:document.getElementById('da'+id).value,
    desc_en:document.getElementById('de'+id).value,
    updated_at:new Date().toISOString()
  }).eq('id',id);
  toast('تم التحديث');
};

document.getElementById('ap').onclick=async()=>{
  await sb.from('projects').insert([{title_ar:'مشروع جديد',title_en:'New Project',category:'tech',tag_ar:'التقنيات',tag_en:'Technologies',desc_ar:'',desc_en:'',image_url:'',sort_order:99}]);
  loadProjects();
  toast('تم الإضافة');
};

document.getElementById('sv').onclick=async()=>{
  try{
    await sb.from('home_content').update({hero_title_ar:document.getElementById('hta').value,hero_title_en:document.getElementById('hte').value,hero_subtitle_ar:document.getElementById('hsa').value,hero_subtitle_en:document.getElementById('hse').value,updated_at:new Date().toISOString()}).neq('id','00000000-0000-0000-0000-000000000000');
    await sb.from('contact_info').update({email:document.getElementById('ce').value,phone:document.getElementById('cp').value,address_ar:document.getElementById('ca').value,address_en:document.getElementById('cen').value,updated_at:new Date().toISOString()}).neq('id','00000000-0000-0000-0000-000000000000');
    await sb.from('pages').update({content_ar:document.getElementById('va').value,content_en:document.getElementById('ve').value,updated_at:new Date().toISOString()}).eq('slug','vision');
    await sb.from('pages').update({content_ar:document.getElementById('aa').value,content_en:document.getElementById('ae').value,updated_at:new Date().toISOString()}).eq('slug','about');
    toast('تم حفظ التغييرات');
  }catch(e){toast('حدث خطأ');}
};

if(localStorage.getItem('adm')==='1'){document.getElementById('lg').style.display='none';document.getElementById('ap').style.display='grid';init().then(loadAll);}
