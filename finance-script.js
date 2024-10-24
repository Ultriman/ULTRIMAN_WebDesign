// Cek apakah pengguna sudah login
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) {
        window.location.href = 'login.html';
    } else {
        initializeFinanceTracker();
    }
});

function initializeFinanceTracker() {
    let transactions = [];
    let totalExpense = 0;
    let totalIncome = 0;
    let remainingBudget = 0;

    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    const userTransactions = JSON.parse(localStorage.getItem(`transactions_${loggedInUserEmail}`)) || [];
    const userBudget = Number(localStorage.getItem(`budget_${loggedInUserEmail}`)) || 0;
    remainingBudget = userBudget;
    transactions = userTransactions;

    updateTransactionList();
    updateBalance();

    document.getElementById('logoutButton').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    document.getElementById('clearDataButton').addEventListener('click', function() {
        // Konfirmasi sebelum menghapus data
        if (confirm('Are you sure you want to clear all data?')) {
            localStorage.removeItem(`transactions_${loggedInUserEmail}`);
            localStorage.removeItem(`budget_${loggedInUserEmail}`);
            transactions = [];
            remainingBudget = 0;
            updateTransactionList();
            updateBalance();
            alert('Data cleared successfully!');
        }
    });

    const budgetModal = document.getElementById('budgetModal');
    document.getElementById('showBudgetModal').addEventListener('click', () => {
        budgetModal.style.display = 'flex';
    });
    document.getElementById('closeBudgetModal').addEventListener('click', () => {
        budgetModal.style.display = 'none';
    });

    document.getElementById('saveBudget').addEventListener('click', () => {
        const budget = Number(document.getElementById('setBudget').value);
        if (budget > 0) {
            remainingBudget = budget;
            localStorage.setItem(`budget_${loggedInUserEmail}`, budget);
            document.getElementById('remainingBudget').innerText = `Rp${budget}`;
            budgetModal.style.display = 'none';
            updateBalance();
        }
    });

    const transactionModal = document.getElementById('transactionModal');
    document.getElementById('showTransactionModal').addEventListener('click', () => {
        transactionModal.style.display = 'flex';
    });
    document.getElementById('closeTransactionModal').addEventListener('click', () => {
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
            transactionModal.style.display = 'none';
            addTransactionToList(transaction);
            updateBalance();

            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
            document.getElementById('date').value = '';
        }
    });

    function updateBalance() {
        totalExpense = 0;
        totalIncome = 0;

        transactions.forEach(transaction => {
            if (transaction.transactionType === 'pengeluaran') {
                totalExpense += transaction.amount;
            } else if (transaction.transactionType === 'pemasukan') {
                totalIncome += transaction.amount;
                remainingBudget += transaction.amount;
            }
        });

        const remaining = remainingBudget - totalExpense;

        document.getElementById('totalBalance').innerText = `Rp${totalExpense}`;
        document.getElementById('remainingBudget').innerText = `Rp${remaining >= 0 ? remaining : 0}`;

        const usagePercentage = remainingBudget > 0 ? (totalExpense / remainingBudget) * 100 : 0;
        const percentage = usagePercentage > 100 ? 100 : usagePercentage;

        document.getElementById('budgetUsage').value = percentage;
        document.getElementById('percentageUsed').innerText = `${percentage.toFixed(2)}% Used`;
    }

    function updateTransactionList() {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';

        transactions.forEach(transaction => {
            addTransactionToList(transaction);
        });
    }

    function addTransactionToList(transaction) {
        const transactionList = document.getElementById('transactionList');
        const listItem = document.createElement('li');
        listItem.innerHTML = 
            `<span>${transaction.description} (${transaction.date})</span>
            <span>${transaction.transactionType === 'pengeluaran' ? '-' : '+'}Rp${transaction.amount}</span>`;
        transactionList.appendChild(listItem);
    }
}
