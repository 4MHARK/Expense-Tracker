const balanceElement = document.getElementById('balance');
    const moneyPlusElement = document.getElementById('money-plus');
    const moneyMinusElement = document.getElementById('money-minus');
    const listElement = document.getElementById('list');
    const form = document.getElementById('form');
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');

    // Initialize transactions array
    const transactions = getTransactionsFromLocalStorage();

    // Function to add a transaction
    function addTransaction(name, amount) {
      const transaction = {
        id: generateID(),
        name,
        amount: parseFloat(amount),
        date: new Date()
      };

      transactions.push(transaction);

      updateUI();
      updateLocalStorage();
    }

    // Function to generate a unique ID for transactions
    function generateID() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Function to update the UI
    function updateUI() {
      const totalIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) => total + transaction.amount, 0);

      const totalExpense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total + transaction.amount, 0);

      const totalBalance = totalIncome + totalExpense;

      const totalWeekExpense = getTotalInPeriod(transactions, 'week');
      const totalMonthExpense = getTotalInPeriod(transactions, 'month');

      // Update the UI elements
      balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
      moneyPlusElement.textContent = `+$${totalIncome.toFixed(2)}`;
      moneyMinusElement.textContent = `-$${totalExpense.toFixed(2)}`;

      // Clear the list and re-render transactions
      listElement.innerHTML = '';
      transactions.forEach(transaction => renderTransaction(transaction));

      console.log(`Total Expense this week: $${totalWeekExpense.toFixed(2)}`);
      console.log(`Total Expense this month: $${totalMonthExpense.toFixed(2)}`);
    }

    // Function to get total expense in a given period
    function getTotalInPeriod(transactions, period) {
      const currentDate = new Date();
      const startDate = new Date(currentDate);

      if (period === 'week') {
        startDate.setDate(currentDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(currentDate.getMonth() - 1);
      }

      return transactions
        .filter(transaction => transaction.amount < 0 && transaction.date >= startDate)
        .reduce((total, transaction) => total + transaction.amount, 0);
    }

    // Function to render a transaction in the list
    function renderTransaction(transaction) {
      const listItem = document.createElement('li');
      listItem.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
      listItem.innerHTML = `
        ${transaction.name} <span>${transaction.amount > 0 ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">&times;</button>
      `;
      listElement.appendChild(listItem);
    }

    // Function to delete a transaction
    window.deleteTransaction = function (id) {
      const index = transactions.findIndex(transaction => transaction.id === id);

      if (index !== -1) {
        transactions.splice(index, 1);
        updateUI();
        updateLocalStorage();
      }
    };

    // Function to get transactions from local storage
    function getTransactionsFromLocalStorage() {
      const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
      return localStorageTransactions !== null ? localStorageTransactions : [];
    }

    // Function to update local storage transactions
    function updateLocalStorage() {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Event listener for form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = text.value.trim();
      const transactionAmount = amount.value.trim();

      if (name && transactionAmount) {
        addTransaction(name, transactionAmount);
        text.value = '';
        amount.value = '';
      }
    });

    // Initial UI update
    updateUI();
    // Function to reset and clear history
function resetApplication() {
  const confirmation = confirm("Are you sure you want to reset and clear the transaction history?");

  if (confirmation) {
      // Clear transactions and update UI
      transactions.length = 0;
      updateUI();
      updateLocalStorage();
  }
}
