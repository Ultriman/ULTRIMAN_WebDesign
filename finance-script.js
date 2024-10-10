// Cek apakah pengguna sudah login
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) {
        // Jika tidak ada pengguna yang login, arahkan ke halaman login
        window.location.href = 'index.html';
    } else {
        // Inisialisasi halaman Finance Tracker
        initializeFinanceTracker();
    }
});

// Fungsi untuk menginisialisasi Finance Tracker
function initializeFinanceTracker() {
    let transactions = [];
    let totalExpense = 0;
    let totalIncome = 0;
    let remainingBudget = 0;

    // Ambil transaksi dari localStorage berdasarkan pengguna
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    const userTransactions = JSON.parse(localStorage.getItem(`transactions_${loggedInUserEmail}`)) || [];
    const userBudget = Number(localStorage.getItem(`budget_${loggedInUserEmail}`)) || 0;
    remainingBudget = userBudget;

    transactions = userTransactions;

    updateTransactionList();
    updateBalance();

    // Event untuk logout
    document.getElementById('logoutButton').addEventListener('click', function() {
        // Arahkan ke halaman login setelah logout
        window.location.href = 'login.html';  // Ganti dengan path file login kamu
    });

    // Event untuk menyimpan anggaran
    const budgetModal = document.getElementById('budgetModal');
    const btnShowBudgetModal = document.getElementById('showBudgetModal');
    const btnCloseBudgetModal = document.getElementById('closeBudgetModal');

    btnShowBudgetModal.addEventListener('click', () => {
        budgetModal.style.display = 'flex';
    });

    btnCloseBudgetModal.addEventListener('click', () => {
        budgetModal.style.display = 'none';
    });

    document.getElementById('saveBudget').addEventListener('click', () => {
        const budget = Number(document.getElementById('setBudget').value);
        if (budget > 0) {
            remainingBudget = budget;
            localStorage.setItem(`budget_${loggedInUserEmail}`, budget);
            document.getElementById('remainingBudget').innerText = `Rp${budget}`;
            budgetModal.style.display = 'none'; // Sembunyikan modal setelah simpan
            updateBalance();
        }
    });

    // Event untuk menambahkan transaksi
    const transactionModal = document.getElementById('transactionModal');
    const btnShowTransactionModal = document.getElementById('showTransactionModal');
    const btnCloseTransactionModal = document.getElementById('closeTransactionModal');

    btnShowTransactionModal.addEventListener('click', () => {
        transactionModal.style.display = 'flex';
    });

    btnCloseTransactionModal.addEventListener('click', () => {
        transactionModal.style.display = 'none';
    });

    document.getElementById('addTransaction').addEventListener('click', () => {
        const description = document.getElementById('description').value.trim();
        const amount = Number(document.getElementById('amount').value);
        const transactionType = document.getElementById('transactionType').value;
        const date = document.getElementById('date').value;

        if (description && amount > 0 && date) {
            const transaction = { description, amount, transactionType, date };
            transactions.push(transaction);
            localStorage.setItem(`transactions_${loggedInUserEmail}`, JSON.stringify(transactions));
            transactionModal.style.display = 'none'; // Tutup modal setelah menambahkan transaksi
            addTransactionToList(transaction);
            updateBalance();

            // Reset form
            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
            document.getElementById('date').value = '';
        }
    });

    // Update saldo dan sisa anggaran
    function updateBalance() {
        totalExpense = 0;
        totalIncome = 0;

        transactions.forEach(transaction => {
            if (transaction.transactionType === 'pengeluaran') {
                totalExpense += transaction.amount;
            } else if (transaction.transactionType === 'pemasukan') {
                totalIncome += transaction.amount;
                remainingBudget += transaction.amount; // Tambahkan pemasukan ke anggaran
            }
        });

        const remaining = remainingBudget - totalExpense;

        document.getElementById('totalBalance').innerText = `Rp${totalExpense}`;
        document.getElementById('remainingBudget').innerText = `Rp${remaining >= 0 ? remaining : 0}`;

        // Update progress bar
        const usagePercentage = remainingBudget > 0 ? (totalExpense / remainingBudget) * 100 : 0;
        const percentage = usagePercentage > 100 ? 100 : usagePercentage;

        document.getElementById('budgetUsage').value = percentage;
        document.getElementById('percentageUsed').innerText = `${percentage.toFixed(2)}% Used`;
    }

    // Update daftar transaksi
    function updateTransactionList() {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';

        transactions.forEach(transaction => {
            addTransactionToList(transaction);
        });
    }

    // Menambahkan transaksi ke daftar di DOM
    function addTransactionToList(transaction) {
        const transactionList = document.getElementById('transactionList');
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${transaction.description} (${transaction.date})</span>
            <span>${transaction.transactionType === 'pengeluaran' ? '-' : '+'}Rp${transaction.amount}</span>
        `;
        transactionList.appendChild(listItem);
    }
}
