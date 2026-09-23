const registerForm = document.getElementById('registerForm');
const registerName = document.getElementById('name');
const registerEmail = document.getElementById('email');
const registerPassword = document.getElementById('password');
const registerConfirm = document.getElementById('confirm');
const registerGender = document.getElementById('gender');
const clearGenderButton = document.getElementById('clearGender');
const registerEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const registerPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Keep the saved user shape consistent. JSON.stringify omits undefined values,
// so convert every missing value to an explicit empty value before saving.
function createUserRecord(id, values) {
    values = values || {};
    return {
        id: id ?? null,
        name: values.name ?? '',
        email: values.email ?? '',
        password: values.password ?? '',
        gender: values.gender ?? '',
        role: values.role ?? 'user'
    };
}

function setRegisterFieldError(input, message)// The input parameter represents the input field element that is being validated, and the message parameter represents the error message to be displayed if the validation fails. The function sets the error message for the specified input field and toggles the error class and aria-invalid attribute based on whether there is an error message or not.
 {
    const error = document.getElementById(`${input.id}Error`);
    if (error) error.textContent = message;
    // Toggle error class and aria-invalid attribute based on the presence of an error message
    input.classList.toggle('input-error', Boolean(message));
    input.setAttribute('aria-invalid', Boolean(message));
    return !message;
}

function validateRegisterField(input)
 {
    if (input.id === 'name') {
        return setRegisterFieldError(input, !input.value.trim()
            ? 'full name is required.'
            : input.value.trim().length < 2
                ? 'enter a valid name (at least 2 characters).'
                : '');
    }

    if (input.id === 'email') {
        return setRegisterFieldError(input, !input.value.trim()
            ? 'email address is required.'
            : !registerEmailPattern.test(input.value.trim())
                ? 'enter a valid email address.'
                : '');
    }

    if (input.id === 'password') {
        return setRegisterFieldError(input, !input.value
            ? 'password is required.'
            : !registerPasswordPattern.test(input.value)
                ? 'enter a valid password (min 8 chars with uppercase, lowercase & number).'
                : '');
    }

    if (input.id === 'gender')
    {
        return setRegisterFieldError(input, !input.value ? 'please select your gender.' : '');
    }

    return setRegisterFieldError(input, !input.value
        ? 'please confirm your password.'
        : input.value !== registerPassword.value
            ? 'passwords do not match.'
            : '');
}

function updateClearGenderButton() {
    clearGenderButton.hidden = !registerGender.value;
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

[registerName, registerEmail, registerPassword, registerConfirm, registerGender].forEach(function (input) {
    input.addEventListener('input', function ()//here the input argument is coming from the forEach loop where we are iterating over each input field and adding an event listener to it. When the user types in any of these fields, the input event is triggered, and the corresponding input field is passed as an argument to the validateRegisterField function.
     {
        validateRegisterField(input);
        if (input.id === 'password' && registerConfirm.value) validateRegisterField(registerConfirm);
    });
});

registerGender.addEventListener('change', function () {
    validateRegisterField(registerGender);
    updateClearGenderButton();
});

clearGenderButton.addEventListener('click', function () {
    registerGender.value = '';
    setRegisterFieldError(registerGender, '');
    updateClearGenderButton();
    registerGender.focus();
});

registerForm.addEventListener('reset', function () {
    setTimeout(updateClearGenderButton, 0);
});

registerForm.addEventListener('submit', function (event)//input argument is coming from the event listener where we are listening for the submit event on the registerForm. When the form is submitted, the event object is passed as an argument to the callback function, allowing us to access properties and methods related to the form submission event.
 {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    const gender = document.getElementById('gender').value;

    const registerBtn = document.getElementById('registerBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');

    const isNameValid = validateRegisterField(registerName);
    const isEmailValid = validateRegisterField(registerEmail);
    const isPasswordValid = validateRegisterField(registerPassword);
    const isConfirmValid = validateRegisterField(registerConfirm);
    const isGenderValid = validateRegisterField(registerGender);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid || !isGenderValid) {
        (!isNameValid ? registerName : !isEmailValid ? registerEmail : !isPasswordValid ? registerPassword : !isConfirmValid ? registerConfirm : registerGender).focus();
        return;
    }

    let users = (JSON.parse(localStorage.getItem('users')) || []).map(function (user) {
        return createUserRecord(user && user.id, user);
    });

    const emailExists = users.some(function (user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });

    if (emailExists) {
        setRegisterFieldError(registerEmail, 'an account already exists with this email address.');
        registerEmail.focus();
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

        const newUser = createUserRecord(Date.now(), { name, email, password, gender });

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Prebuilt Bootstrap Toast trigger notification
        const toastElement = document.getElementById('liveToast');
        bootstrap.Toast.getOrCreateInstance(toastElement).show();

        registerForm.reset();
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 1500);

    }, 2000); // 2-second loader
});
