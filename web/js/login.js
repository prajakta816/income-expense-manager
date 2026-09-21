document.getElementById(`loginForm`).addEventListener(`submit`,
    function (event) {
        event.preventDefault();

        const email = document.getElementById(`email`).value.trim();
        const password = document.getElementById(`password`).value;

        const loginBtn = document.getElementById(`loginBtn`);
        const btnSpinner = document.getElementById(`btnSpinner`);
        const btnText = document.getElementById(`btnText`);

        //prebuilt bootstrap  spinner 
        btnSpinner.classList.remove('d-none');
        btnText.innerText = 'Logging in...';
        loginBtn.disabled = true;

        //this function which will make this 2 second 
        setTimeout(function () {
            // Stop Loader
            btnSpinner.classList.add('d-none');
            btnText.innerText = 'Login';
            loginBtn.disabled = false;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const validUser = users.find(function (user) {
                return user.email.toLowerCase() === email.toLowerCase() && user.password === password;//we only use .tolowercase because of email can have different captial and small letters and password will be case sensitive and we used === here because of security reasons as it checks both value and type  
            });

            if (!validUser) {
                alert('Invalid Email or Password!');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(validUser));

            //prebuilt bootstrap toast 
            const toastElement = document.getElementById('liveToast');
            bootstrap.Toast.getOrCreateInstance(toastElement).show();

            document.getElementById('loginForm').reset();
            setTimeout(function () {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 2000);

    });