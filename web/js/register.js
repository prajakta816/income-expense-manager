document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    const gender = document.getElementById('gender').value;

    const registerBtn = document.getElementById('registerBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');

    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }

    if (!gender) {
        alert('Please select your gender!');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const emailExists = users.some(function (user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });

    if (emailExists) {
        alert('User already registered with this email! Please login.');
        return;
    }

    // Start 2-Second Loader (Prebuilt Bootstrap Spinner)
    btnSpinner.classList.remove('d-none');
    btnText.innerText = 'Registering...';
    registerBtn.disabled = true;

    setTimeout(function () {
        // Stop Loader
        btnSpinner.classList.add('d-none');
        btnText.innerText = 'Register';
        registerBtn.disabled = false;

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            gender: gender
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Prebuilt Bootstrap Toast trigger notification
        const toastElement = document.getElementById('liveToast');
        bootstrap.Toast.getOrCreateInstance(toastElement).show();

        document.getElementById('registerForm').reset();
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 1500);

    }, 2000); // 2-second loader
});
