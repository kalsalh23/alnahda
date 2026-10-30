let sb = null;
const SURL = window.ORG_CONFIG.SUPABASE_URL;
const SKEY = window.ORG_CONFIG.SUPABASE_ANON_KEY;

const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const menuItems = document.querySelectorAll('.menu-item');
const tabs = document.querySelectorAll('.tab');
const tabTitle = document.getElementById('tabTitle');
const saveAll = document.getElementById('saveAll');
const toast = document.getElementById('toast');

const validEmail = 'alnahda27@gmail.com';
const validPass = 'reda@2027';

async function init(){
  if(typeof window.supabase === 'undefined'){
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    document.head.appendChild(s);
    await new Promise(r=>s.onload=r);
  }
  sb = window.supabase.createClient(SURL, SKEY);
}

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if(email===validEmail && password===validPass){
    await init();
    loginScreen.style.display='none';
    dashboard.style.display='grid';
    localStorage.setItem('alnahda_admin','1');
    loadAll();
  }else loginError.textContent='بيانات الدخول غير صحيحة';
});

logoutBtn.addEventListener('click',()=>{
  localStorage.removeItem('alnahda_admin');
  dashboard.style.display='none';
  loginScreen.style.display='flex';
});

menuItems.forEach(m=>{
  m.addEventListener('click',()=>{
    menuItems.forEach(x=>x.classList.remove('active'));
    m.classList.add('active');
    tabs.forEach(t=>t.classList.remove('active'));
    document.getElementById(m.dataset.tab).classList.add('active');
    const map={'dashboard-tab':'لوحة التحكم الرئيسية','projects-tab':'إدارة المشاريع','contact-tab':'معلومات التواصل','vision-tab':'صفحة الرؤية','about-tab':'صفحة من نحن','home-tab':'الصفحة الرئيسية','pages-tab':'روابط الصفحات'};
    tabTitle.textContent = map[m.dataset.tab]||'لوحة التحكم';
  });
});

async function loadAll(){
  await loadHome();
  await loadContact();
  await loadPages();
  await loadProjects();
}

async function loadHome(){
  const {data} = await sb.from('home_content').select('*').order('id').limit(1).maybeSingle();
  if(data){
    document.getElementById('hTitleAr').value = data.hero_title_ar||'';
    document.getElementById('hTitleEn').value = data.hero_title_en||'';
    document.getElementById('hSubAr').value = data.hero_subtitle_ar||'';
    document.getElementById('hSubEn').value = data.hero_subtitle_en||'';
  }
}

async function loadContact(){
  const {data} = await sb.from('contact_info').select('*').order('id').limit(1).maybeSingle();
  if(data){
    document.getElementById('cEmail').value = data.email||'';
    document.getElementById('cPhone').value = data.phone||'';
    document.getElementById('cAddrAr').value = data.address_ar||'';
    document.getElementById('cAddrEn').value = data.address_en||'';
  }
}

async function loadPages(){
  const {data} = await sb.from('pages').select('*');
  (data||[]).forEach(p=>{
    if(p.slug==='vision'){
      document.getElementById('vTitleAr').value = p.title_ar||'';
      document.getElementById('vTitleEn').value = p.title_en||'';
      document.getElementById('vBodyAr').value = p.content_ar||'';
      document.getElementById('vBodyEn').value = p.content_en||'';
    }
    if(p.slug==='about'){
      document.getElementById('aTitleAr').value = p.title_ar||'';
      document.getElementById('aTitleEn').value = p.title_en||'';
      document.getElementById('aBodyAr').value = p.content_ar||'';
      document.getElementById('aBodyEn').value = p.content_en||'';
    }
  });
}

async function loadProjects(){
  const {data} = await sb.from('projects').select('*').order('sort_order',{ascending:true});
  const list = document.getElementById('projectsList');
  document.getElementById('projCount').textContent = (data||[]).length;
  list.innerHTML='';
  (data||[]).forEach((p,i)=>{
    const row = document.createElement('div');
    row.className='project-row';
    row.innerHTML=`
      <div class="project-row-head">
        <div><h3>${p.title_ar} / ${p.title_en}</h3><span>${p.category}</span></div>
        <div class="row-actions">
          <button onclick="editP('${p.id}')"><i class="fas fa-edit"></i> تعديل</button>
          <button onclick="delP('${p.id}')"><i class="fas fa-trash"></i> حذف</button>
        </div>
      </div>
      <div class="pedit" id="pe-${p.id}" style="display:none;flex-direction:column;gap:12px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label>عنوان عربي</label><input value="${p.title_ar||''}" id="pta-${p.id}"></div>
          <div class="field"><label>عنوان إنجليزي</label><input value="${p.title_en||''}" id="pte-${p.id}"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label>تصنيف</label><select id="pcat-${p.id}"><option value="defense" ${p.category==='defense'?'selected':''}>الصناعات الدفاعية</option><option value="tech" ${p.category==='tech'?'selected':''}>التقنيات</option><option value="health" ${p.category==='health'?'selected':''}>الصحة</option></select></div>
          <div class="field"><label>صورة</label><input value="${p.image_url||''}" id="pimg-${p.id}"></div>
        </div>
        <div class="field"><label>وصف مختصر عربي</label><textarea id="pdar-${p.id}">${p.desc_ar||''}</textarea></div>
        <div class="field"><label>وصف مختصر إنجليزي</label><textarea id="pden-${p.id}">${p.desc_en||''}</textarea></div>
        <button class="btn" onclick="updP('${p.id}')">حفظ المشروع</button>
      </div>
    `;
    list.appendChild(row);
  });
}

window.editP = (id)=>{const el=document.getElementById('pe-'+id);el.style.display=el.style.display==='flex'?'none':'flex';};
window.delP = async (id)=>{if(confirm('حذف المشروع؟')){await sb.from('projects').delete().eq('id',id);loadProjects();}};
window.updP = async (id)=>{
  const {error}=await sb.from('projects').update({
    title_ar:document.getElementById('pta-'+id).value,
    title_en:document.getElementById('pte-'+id).value,
    category:document.getElementById('pcat-'+id).value,
    image_url:document.getElementById('pimg-'+id).value,
    desc_ar:document.getElementById('pdar-'+id).value,
    desc_en:document.getElementById('pden-'+id).value,
    updated_at:new Date()
  }).eq('id',id);
  if(!error) showToast('تم تحديث المشروع');
};

document.getElementById('addProject').addEventListener('click', async ()=>{
  const {error}=await sb.from('projects').insert({
    title_ar:'مشروع جديد',title_en:'New Project',category:'tech',tag_ar:'التقنيات',tag_en:'Technologies',desc_ar:'',desc_en:'',image_url:''
  });
  if(!error){showToast('تم إضافة المشروع');loadProjects();}
});

saveAll.addEventListener('click', async ()=>{
  await sb.from('home_content').update({hero_title_ar:document.getElementById('hTitleAr').value,hero_title_en:document.getElementById('hTitleEn').value,hero_subtitle_ar:document.getElementById('hSubAr').value,hero_subtitle_en:document.getElementById('hSubEn').value,updated_at:new Date()}).neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('contact_info').update({email:document.getElementById('cEmail').value,phone:document.getElementById('cPhone').value,address_ar:document.getElementById('cAddrAr').value,address_en:document.getElementById('cAddrEn').value,updated_at:new Date()}).neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('pages').update({content_ar:document.getElementById('vBodyAr').value,content_en:document.getElementById('vBodyEn').value,updated_at:new Date()}).eq('slug','vision');
  await sb.from('pages').update({content_ar:document.getElementById('aBodyAr').value,content_en:document.getElementById('aBodyEn').value,updated_at:new Date()}).eq('slug','about');
  showToast('تم حفظ جميع التغييرات في Supabase');
});

function showToast(m){toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);}

(async()=>{
  if(localStorage.getItem('alnahda_admin')==='1'){
    loginScreen.style.display='none';
    dashboard.style.display='grid';
    await init();
    loadAll();
  }
})();
