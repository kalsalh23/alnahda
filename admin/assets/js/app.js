let sb=null;const U=window.ORG_CONFIG.SUPABASE_URL,K=window.ORG_CONFIG.SUPABASE_ANON_KEY;
const lg=document.getElementById('lg'),ap=document.getElementById('ap'),lf=document.getElementById('lf'),le=document.getElementById('le'),lo=document.getElementById('lo');
const btns=document.querySelectorAll('.sb-nav button'),pgs=document.querySelectorAll('.pg'),ht=document.getElementById('ht'),sv=document.getElementById('sv'),tst=document.getElementById('tst');
const pl=document.getElementById('pl'),apb=document.getElementById('ap'),cnt=document.getElementById('cnt');

async function init(){if(!window.supabase){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';document.head.appendChild(s);await new Promise(r=>s.onload=r);}sb=window.supabase.createClient(U,K);}
lf.onsubmit=async e=>{e.preventDefault();if(document.getElementById('em').value.trim()==='alnahda27@gmail.com'&&document.getElementById('pw').value.trim()==='reda@2027'){await init();lg.style.display='none';ap.style.display='grid';localStorage.setItem('ad','1');load();}else le.textContent='خطأ';};
lo.onclick=()=>{localStorage.removeItem('ad');location.reload();};
btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.classList.remove('on'));b.classList.add('on');pgs.forEach(p=>p.classList.remove('on'));document.getElementById(b.dataset.p).classList.add('on');ht.textContent=b.textContent.trim();});
function msg(m){tst.textContent=m;tst.classList.add('s');setTimeout(()=>tst.classList.remove('s'),2000);}

async function load(){
  const h=await sb.from('home_content').select('*').limit(1).single(); if(h.data){document.getElementById('hta').value=h.data.hero_title_ar||'';document.getElementById('hte').value=h.data.hero_title_en||'';document.getElementById('hsa').value=h.data.hero_subtitle_ar||'';document.getElementById('hse').value=h.data.hero_subtitle_en||'';}
  const c=await sb.from('contact_info').select('*').limit(1).single(); if(c.data){document.getElementById('ce').value=c.data.email||'';document.getElementById('cp').value=c.data.phone||'';document.getElementById('ca').value=c.data.address_ar||'';document.getElementById('cen').value=c.data.address_en||'';}
  const ps=await sb.from('pages').select('*'); (ps.data||[]).forEach(x=>{if(x.slug==='vision'){document.getElementById('va').value=x.content_ar||'';document.getElementById('ve').value=x.content_en||'';}if(x.slug==='about'){document.getElementById('aa').value=x.content_ar||'';document.getElementById('ae').value=x.content_en||'';}});
  await lp();
}
async function lp(){
  const p=await sb.from('projects').select('*').order('sort_order',{ascending:true});
  const a=p.data||[]; cnt.textContent=a.length; pl.innerHTML='';
  a.forEach(x=>{
    const d=document.createElement('div');d.className='pr';
    d.innerHTML=`<div class="pr-h"><div><b>${x.title_ar}</b> / ${x.title_en}</div><div class="btns"><button class="b" onclick="t('${x.id}')">تعديل</button><button class="b" onclick="dlt('${x.id}')">حذف</button></div></div><div class="pr-b" id="b${x.id}"><div class="g2"><div class="f"><label>عنوان عربي</label><input id="ta${x.id}" value="${x.title_ar||''}"></div><div class="f"><label>عنوان إنجليزي</label><input id="te${x.id}" value="${x.title_en||''}"></div></div><div class="g2"><div class="f"><label>تصنيف</label><select id="tc${x.id}"><option value="defense" ${x.category==='defense'?'selected':''}>دفاعي</option><option value="tech" ${x.category==='tech'?'selected':''}>تقني</option><option value="health" ${x.category==='health'?'selected':''}>صحي</option></select></div><div class="f"><label>رابط صورة</label><input id="ti${x.id}" value="${x.image_url||''}"></div></div><div class="f"><label>وصف عربي</label><textarea id="da${x.id}">${x.desc_ar||''}</textarea></div><div class="f"><label>وصف إنجليزي</label><textarea id="de${x.id}">${x.desc_en||''}</textarea></div><button class="bp" onclick="up('${x.id}')">حفظ</button></div>`;
    pl.appendChild(d);
  });
}
window.t=id=>{const e=document.getElementById('b'+id);e.classList.toggle('o');};
window.dlt=async id=>{if(confirm('حذف المشروع؟')){await sb.from('projects').delete().eq('id',id);lp();msg('تم الحذف');}};
window.up=async id=>{await sb.from('projects').update({title_ar:document.getElementById('ta'+id).value,title_en:document.getElementById('te'+id).value,category:document.getElementById('tc'+id).value,image_url:document.getElementById('ti'+id).value,desc_ar:document.getElementById('da'+id).value,desc_en:document.getElementById('de'+id).value}).eq('id',id);msg('تم التحديث');};
apb.onclick=async()=>{await sb.from('projects').insert({title_ar:'مشروع جديد',title_en:'New Project',category:'tech'});lp();msg('أضيف');};
sv.onclick=async()=>{
  await sb.from('home_content').update({hero_title_ar:document.getElementById('hta').value,hero_title_en:document.getElementById('hte').value,hero_subtitle_ar:document.getElementById('hsa').value,hero_subtitle_en:document.getElementById('hse').value}).neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('contact_info').update({email:document.getElementById('ce').value,phone:document.getElementById('cp').value,address_ar:document.getElementById('ca').value,address_en:document.getElementById('cen').value}).neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('pages').update({content_ar:document.getElementById('va').value,content_en:document.getElementById('ve').value}).eq('slug','vision');
  await sb.from('pages').update({content_ar:document.getElementById('aa').value,content_en:document.getElementById('ae').value}).eq('slug','about');
  msg('تم الحفظ');
};
if(localStorage.getItem('ad')==='1'){lg.style.display='none';ap.style.display='grid';init().then(load);}
