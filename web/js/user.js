// Get the form from HTML
const userForm = document.getElementById("userForm");

// Listen for form submission
userForm.addEventListener("submit", function (event) {

    // Stop the browser from refreshing the page
    event.preventDefault();

    // Get values entered by the user
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    // Create a user object
    const user = {
        id: Date.now(),
        username: username,
        email: email,
        phone: phone,
        password: password
    };

    // Get existing users from localStorage
    const users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    // Add the new user to the array
    users.push(user);

    // Save the updated users array to localStorage
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    // Clear the form after successful creation
    userForm.reset();

    // Check the created user in the browser console
    console.log("User created:", user);
});