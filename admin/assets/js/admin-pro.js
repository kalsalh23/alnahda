let contentData = null;

const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const saveAll = document.getElementById('saveAll');
const toast = document.getElementById('toast');

const validEmail = 'alnahda27@gmail.com';
const validPass = 'reda@2027';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (email === validEmail && password === validPass) {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    localStorage.setItem('irg_admin_auth', 'true');
    loadContent();
  } else {
    loginError.textContent = 'بيانات الدخول غير صحيحة';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('irg_admin_auth');
  dashboard.style.display = 'none';
  loginScreen.style.display = 'flex';
  loginError.textContent = '';
  loginForm.reset();
  document.getElementById('email').value = validEmail;
  document.getElementById('password').value = validPass;
});

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const target = item.dataset.section;
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    const titles = {overview:'نظرة عامة / Overview', home:'الصفحة الرئيسية / Home', projects:'إدارة المشاريع / Projects', pages:'الصفحات / Pages', site:'إعدادات الموقع / Site Settings'};
    pageTitle.textContent = titles[target] || 'لوحة التحكم';
  });
});

async function loadContent(){
  try{
    const res = await fetch('data/content.json?v=' + Date.now());
    contentData = await res.json();
    fillForms();
    renderProjects();
  }catch(e){}
}

function fillForms(){
  document.getElementById('homeHeroAr').value = contentData.home.heroTitleAr || '';
  document.getElementById('homeHeroEn').value = contentData.home.heroTitleEn || '';
  document.getElementById('homeSubAr').value = contentData.home.heroSubtitleAr || '';
  document.getElementById('homeSubEn').value = contentData.home.heroSubtitleEn || '';
  document.getElementById('siteEmail').value = contentData.site.email || '';
  document.getElementById('sitePhone').value = contentData.site.phone || '';
  document.getElementById('siteAddrAr').value = contentData.site.addressAr || '';
  document.getElementById('siteAddrEn').value = contentData.site.addressEn || '';
  document.getElementById('countProjects').textContent = contentData.projects.length;
}

function renderProjects(){
  const editor = document.getElementById('projectsEditor');
  editor.innerHTML = '';
  contentData.projects.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'project-edit-card';
    card.innerHTML = `
      <div class="project-edit-header">
        <h3>${p.titleAr} / ${p.titleEn}</h3>
        <button class="btn-sm danger" onclick="removeProject(${idx})"><i class="fas fa-trash"></i></button>
      </div>
      <div class="project-edit-body">
        <div class="form-row">
          <div class="form-group"><label>العنوان - عربي</label><input value="${p.titleAr.replace(/"/g,'&quot;')}" onchange="contentData.projects[${idx}].titleAr=this.value"></div>
          <div class="form-group"><label>العنوان - إنجليزي</label><input value="${p.titleEn.replace(/"/g,'&quot;')}" onchange="contentData.projects[${idx}].titleEn=this.value"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>التصنيف</label><select onchange="contentData.projects[${idx}].category=this.value"><option value="defense" ${p.category==='defense'?'selected':''}>الصناعات الدفاعية</option><option value="tech" ${p.category==='tech'?'selected':''}>التقنيات</option><option value="health" ${p.category==='health'?'selected':''}>الصحة</option></select></div>
          <div class="form-group"><label>صورة</label><input value="${p.img.replace(/"/g,'&quot;')}" onchange="contentData.projects[${idx}].img=this.value"></div>
        </div>
        <div class="form-group"><label>وصف مختصر - عربي</label><textarea onchange="contentData.projects[${idx}].descAr=this.value">${p.descAr}</textarea></div>
        <div class="form-group"><label>وصف مختصر - إنجليزي</label><textarea onchange="contentData.projects[${idx}].descEn=this.value">${p.descEn}</textarea></div>
      </div>
    `;
    editor.appendChild(card);
  });
}

window.removeProject = (idx) => {
  if(confirm('هل تريد حذف هذا المشروع؟')) {
    contentData.projects.splice(idx,1);
    renderProjects();
    document.getElementById('countProjects').textContent = contentData.projects.length;
  }
};

document.getElementById('addProject').addEventListener('click', () => {
  contentData.projects.push({
    id: Date.now(),
    category: 'tech',
    titleAr: 'مشروع جديد',
    titleEn: 'New Project',
    tagAr: 'التقنيات',
    tagEn: 'Technologies',
    descAr: 'وصف المشروع',
    descEn: 'Project description',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
    detailsAr: '',
    detailsEn: ''
  });
  renderProjects();
  document.getElementById('countProjects').textContent = contentData.projects.length;
});

saveAll.addEventListener('click', async () => {
  contentData.home.heroTitleAr = document.getElementById('homeHeroAr').value;
  contentData.home.heroTitleEn = document.getElementById('homeHeroEn').value;
  contentData.home.heroSubtitleAr = document.getElementById('homeSubAr').value;
  contentData.home.heroSubtitleEn = document.getElementById('homeSubEn').value;
  contentData.site.email = document.getElementById('siteEmail').value;
  contentData.site.phone = document.getElementById('sitePhone').value;
  contentData.site.addressAr = document.getElementById('siteAddrAr').value;
  contentData.site.addressEn = document.getElementById('siteAddrEn').value;
  const json = JSON.stringify(contentData, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  a.click();
  showToast('تم تحميل ملف content.json. قم برفعه إلى مجلد admin/data/ في GitHub');
});

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 4000);
}

if (localStorage.getItem('irg_admin_auth') === 'true') {
  loginScreen.style.display = 'none';
  dashboard.style.display = 'block';
  loadContent();
}
