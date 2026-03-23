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