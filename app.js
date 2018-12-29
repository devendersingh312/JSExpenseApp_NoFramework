// Expense class: Represents a expenses.

class Expense {
    constructor(title, date, amount) {
        this.title = title;
        this.date = date;
        this.amount = amount;
    }
}

//UserInterface class: Handles UserInterface tasks.

class UserInterface {

    //List the expenses
    static displayExpenses() {
        const expenses = Storage.getExpenses();

        expenses.forEach((book) => UserInterface.addExpenseToList(book));
    }
    //Add a new expenxe
    static addExpenseToList(book) {
        const list = document.querySelector('#expense-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.date}</td>
        <td>${book.amount}</td>
        <td><a href=javascript:void(0); class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }
    // Clear fields
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#date').value = '';
        document.querySelector('#amount').value = '';
    }

    // Remove a expense
    static deleteExpense(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    //general purpose message function
    static showAlert(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${className}`;
        messageDiv.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#expense-form');
        container.insertBefore(messageDiv, form);

        //let remove the message div after 2 second time.
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
}

//Store class: Handles storage.
class Storage {
    static getExpenses() {
        let expenses;
        if (localStorage.getItem('expenses') === null) {
            expenses = [];
        }
        else {
            expenses = JSON.parse(localStorage.getItem('expenses'));
        }
        return expenses;
    }

    static addExpense(expense) {
        const expenses = Storage.getExpenses();
        //add the new expense
        expenses.push(expense);
        //now save it to localstorage again
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static removeExpense(title) {
        const expenses = Storage.getExpenses();

        expenses.forEach((expense, index) => {
            if (expense.title === title) {
                expenses.splice(index, 1);
            }
        });

        //now set it back to the local storage.
        localStorage.setItem('expenses', JSON.stringify(expenses));

    }
}


//Event : Display expenses
document.addEventListener('DOMContentLoaded', UserInterface.displayExpenses());

//Event : Add new expense
document.querySelector('#expense-form').addEventListener('submit', (e) => {

    e.preventDefault();
    //get the vaules of the input elements
    const title = document.querySelector('#title').value;
    const date = document.querySelector('#date').value;
    const amount = document.querySelector('#amount').value;
    if (title === '' || date === '' || amount === '') {
        UserInterface.showAlert('Please fill all the fields.', 'danger');
    }
    else {
        //create a new expense
        const expense = new Expense(title, date, amount);
        console.log(expense);
        UserInterface.addExpenseToList(expense);

        Storage.addExpense(expense);

        UserInterface.showAlert('Your expense is successfully addded.', 'success');

        //clear the fields after saving
        UserInterface.clearFields();
    }

});

//Event : Remove a expense
document.querySelector('#expense-list').addEventListener('click', (e) => {
    if (confirm('Are you sure, you want to remove this expense?')) {
        //remove the expense from UI
        UserInterface.deleteExpense(e.target);

        //remove the expense from local storage

        Storage.removeExpense(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
        UserInterface.showAlert('Expense is removed from the list.', 'info');
    }
});

//Event : Edit a expense
//todo