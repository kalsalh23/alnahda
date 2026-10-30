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
    dashboard.style.display = 'grid';
    localStorage.setItem('irg_admin_auth', 'true');
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
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const target = item.dataset.section;
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    const titles = {
      overview: 'نظرة عامة',
      pages: 'إدارة الصفحات',
      projects: 'إدارة المشاريع',
      gallery: 'معرض الصور',
      settings: 'إعدادات الموقع',
      users: 'إدارة المستخدمين'
    };
    pageTitle.textContent = titles[target] || 'لوحة التحكم';
  });
});

if (localStorage.getItem('irg_admin_auth') === 'true') {
  loginScreen.style.display = 'none';
  dashboard.style.display = 'grid';
}
