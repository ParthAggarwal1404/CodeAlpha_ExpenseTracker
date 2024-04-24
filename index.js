document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalSpan = document.getElementById('total');
    const addExpensesButton = document.getElementById('add-expenses-btn');
    const subtractExpensesButton = document.getElementById('subtract-expenses-btn');
    
    let totalExpenses = 0;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addExpense();
    });
    
    expenseList.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-btn')) {
            deleteExpense(e.target.parentNode);
        }
    });
    
    addExpensesButton.addEventListener('click', addExpenses);
    subtractExpensesButton.addEventListener('click', subtractExpenses);
    
    function addExpense() {
        const nameInput = document.getElementById('expense-name');
        const amountInput = document.getElementById('expense-amount');
        
        const name = nameInput.value;
        const amount = parseFloat(amountInput.value);
        
        if (name === '' || isNaN(amount)) {
            alert('Please enter valid expense details.');
            return;
        }
        
        const expense = {
            name: name,
            amount: amount
        };
        
        appendExpense(expense);
        totalExpenses += amount;
        updateTotalExpenses();
        saveToLocalStorage(expense);
        
        nameInput.value = '';
        amountInput.value = '';
    }
    
    function appendExpense(expense) {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: $${expense.amount.toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        li.appendChild(removeButton);
        
        expenseList.appendChild(li);
    }
    
    function deleteExpense(expenseElement) {
        const amount = parseFloat(expenseElement.textContent.split(': ')[1].slice(1));
        expenseElement.remove();
        totalExpenses -= amount;
        updateTotalExpenses();
        removeFromLocalStorage(expenseElement.textContent.split(': ')[0]);
    }
    
    function saveToLocalStorage(expense) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    function removeFromLocalStorage(name) {
        let expenses = JSON.parse(localStorage.getItem('expenses'));
        expenses = expenses.filter(expense => expense.name !== name);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    function loadExpenses() {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.forEach(expense => {
            appendExpense(expense);
            totalExpenses += expense.amount;
        });
        updateTotalExpenses();
    }
    
    function addExpenses() {
        const allExpenses = document.querySelectorAll('#expense-list li');
        allExpenses.forEach(expense => {
            const amount = parseFloat(expense.textContent.split(': ')[1].slice(1));
            totalExpenses += amount;
        });
        updateTotalExpenses();
    }
    
    function subtractExpenses() {
        const allExpenses = document.querySelectorAll('#expense-list li');
        allExpenses.forEach(expense => {
            const amount = parseFloat(expense.textContent.split(': ')[1].slice(1));
            totalExpenses -= amount;
        });
        updateTotalExpenses();
    }
    
    function updateTotalExpenses() {
        totalSpan.textContent = totalExpenses.toFixed(2);
    }
    
    loadExpenses();
});
