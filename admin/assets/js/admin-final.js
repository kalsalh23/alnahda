let sb=null;const SURL=window.ORG_CONFIG.SUPABASE_URL, SKEY=window.ORG_CONFIG.SUPABASE_ANON_KEY;
const login=document.getElementById('login'),app=document.getElementById('app'),form=document.getElementById('loginForm'),err=document.getElementById('err'),logout=document.getElementById('logout');
const navs=document.querySelectorAll('.nav button'),views=document.querySelectorAll('[data-view]'),title=document.getElementById('title');
const save=document.getElementById('save'),toast=document.getElementById('toast'),plist=document.getElementById('plist'),addp=document.getElementById('addp');

async function init(){if(!window.supabase){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';document.head.appendChild(s);await new Promise(r=>s.onload=r);}sb=window.supabase.createClient(SURL,SKEY);}

form.addEventListener('submit',async e=>{e.preventDefault();if(document.getElementById('email').value.trim()==='alnahda27@gmail.com' && document.getElementById('pass').value.trim()==='reda@2027'){await init();login.style.display='none';app.style.display='grid';localStorage.setItem('adm','1');load();}else err.textContent='خطأ في الدخول';});
logout.onclick=()=>{localStorage.removeItem('adm');location.reload();};
navs.forEach(b=>b.onclick=()=>{navs.forEach(x=>x.classList.remove('active'));b.classList.add('active');views.forEach(v=>v.classList.remove('active'));document.querySelector(`[data-view="${b.dataset.go}"]`).classList.add('active');title.textContent=b.textContent.trim();});
function msg(m){toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500);}

async function load(){
  const hc=await sb.from('home_content').select('*').limit(1).single(); if(hc.data){document.getElementById('ha').value=hc.data.hero_title_ar||'';document.getElementById('he').value=hc.data.hero_title_en||'';document.getElementById('hsa').value=hc.data.hero_subtitle_ar||'';document.getElementById('hse').value=hc.data.hero_subtitle_en||'';}
  const ci=await sb.from('contact_info').select('*').limit(1).single(); if(ci.data){document.getElementById('ce').value=ci.data.email||'';document.getElementById('cp').value=ci.data.phone||'';document.getElementById('ca').value=ci.data.address_ar||'';document.getElementById('cen').value=ci.data.address_en||'';}
  const pgs=await sb.from('pages').select('*'); (pgs.data||[]).forEach(x=>{if(x.slug==='vision'){document.getElementById('va').value=x.content_ar||'';document.getElementById('ve').value=x.content_en||'';}if(x.slug==='about'){document.getElementById('aa').value=x.content_ar||'';document.getElementById('ae').value=x.content_en||'';}});
  loadP();
}

async function loadP(){
  const pr=await sb.from('projects').select('*').order('sort_order',{ascending:true});
  const arr=pr.data||[]; document.getElementById('pc').textContent=arr.length; plist.innerHTML='';
  arr.forEach(p=>{
    const d=document.createElement('div');
    d.innerHTML=`
      <div class="row"><div><strong>${p.title_ar}</strong> - ${p.title_en}</div><div class="btns"><button class="btn" onclick="ed('${p.id}')">تعديل</button><button class="btn" onclick="dl('${p.id}')">حذف</button></div></div>
      <div class="row-edit" id="e${p.id}">
        <div class="grid"><div class="field"><label>العنوان عربي</label><input id="ta${p.id}" value="${p.title_ar.replace(/"/g,'&quot;')}"></div><div class="field"><label>العنوان إنجليزي</label><input id="te${p.id}" value="${p.title_en.replace(/"/g,'&quot;')}"></div></div>
        <div class="grid"><div class="field"><label>تصنيف</label><select id="tc${p.id}"><option value="defense" ${p.category==='defense'?'selected':''}>الصناعات الدفاعية</option><option value="tech" ${p.category==='tech'?'selected':''}>التقنيات</option><option value="health" ${p.category==='health'?'selected':''}>الصحة</option></select></div><div class="field"><label>صورة</label><input id="ti${p.id}" value="${p.image_url||''}"></div></div>
        <div class="field"><label>وصف عربي</label><textarea id="tda${p.id}">${p.desc_ar||''}</textarea></div>
        <div class="field"><label>وصف إنجليزي</label><textarea id="tde${p.id}">${p.desc_en||''}</textarea></div>
        <button class="btn primary" onclick="up('${p.id}')">حفظ المشروع</button>
      </div>`;
    plist.appendChild(d);
  });
}
window.ed=(id)=>{const e=document.getElementById('e'+id);e.classList.toggle('open');};
window.dl=async(id)=>{if(confirm('حذف؟')){await sb.from('projects').delete().eq('id',id);loadP();}};
window.up=async(id)=>{await sb.from('projects').update({title_ar:document.getElementById('ta'+id).value,title_en:document.getElementById('te'+id).value,category:document.getElementById('tc'+id).value,image_url:document.getElementById('ti'+id).value,desc_ar:document.getElementById('tda'+id).value,desc_en:document.getElementById('tde'+id).value,updated_at:new Date()}).eq('id',id);msg('تم الحفظ');};
addp.onclick=async()=>{await sb.from('projects').insert({title_ar:'مشروع جديد',title_en:'New Project',category:'tech',tag_ar:'التقنيات',tag_en:'Technologies'});loadP();msg('تم الإضافة');};

save.onclick=async()=>{
  await sb.from('home_content').update({hero_title_ar:document.getElementById('ha').value,hero_title_en:document.getElementById('he').value,hero_subtitle_ar:document.getElementById('hsa').value,hero_subtitle_en:document.getElementById('hse').value}).neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('contact_info').update({email:document.getElementById('ce').value,phone:document.getElementById('cp').value,address_ar:document.getElementById('ca').value,address_en:document.getElementById('cen').value}).neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('pages').update({content_ar:document.getElementById('va').value,content_en:document.getElementById('ve').value}).eq('slug','vision');
  await sb.from('pages').update({content_ar:document.getElementById('aa').value,content_en:document.getElementById('ae').value}).eq('slug','about');
  msg('تم حفظ جميع التعديلات');
};

if(localStorage.getItem('adm')==='1'){login.style.display='none';app.style.display='grid';init().then(load);}
