// Menampilkan halaman login secara default
document.addEventListener('DOMContentLoaded', () => {
    showLogin();
});

// Fungsi untuk menampilkan halaman login
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';
    clearMessages();
}

// Fungsi untuk menampilkan halaman register
function showRegister() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
    clearMessages();
}

// Membersihkan pesan error dan success
function clearMessages() {
    document.getElementById('loginError').innerText = '';
    document.getElementById('registerError').innerText = '';
    document.getElementById('registerSuccess').innerText = '';
}

// Menangani proses registrasi
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validasi input
    if (password !== confirmPassword) {
        document.getElementById('registerError').innerText = 'Password dan Konfirmasi Password tidak cocok.';
        return;
    }

    // Cek apakah email sudah terdaftar
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        document.getElementById('registerError').innerText = 'Email sudah terdaftar. Silakan login.';
        return;
    }

    // Simpan pengguna baru
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Tampilkan pesan sukses dan beralih ke login
    document.getElementById('registerSuccess').innerText = 'Registrasi berhasil! Silakan login.';
    document.getElementById('registerForm').reset();
});

// Menangani proses login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find(user => user.email === email && user.password === password);

    if (matchedUser) {
        // Simpan status login (misalnya, simpan email pengguna yang login)
        localStorage.setItem('loggedInUser', email);
        // Redirect ke halaman Finance Tracker
        window.location.href = 'finance-tracker.html';
    } else {
        document.getElementById('loginError').innerText = 'Email atau Password salah.';
    }
});
