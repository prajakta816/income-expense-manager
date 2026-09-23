// 1. Auth Guard
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    alert('Please login first!');
    window.location.href = 'login.html';
} else {
    document.getElementById('userName').innerText = currentUser.name ?? 'User';
    document.getElementById('welcomeName').innerText = currentUser.name ?? 'User';
}

// Key for storing user-specific transactions
const storageKey = `transactions_${currentUser ? currentUser.id : 'guest'}`;

// Helper: Toast notification
function showToast(message) {
    document.getElementById('toastMsg').innerText = message;
    bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast')).show();
}

// Get user's transactions
function getTransactions() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
}

// Save user's transactions
function saveTransactions(list) {
    localStorage.setItem(storageKey, JSON.stringify(list));
}

// 2. Render Cards & Transactions Table
function renderDashboard() {
    const transactions = getTransactions();
    const filterType = document.getElementById('filterType').value;
    const searchKeyword = document.getElementById('searchKeyword').value.toLowerCase().trim();

    // Summary calculations
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (tx) {
        const amt = parseFloat(tx.amount) || 0;
        if (tx.type === 'Income') {
            totalIncome += amt;
        } else {
            totalExpense += amt;
        }
    });

    const netBalance = totalIncome - totalExpense;

    document.getElementById('totalIncome').innerText = `₹${totalIncome.toLocaleString('en-IN')}`;
    document.getElementById('totalExpense').innerText = `₹${totalExpense.toLocaleString('en-IN')}`;
    
    const netEl = document.getElementById('netBalance');
    netEl.innerText = `₹${netBalance.toLocaleString('en-IN')}`;
    netEl.style.color = netBalance >= 0 ? '#00bfff' : '#ff4d4f';

    // Filtering for Table
    const filtered = transactions.filter(function (tx) {
        const matchesType = (filterType === 'All' || tx.type === filterType);
        const matchesSearch = (tx.title.toLowerCase().includes(searchKeyword) || tx.category.toLowerCase().includes(searchKeyword));
        return matchesType && matchesSearch;
    });

    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:rgba(255,255,255,0.5);">No transactions found.</td></tr>';
        return;
    }

    filtered.forEach(function (tx, index) {
        const isIncome = tx.type === 'Income';
        const typeBadge = isIncome
            ? `<span class="badge bg-success">Income</span>`
            : `<span class="badge bg-danger">Expense</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${tx.title}</td>
                <td>${typeBadge}</td>
                <td>${tx.category}</td>
                <td class="${isIncome ? 'text-success' : 'text-danger'} fw-bold">
                    ${isIncome ? '+' : '-'} ₹${parseFloat(tx.amount).toLocaleString('en-IN')}
                </td>
                <td>${tx.date}</td>
                <td>
                    <button class="edit-btn" onclick="openEditTransactionModal(${tx.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteTransaction(${tx.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// 3. Reset Modal for Add
document.getElementById('transactionModal').addEventListener('show.bs.modal', function () {
    if (!document.getElementById('transactionId').value) {
        document.getElementById('transactionModalTitle').innerText = 'Add Transaction';
        document.getElementById('txSaveText').innerText = 'Save Entry';
        document.getElementById('transactionTitle').value = '';
        document.getElementById('transactionAmount').value = '';
        document.getElementById('transactionType').value = 'Income';
        document.getElementById('transactionCategory').value = 'Salary';
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    }
});

document.getElementById('transactionModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('transactionId').value = '';
});

// 4. Save/Update Transaction
document.getElementById('saveTransactionBtn').addEventListener('click', function () {
    const id = document.getElementById('transactionId').value;
    const title = document.getElementById('transactionTitle').value.trim();
    const amount = document.getElementById('transactionAmount').value;
    const type = document.getElementById('transactionType').value;
    const category = document.getElementById('transactionCategory').value;
    const date = document.getElementById('transactionDate').value;

    if (!title || !amount || !type || !category || !date) {
        alert('Please fill in all transaction fields!');
        return;
    }

    const spinner = document.getElementById('txSpinner');
    const btnText = document.getElementById('txSaveText');
    const saveBtn = document.getElementById('saveTransactionBtn');

    spinner.classList.remove('d-none');
    btnText.innerText = 'Saving...';
    saveBtn.disabled = true;

    setTimeout(function () {
        spinner.classList.add('d-none');
        btnText.innerText = 'Save Entry';
        saveBtn.disabled = false;

        let transactions = getTransactions();

        if (id) {
            transactions = transactions.map(function (tx) {
                if (tx.id == id) {
                    return { id: tx.id, title, amount: parseFloat(amount), type, category, date };
                }
                return tx;
            });
            showToast('Transaction updated!');
        } else {
            transactions.push({
                id: Date.now(),
                title,
                amount: parseFloat(amount),
                type,
                category,
                date
            });
            showToast('Transaction added!');
        }

        saveTransactions(transactions);
        bootstrap.Modal.getInstance(document.getElementById('transactionModal')).hide();
        renderDashboard();
    }, 800);
});

// 5. Open Edit Modal
function openEditTransactionModal(id) {
    const transactions = getTransactions();
    const tx = transactions.find(function (item) { return item.id === id; });

    if (!tx) return;

    document.getElementById('transactionId').value = tx.id;
    document.getElementById('transactionModalTitle').innerText = 'Edit Transaction';
    document.getElementById('txSaveText').innerText = 'Update Entry';
    document.getElementById('transactionTitle').value = tx.title;
    document.getElementById('transactionAmount').value = tx.amount;
    document.getElementById('transactionType').value = tx.type;
    document.getElementById('transactionCategory').value = tx.category;
    document.getElementById('transactionDate').value = tx.date;

    new bootstrap.Modal(document.getElementById('transactionModal')).show();
}

// 6. Delete Transaction
function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction entry?')) return;

    let transactions = getTransactions();
    transactions = transactions.filter(function (tx) { return tx.id !== id; });

    saveTransactions(transactions);
    showToast('Transaction deleted!');
    renderDashboard();
}

// Search and Filter Listeners
document.getElementById('filterType').addEventListener('change', renderDashboard);
document.getElementById('searchKeyword').addEventListener('input', renderDashboard);

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Initial Render
renderDashboard();
