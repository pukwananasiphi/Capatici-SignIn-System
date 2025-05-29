// ✅ 1. Supabase Client Setup (First!)
const SUPABASE_URL = 'https://kpngseysyicyhsezucsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbmdzZXlzeWljeWhzZXp1Y3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MzAwNzYsImV4cCI6MjA2NDAwNjA3Nn0.WxIXf3I67IYtihZOoXSo_flmxCC5HKnLImIFayfjHf0';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ 2. Toast Notification
function createToast({ title, description, variant = 'success' }) {
    const toast = document.createElement('div');
    toast.className = `toast-container ${variant === 'destructive' ? 'toast-error' : 'toast-success'}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ✅ 3. Login Handler
async function handleLogin(email, password, button, spinner, buttonText) {
    if (!email || !password) {
        createToast({
            title: "Error",
            description: "Please enter both email and password",
            variant: "destructive"
        });
        return;
    }

    button.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'Logging in...';

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: profile, error: profileError } = await client
        .from('users')
        .select('role')
        .eq('email', email)
        .single();


        if (!profile || !profile.role) {
            throw new Error('User role not found');
        }

        const role = profile.role.toLowerCase();
        console.log('Logged in as:', role);

        createToast({
            title: "Login Successful",
            description: `Redirecting as ${role}`
        });

        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = 'AdminDashboard.html';
            } else {
                window.location.href = 'facial-capture.html';
            }
        }, 1500);

    } catch (err) {
        console.error('Login error:', err.message);
        createToast({
            title: "Login Failed",
            description: err.message,
            variant: "destructive"
        });
    } finally {
        button.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = 'Login';
    }
}

// ✅ 4. Desktop Login Form
document.getElementById('desktop-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin(
        document.getElementById('email').value,
        document.getElementById('password').value,
        document.getElementById('desktop-login-button'),
        document.getElementById('desktop-spinner'),
        document.getElementById('desktop-button-text')
    );
});

// ✅ 5. Mobile Login Form
document.getElementById('mobile-login-form-element')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin(
        document.getElementById('mobileEmail').value,
        document.getElementById('mobilePassword').value,
        document.getElementById('mobile-submit-button'),
        document.getElementById('mobile-spinner'),
        document.getElementById('mobile-button-text')
    );
});
