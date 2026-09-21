// Get the table body
const userTableBody = document.getElementById("userTableBody");

// Get users from localStorage
const users = JSON.parse(
    localStorage.getItem("users")
) || [];


// Display all users
users.forEach(function (user) {

    // Create a table row
    const row = document.createElement("tr");

    // Add user information to the row
    row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.password}</td>
        <td>
            <button onclick="editUser(${user.id})">
                Edit
            </button>

            <button onclick="deleteUser(${user.id})">
                Delete
            </button>
        </td>
    `;

    // Add row to the table
    userTableBody.appendChild(row);
});



function editUser(userId) {

    // Store the ID of the user we want to edit
    localStorage.setItem("editUserId", userId);

    // Open the user form
    window.location.href = "index.html";
}



function deleteUser(userId) {

    // Get users from localStorage
    const users = JSON.parse(
        localStorage.getItem("users")
    ) || [];

    // Keep all users except the selected user
    const updatedUsers = users.filter(function (user) {
        return user.id != userId;
    });

    // Save the updated users array
    localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
    );

    // Refresh the page
    window.location.reload();
}