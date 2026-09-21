const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    alert('Please login first!');
    window.location.href = 'login.html';
} else {
    // Showing  user's name in navbar and welcome greeting
    document.getElementById('userName').innerText = currentUser.name;
    document.getElementById('welcomeName').innerText = currentUser.name;
}

// Reading all registered users from localStorage
const users = JSON.parse(localStorage.getItem('users')) || [];

// Counting Total, Male, and Female users
const totalUsers = users.length;

const maleUsers = users.filter(function (user) {
    return user.gender === 'Male';
}).length;

const femaleUsers = users.filter(function (user) {
    return user.gender === 'Female';
}).length;

// Updating  the numbers on the screen
document.getElementById('totalUsersCount').innerText = totalUsers;
document.getElementById('maleUsersCount').innerText = maleUsers;
document.getElementById('femaleUsersCount').innerText = femaleUsers;

//Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('currentUser');

    window.location.href = 'login.html';
});
