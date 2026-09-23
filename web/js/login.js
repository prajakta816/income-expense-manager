const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('password');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function createUserRecord(id, values) {
    values = values || {};
    return {
        id: id ?? null,//?? operator does work like if id is null then it will take null value otherwise it will take the id value.
        name: values.name ?? '',// ?? operator does work like if values.name is null then it will take null value otherwise it will take the values.name value.
        email: values.email ?? '',
        password: values.password ?? '',
        gender: values.gender ?? '',
        role: values.role ?? 'user'
    };
}

function ensureAdminExists() {
    // 1. Fetch current users list from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // 2. Check if an admin user already exists
    const hasAdmin = users.some(function (u) {
        return u.role === 'admin' || (u.email && u.email.toLowerCase() === 'admin@gmail.com');
    });

    // 3. If no admin is found, create and insert the default admin user
    if (!hasAdmin) {
        const defaultAdmin = createUserRecord(100, {
            name: 'System Admin',
            email: 'admin@gmail.com',
            password: 'AdminPassword123',
            gender: 'Male',
            role: 'admin'
        });
        users.unshift(defaultAdmin);// Add admin to the beginning of the list
        //.unshift() work is that it will add the element to the beginning of the array
        // unlike .push() which add the element to the end of the array.
        localStorage.setItem('users', JSON.stringify(users));// 4. Save the updated list back into localStorage
    }
}

// Automatically ensure default admin account exists
ensureAdminExists();

function setFieldError(input, message) {
    document.getElementById(`${input.id}Error`).textContent = message;
    input.classList.toggle('input-error', Boolean(message));
    input.setAttribute('aria-invalid', Boolean(message));
    return !message;
}

function validateLoginField(input) {
    if (input.id === 'email') {
        return setFieldError(input, !input.value.trim()
            ? 'email address is required.'
            : !emailPattern.test(input.value.trim())
                ? 'enter a valid email address.'
                : '');
    }

    return setFieldError(input, !input.value
        ? 'password is required.'
        : !passwordPattern.test(input.value)
            ? 'enter a valid password.'
            : '');
}

document.querySelectorAll('.password-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
        const passwordInput = document.getElementById(button.dataset.target);
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        button.textContent = isHidden ? 'hide' : 'show';
        button.setAttribute('aria-label', `${isHidden ? 'hide' : 'show'} password`);
        button.setAttribute('aria-pressed', String(isHidden));
    });
});

[loginEmail, loginPassword].forEach(function (input) {
    input.addEventListener('input', function () {
        validateLoginField(input);
    });
});

loginForm.addEventListener('submit',
    function (event) {
        event.preventDefault();

        const isEmailValid = validateLoginField(loginEmail);
        const isPasswordValid = validateLoginField(loginPassword);
        if (!isEmailValid || !isPasswordValid) {
            (!isEmailValid ? loginEmail : loginPassword).focus();
            return;
        }

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        const loginBtn = document.getElementById(`loginBtn`);
        const btnSpinner = document.getElementById(`btnSpinner`);
        const btnText = document.getElementById(`btnText`);

        btnSpinner.classList.remove('d-none');
        btnText.innerText = 'Logging in...';
        loginBtn.disabled = true;

        setTimeout(function () {
            btnSpinner.classList.add('d-none');
            btnText.innerText = 'Login';
            loginBtn.disabled = false;

            ensureAdminExists();

            const users = (JSON.parse(localStorage.getItem('users')) || []).map(function (user) {
                return createUserRecord(user && user.id, user);
            });
            const validUser = users.find(function (user) {
                return user.email.toLowerCase() === email.toLowerCase() && user.password === password;
            });

            if (!validUser) {
                setFieldError(loginEmail, 'invalid email or password.');
                setFieldError(loginPassword, 'invalid email or password.');
                loginPassword.focus();
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(createUserRecord(validUser.id, validUser)));

            const toastElement = document.getElementById('liveToast');
            bootstrap.Toast.getOrCreateInstance(toastElement).show();

            loginForm.reset();
            setTimeout(function () {
                if (validUser.role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }, 1500);
        }, 2000);

    });
