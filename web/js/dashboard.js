const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    alert('Please login first!');
    window.location.href = 'login.html';
} else if (currentUser.role !== 'admin') {
    alert('Access restricted to Admin only!');
    window.location.href = 'user-dashboard.html';
} else {
    // Showing user's name in navbar and welcome greeting
    document.getElementById('userName').innerText = currentUser.name ?? '';
    document.getElementById('welcomeName').innerText = currentUser.name ?? '';
}

// Reading all registered users from localStorage
const users = (JSON.parse(localStorage.getItem('users')) || []).map(function (user) {
    user = user || {};
    return {
        id: user.id ?? null,
        name: user.name ?? '',
        email: user.email ?? '',
        password: user.password ?? '',
        gender: user.gender ?? ''
    };
});

// Counting Total, Male, and Female users
const totalUsers = users.length;

const maleUsers = users.filter(function (user) {
    return user.gender === 'Male';
}).length;

const femaleUsers = users.filter(function (user) {
    return user.gender === 'Female';
}).length;

// Updating the numbers on the screen
document.getElementById('totalUsersCount').innerText = totalUsers;
document.getElementById('maleUsersCount').innerText = maleUsers;
document.getElementById('femaleUsersCount').innerText = femaleUsers;

//Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('currentUser');

    window.location.href = 'login.html';
});
