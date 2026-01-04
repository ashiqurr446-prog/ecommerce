document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const loginUrl = API_BASE + '/api/users/login';
    console.log('Logging in to:', loginUrl);
    
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('🧠 Login Response:', data);

  if (res.ok) {
  if (!data.token) {
    console.warn('❌ No token in response!');
    alert('Login failed: No token received from server');
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.user.username);
  localStorage.setItem('role', data.user.role);  // save role too
  localStorage.setItem('userId', data.user.id);  // save userId for seller filtering

  console.log('✅ Token saved:', data.token.substring(0, 30) + '...');
  console.log('✅ Role:', data.user.role);

  setTimeout(() => {
    
    if (data.user.role === 'admin') {
      window.location.href = 'admin.html';
    } else if (data.user.role === 'seller') {
      window.location.href = 'seller.html';
    } else {
      window.location.href = 'home.html';
    }
  }, 100);
}
 else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Something went wrong: ' + err.message);
  }
});
