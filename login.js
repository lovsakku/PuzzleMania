document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const gameContainer = document.getElementById('game-container');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const logoutButton = document.getElementById('logout');

    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'flex';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();

        signupError.textContent = '';

        if (!username || !password || !name || !email || !address || !phone) {
            signupError.textContent = 'All fields are required.';
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            signupError.textContent = 'Username already exists!';
            return;
        }

        users[username] = { password, name, email, address, phone };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login.');
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        loginError.textContent = '';

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (!users[username] || users[username].password !== password) {
            loginError.textContent = 'Invalid username or password!';
            return;
        }

        localStorage.setItem('currentUser', username); // Set currentUser in local storage
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'flex';
    });

    logoutButton.addEventListener('click', () => {
        gameContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        localStorage.removeItem('currentUser');
    });
});
