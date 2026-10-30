let contentData = null;
const SUPABASE_URL = window.ORG_CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.ORG_CONFIG.SUPABASE_ANON_KEY;
let supabaseClient = null;

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

async function initSupabase(){
  if(typeof window.supabase === 'undefined') await new Promise(r=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';s.onload=r;document.head.appendChild(s);});
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if(email===validEmail && password===validPass){
    await initSupabase();
    loginScreen.style.display='none';
    dashboard.style.display='grid';
    localStorage.setItem('irg_admin_auth','true');
    loadContent();
  }else{
    loginError.textContent='بيانات الدخول غير صحيحة';
  }
});

logoutBtn.addEventListener('click', ()=>{
  localStorage.removeItem('irg_admin_auth');
  dashboard.style.display='none';
  loginScreen.style.display='flex';
  loginError.textContent='';
});

menuItems.forEach(item=>{
  item.addEventListener('click',()=>{
    menuItems.forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    const target = item.dataset.tab;
    tabs.forEach(t=>t.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    const titles = {'dashboard-tab':'الرئيسية','projects-tab':'إدارة المشاريع','contact-tab':'معلومات التواصل','vision-tab':'صفحة الرؤية','about-tab':'صفحة من نحن','home-tab':'الصفحة الرئيسية','pages-tab':'روابط الصفحات'};
    tabTitle.textContent = titles[target] || 'لوحة التحكم';
  });
});

async function loadContent(){
  if(!supabaseClient) await initSupabase();
  const {data} = await supabaseClient.from('site_content').select('*').eq('key','main').single();
  if(data?.content) contentData = data.content;
  else {
    const res = await fetch('data/content.json?v='+Date.now());
    contentData = await res.json();
    await supabaseClient.from('site_content').upsert({key:'main',content:contentData},{onConflict:'key'});
  }
  fillAll();
}

function fillAll(){
  document.getElementById('projCount').textContent = contentData.projects.length;
  document.getElementById('hTitleAr').value = contentData.home.heroTitleAr||'';
  document.getElementById('hTitleEn').value = contentData.home.heroTitleEn||'';
  document.getElementById('hSubAr').value = contentData.home.heroSubtitleAr||'';
  document.getElementById('hSubEn').value = contentData.home.heroSubtitleEn||'';
  document.getElementById('cEmail').value = contentData.site.email||'';
  document.getElementById('cPhone').value = contentData.site.phone||'';
  document.getElementById('cAddrAr').value = contentData.site.addressAr||'';
  document.getElementById('cAddrEn').value = contentData.site.addressEn||'';
  renderProjects();
}

function renderProjects(){
  const list = document.getElementById('projectsList');
  list.innerHTML='';
  contentData.projects.forEach((p,idx)=>{
    const row = document.createElement('div');
    row.className='project-row';
    row.innerHTML=`
      <div class="project-row-head">
        <div>
          <h3>${p.titleAr} | ${p.titleEn}</h3>
          <span>${p.category==='defense'?'الصناعات الدفاعية':p.category==='tech'?'التقنيات':'الصحة'}</span>
        </div>
        <div class="row-actions">
          <button onclick="toggleEdit(${idx})"><i class="fas fa-edit"></i> تعديل</button>
          <button onclick="removeProject(${idx})"><i class="fas fa-trash"></i> حذف</button>
        </div>
      </div>
      <div class="project-row-edit" id="edit-${idx}" style="display:none;flex-direction:column;gap:14px">
        <div class="grid2" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
          <div class="field"><label>العنوان العربي</label><input value="${(p.titleAr||'').replace(/"/g,'&quot;')}" onchange="contentData.projects[${idx}].titleAr=this.value"></div>
          <div class="field"><label>العنوان الإنجليزي</label><input value="${(p.titleEn||'').replace(/"/g,'&quot;')}" onchange="contentData.projects[${idx}].titleEn=this.value"></div>
        </div>
        <div class="grid2" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
          <div class="field"><label>التصنيف</label><select onchange="contentData.projects[${idx}].category=this.value"><option value="defense" ${p.category==='defense'?'selected':''}>الصناعات الدفاعية</option><option value="tech" ${p.category==='tech'?'selected':''}>التقنيات</option><option value="health" ${p.category==='health'?'selected':''}>الصحة</option></select></div>
          <div class="field"><label>رابط الصورة</label><input value="${(p.img||'').replace(/"/g,'&quot;')}" onchange="contentData.projects[${idx}].img=this.value"></div>
        </div>
        <div class="field"><label>الوصف المختصر - عربي</label><textarea onchange="contentData.projects[${idx}].descAr=this.value">${p.descAr||''}</textarea></div>
        <div class="field"><label>الوصف المختصر - إنجليزي</label><textarea onchange="contentData.projects[${idx}].descEn=this.value">${p.descEn||''}</textarea></div>
      </div>
    `;
    list.appendChild(row);
  });
}

window.toggleEdit = (idx)=>{
  const el = document.getElementById('edit-'+idx);
  el.style.display = el.style.display==='flex'?'none':'flex';
};

window.removeProject = (idx)=>{
  if(confirm('هل تريد حذف هذا المشروع نهائياً؟')){
    contentData.projects.splice(idx,1);
    renderProjects();
    document.getElementById('projCount').textContent = contentData.projects.length;
  }
};

document.getElementById('addProject').addEventListener('click',()=>{
  contentData.projects.push({
    id:Date.now(),category:'tech',titleAr:'مشروع جديد',titleEn:'New Project',tagAr:'التقنيات',tagEn:'Technologies',descAr:'وصف مختصر للمشروع',descEn:'Short description',img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',detailsAr:'',detailsEn:''
  });
  renderProjects();
  document.getElementById('projCount').textContent = contentData.projects.length;
});

saveAll.addEventListener('click', async ()=>{
  contentData.home.heroTitleAr = document.getElementById('hTitleAr').value;
  contentData.home.heroTitleEn = document.getElementById('hTitleEn').value;
  contentData.home.heroSubtitleAr = document.getElementById('hSubAr').value;
  contentData.home.heroSubtitleEn = document.getElementById('hSubEn').value;
  contentData.site.email = document.getElementById('cEmail').value;
  contentData.site.phone = document.getElementById('cPhone').value;
  contentData.site.addressAr = document.getElementById('cAddrAr').value;
  contentData.site.addressEn = document.getElementById('cAddrEn').value;
  if(!supabaseClient) await initSupabase();
  const {error} = await supabaseClient.from('site_content').upsert({key:'main',content:contentData},{onConflict:'key'});
  if(error){ showToast('فشل الحفظ'); return; }
  showToast('تم حفظ جميع التغييرات بنجاح');
});

function showToast(msg){
  toast.textContent=msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3500);
}

(async()=>{
  if(localStorage.getItem('irg_admin_auth')==='true'){
    loginScreen.style.display='none';
    dashboard.style.display='grid';
    await initSupabase();
    loadContent();
  }
})();
