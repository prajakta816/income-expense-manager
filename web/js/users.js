// 1. Auth Guard
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    alert('Please login first!');
    window.location.href = 'login.html';
} else {
    document.getElementById('userName').innerText = currentUser.name;
}

// 2. Logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// 3. Helper: Show Toast
function showToast(message) {
    document.getElementById('toastMsg').innerText = message;
    bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast')).show();
}

// 4. Render Users Table
function renderTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('tableBody');

    tableBody.innerHTML = '';

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:rgba(255,255,255,0.5);">No users found.</td></tr>';
        return;
    }

    users.forEach(function (user, index) {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.gender}</td>
                <td>
                    <button class="edit-btn" onclick="openEditModal(${user.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// 5. Reset Modal fields when opening for Add
document.getElementById('userModal').addEventListener('show.bs.modal', function () {
    if (!document.getElementById('userId').value) {
        document.getElementById('modalTitle').innerText = 'Add User';
        document.getElementById('saveText').innerText = 'Save';
        document.getElementById('userName2').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userPassword').value = '';
        document.getElementById('userGender').value = '';
    }
});

document.getElementById('userModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('userId').value = '';
});

// 6. Save Button: Add or Edit
document.getElementById('saveBtn').addEventListener('click', function () {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName2').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const gender = document.getElementById('userGender').value;

    if (!name || !email || !password || !gender) {
        alert('Please fill all fields!');
        return;
    }

    const spinner = document.getElementById('saveSpinner');
    const saveText = document.getElementById('saveText');
    const saveBtn = document.getElementById('saveBtn');

    // 2-second Loader
    spinner.classList.remove('d-none');
    saveText.innerText = 'Saving...';
    saveBtn.disabled = true;

    setTimeout(function () {
        spinner.classList.add('d-none');
        saveText.innerText = 'Save';
        saveBtn.disabled = false;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (id) {
            // EDIT existing user
            users = users.map(function (user) {
                if (user.id == id) {
                    return { id: user.id, name: name, email: email, password: password, gender: gender };
                }
                return user;
            });
            showToast('✅ User updated successfully!');
        } else {
            // ADD new user
            const emailExists = users.some(function (user) {
                return user.email.toLowerCase() === email.toLowerCase();
            });
            if (emailExists) {
                alert('Email already exists!');
                return;
            }
            users.push({ id: Date.now(), name: name, email: email, password: password, gender: gender });
            showToast('🎉 User added successfully!');
        }

        localStorage.setItem('users', JSON.stringify(users));
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        renderTable();

    }, 2000);
});

// 7. Open Edit Modal with pre-filled data
function openEditModal(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(function (u) { return u.id === id; });

    if (!user) return;

    document.getElementById('userId').value = user.id;
    document.getElementById('modalTitle').innerText = 'Edit User';
    document.getElementById('saveText').innerText = 'Update';
    document.getElementById('userName2').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = user.password;
    document.getElementById('userGender').value = user.gender;

    // Prebuilt: Bootstrap Modal open
    new bootstrap.Modal(document.getElementById('userModal')).show();
}

// 8. Delete User
function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(function (user) { return user.id !== id; });

    localStorage.setItem('users', JSON.stringify(users));
    showToast('🗑️ User deleted successfully!');
    renderTable();
}

// Load table when page opens
renderTable();
