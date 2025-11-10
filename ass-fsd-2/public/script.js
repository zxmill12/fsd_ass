// Helper: show messages in #message using DOM
function showMessage(text, type = 'info') {
  const el = document.getElementById('message');
  el.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}

// Read cookie helper
function getCookie(name) {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? v.pop() : '';
}

// Register form
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;

  // Client-side validations
  if (!fullname || !email || !phone || !password)
    return showMessage('All fields required', 'warning');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email))
    return showMessage('Invalid email format', 'warning');

  const phoneRe = /^\d{10,15}$/;
  if (!phoneRe.test(phone))
    return showMessage('Phone must be digits only (10-15 digits)', 'warning');

  const passRe = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:";'<>?,.\/]).{8,}$/;
  if (!passRe.test(password))
    return showMessage('Password should be 8+ chars including a number and special char', 'warning');

  // Instead of sending to the server/DB, store users in localStorage
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // check duplicate email
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return showMessage('Email already registered (local)', 'danger');
    }

    const user = {
      id: Date.now(),
      fullname,
      email,
      phone,
      password, // NOTE: storing raw password in localStorage is insecure; acceptable for local/demo only
      created_at: new Date().toISOString()
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    // set a cookie for welcome (keeps previous UI behavior)
    document.cookie = `welcome=Welcome ${fullname}; path=/; max-age=${60 * 60 * 24}`;

    // mark current user in localStorage for profile loading
    localStorage.setItem('currentUserEmail', email);

    showMessage('Registration successful (saved to localStorage)', 'success');

    // show cookie value (example of DOM usage)
    setTimeout(() => {
      const welcome = getCookie('welcome');
      if (welcome)
        showMessage(welcome + ' — registration complete', 'success');

      // load profile from localStorage after successful registration
      loadProfile();
    }, 300);
  } catch (err) {
    console.error(err);
    showMessage('Storage error', 'danger');
  }
});

// Example of loading profile data after registration/login
async function loadProfile() {
  // Load profile from localStorage (client-side only)
  try {
    const currentEmail = localStorage.getItem('currentUserEmail');
    if (!currentEmail) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === currentEmail.toLowerCase());
    if (!user) return;
    const p = document.getElementById('profileData');
    p.innerHTML = `
      <p><strong>${user.fullname}</strong></p>
      <p>${user.email}</p>
      <p>${user.phone}</p>
      <p>Joined: ${new Date(user.created_at).toLocaleString()}</p>
    `;
    document.getElementById('profileCard').style.display = 'block';
  } catch (err) {
    console.error(err);
  }
}
