const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

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
  } else {
    loginError.textContent = 'بيانات الدخول غير صحيحة / Invalid credentials';
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
    const el = document.getElementById(target);
    if (el) el.classList.add('active');
    const titles = {
      overview: 'نظرة عامة / Overview',
      pages: 'إدارة الصفحات / Pages',
      projects: 'إدارة المشاريع / Projects',
      gallery: 'معرض الصور / Gallery',
      settings: 'إعدادات الموقع / Settings',
      users: 'إدارة المستخدمين / Users'
    };
    pageTitle.textContent = titles[target] || 'لوحة التحكم / Dashboard';
  });
});

if (localStorage.getItem('irg_admin_auth') === 'true') {
  loginScreen.style.display = 'none';
  dashboard.style.display = 'block';
}
