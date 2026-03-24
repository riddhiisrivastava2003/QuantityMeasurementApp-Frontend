const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginTab.addEventListener('click', () => {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
});

signupTab.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
});
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // fake login (later backend se connect karenge)
  window.location.href = "dashboard.html";
});

const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  localStorage.setItem('theme', theme);
}

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}
