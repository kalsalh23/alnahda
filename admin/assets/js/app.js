let sb=null;const U=window.ORG_CONFIG.SUPABASE_URL,K=window.ORG_CONFIG.SUPABASE_ANON_KEY;
const lg=document.getElementById('lg'),ap=document.getElementById('ap'),lf=document.getElementById('lf'),le=document.getElementById('le'),lo=document.getElementById('lo');
const btns=document.querySelectorAll('.sb-nav button'),pgs=document.querySelectorAll('.pg'),ht=document.getElementById('ht'),sv=document.getElementById('sv'),tst=document.getElementById('tst');
const pl=document.getElementById('pl'),apb=document.getElementById('ap'),cnt=document.getElementById('cnt');

async function init(){if(!window.supabase){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';document.head.appendChild(s);await new Promise(r=>s.onload=r);}sb=window.supabase.createClient(U,K);}
lf.onsubmit=async e=>{e.preventDefault();if(document.getElementById('em').value.trim()==='alnahda27@gmail.com' && document.getElementById('pw').value.trim()==='reda@2027'){await init();lg.style.display='none';ap.style.display='grid';localStorage.setItem('ad','1');load();}else le.textContent='خطأ في الدخول';};
lo.onclick=()=>{localStorage.removeItem('ad');location.reload();};
btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.classList.remove('on'));b.classList.add('on');pgs.forEach(p=>p.classList.remove('on'));document.getElementById(b.dataset.p).classList.add('on');ht.textContent=b.textContent.trim();});
function msg(m){tst.textContent=m;tst.classList.add('s');setTimeout(()=>tst.classList.remove('s'),2500);}

async function load(){
  const hc=await sb.from('home_content').select('*').limit(1).maybeSingle(); if(hc.data){document.getElementById('hta').value=hc.data.hero_title_ar||'';document.getElementById('hte').value=hc.data.hero_title_en||'';document.getElementById('hsa').value=hc.data.hero_subtitle_ar||'';document.getElementById('hse').value=hc.data.hero_subtitle_en||'';}else{await sb.from('home_content').insert([{hero_title_ar:'',hero_title_en:'',hero_subtitle_ar:'',hero_subtitle_en:''}]);}
  const ci=await sb.from('contact_info').select('*').limit(1).maybeSingle(); if(ci.data){document.getElementById('ce').value=ci.data.email||'';document.getElementById('cp').value=ci.data.phone||'';document.getElementById('ca').value=ci.data.address_ar||'';document.getElementById('cen').value=ci.data.address_en||'';}else{await sb.from('contact_info').insert([{email:'info@irg.group',phone:'',address_ar:'',address_en:''}]);}
  await loadP();await loadPages();
}

async function loadPages(){
  const ps=await sb.from('pages').select('*');
  (ps.data||[]).forEach(x=>{if(x.slug==='vision'){document.getElementById('va').value=x.content_ar||'';document.getElementById('ve').value=x.content_en||'';}if(x.slug==='about'){document.getElementById('aa').value=x.content_ar||'';document.getElementById('ae').value=x.content_en||'';}});
  if(!(ps.data||[]).find(x=>x.slug==='vision')) await sb.from('pages').insert([{slug:'vision',title_ar:'الرؤية',title_en:'Vision',content_ar:'',content_en:''}]);
  if(!(ps.data||[]).find(x=>x.slug==='about')) await sb.from('pages').insert([{slug:'about',title_ar:'من نحن',title_en:'About',content_ar:'',content_en:''}]);
}

async function loadP(){
  const pr=await sb.from('projects').select('*').order('sort_order',{ascending:true});
  const arr=pr.data||[]; document.getElementById('pc').textContent=arr.length; pl.innerHTML='';
  arr.forEach(x=>{
    const d=document.createElement('div');d.className='pr';
    d.innerHTML=`<div class="pr-h"><div><b>${x.title_ar||''}</b> / ${x.title_en||''}</div><div class="btns"><button class="b" onclick="t('${x.id}')">تعديل</button><button class="b" onclick="dlt('${x.id}')">حذف</button></div></div><div class="pr-b" id="b${x.id}"><div class="g2"><div class="f"><label>عنوان عربي</label><input id="ta${x.id}" value="${(x.title_ar||'').replace(/"/g,'&quot;')}"></div><div class="f"><label>عنوان إنجليزي</label><input id="te${x.id}" value="${(x.title_en||'').replace(/"/g,'&quot;')}"></div></div><div class="g2"><div class="f"><label>تصنيف</label><select id="tc${x.id}"><option value="defense" ${x.category==='defense'?'selected':''}>الصناعات الدفاعية</option><option value="tech" ${x.category==='tech'?'selected':''}>التقنيات</option><option value="health" ${x.category==='health'?'selected':''}>الصحة</option></select></div><div class="f"><label>رابط صورة</label><input id="ti${x.id}" value="${x.image_url||''}"></div></div><div class="f"><label>وصف عربي</label><textarea id="da${x.id}">${x.desc_ar||''}</textarea></div><div class="f"><label>وصف إنجليزي</label><textarea id="de${x.id}">${x.desc_en||''}</textarea></div><button class="bp" onclick="up('${x.id}')">حفظ المشروع</button></div>`;
    pl.appendChild(d);
  });
}
window.t=id=>{const e=document.getElementById('b'+id);e.classList.toggle('o');};
window.dlt=async id=>{if(confirm('حذف المشروع؟')){const r=await sb.from('projects').delete().eq('id',id);if(!r.error){lp();msg('تم الحذف');}}};
window.up=async id=>{const r=await sb.from('projects').update({title_ar:document.getElementById('ta'+id).value,title_en:document.getElementById('te'+id).value,category:document.getElementById('tc'+id).value,image_url:document.getElementById('ti'+id).value,desc_ar:document.getElementById('da'+id).value,desc_en:document.getElementById('de'+id).value,updated_at:new Date().toISOString()}).eq('id',id);if(!r.error)msg('تم التحديث');else msg('خطأ');};
apb.onclick=async()=>{const r=await sb.from('projects').insert([{title_ar:'مشروع جديد',title_en:'New Project',category:'tech',tag_ar:'التقنيات',tag_en:'Technologies',desc_ar:'',desc_en:'',image_url:'',sort_order:999}]);if(!r.error){msg('تم الإضافة');lp();}};

sv.onclick=async()=>{
  try{
    await sb.from('home_content').update({hero_title_ar:document.getElementById('hta').value,hero_title_en:document.getElementById('hte').value,hero_subtitle_ar:document.getElementById('hsa').value,hero_subtitle_en:document.getElementById('hse').value,updated_at:new Date().toISOString()}).neq('id','00000000-0000-0000-0000-000000000000');
    await sb.from('contact_info').update({email:document.getElementById('ce').value,phone:document.getElementById('cp').value,address_ar:document.getElementById('ca').value,address_en:document.getElementById('cen').value,updated_at:new Date().toISOString()}).neq('id','00000000-0000-0000-0000-000000000000');
    await sb.from('pages').update({content_ar:document.getElementById('va').value,content_en:document.getElementById('ve').value,updated_at:new Date().toISOString()}).eq('slug','vision');
    await sb.from('pages').update({content_ar:document.getElementById('aa').value,content_en:document.getElementById('ae').value,updated_at:new Date().toISOString()}).eq('slug','about');
    msg('تم الحفظ بنجاح');
  }catch(e){msg('حدث خطأ');}
};

if(localStorage.getItem('ad')==='1'){lg.style.display='none';ap.style.display='grid';init().then(load);}
