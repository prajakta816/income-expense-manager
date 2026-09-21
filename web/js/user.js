// Get the user form
const userForm = document.getElementById("userForm");

// Check if we are editing an existing user
const editUserId = localStorage.getItem("editUserId");

// If editUserId exists, load the user's data
if (editUserId) {

    // Get users from localStorage
    const users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    // Find the user being edited
    const user = users.find(function (user) {
        return user.id == editUserId;
    });

    // If the user exists, fill the form
    if (user) {

        document.getElementById("username").value = user.username;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
        document.getElementById("password").value = user.password;
    }
}


// Listen for form submission
userForm.addEventListener("submit", function (event) {

    // Stop the browser from refreshing
    event.preventDefault();

    // Get values from the form
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    // Get existing users
    const users = JSON.parse(
        localStorage.getItem("users")
    ) || [];


    // =========================
    // UPDATE USER
    // =========================

    if (editUserId) {

        // Find the position of the user
        const userIndex = users.findIndex(function (user) {
            return user.id == editUserId;
        });

        // Check if user was found
        if (userIndex !== -1) {

            // Update user details
            users[userIndex].username = username;
            users[userIndex].email = email;
            users[userIndex].phone = phone;
            users[userIndex].password = password;
        }

        // Save updated users
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        // Remove edit mode
        localStorage.removeItem("editUserId");

        // Go back to user list
        window.location.href = "users.html";

    }


    // =========================
    // CREATE USER
    // =========================

    else {

        // Create a new user object
        const user = {
            id: Date.now(),
            username: username,
            email: email,
            phone: phone,
            password: password
        };

        // Add new user to array
        users.push(user);

        // Save users to localStorage
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        // Clear the form
        userForm.reset();

        console.log("User created:", user);
    }

});