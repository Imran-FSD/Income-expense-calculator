document.addEventListener('DOMContentLoaded', () => {
    loadEntries();
    updateSummary();
});

const entries = JSON.parse(localStorage.getItem('entries')) || [];

function addEntry() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description && !isNaN(amount)) {
        const entry = { description, amount, type };
        entries.push(entry);
        saveEntries();
        updateUI();
        clearForm();
    } else {
        alert('Please enter valid description and amount.');
    }
}

function updateUI() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    const entryList = document.getElementById('entry-list');
    entryList.innerHTML = '';

    entries
        .filter(entry => filter === 'all' || entry.type === filter)
        .forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${entry.description} - $${entry.amount.toFixed(2)}
                <button class="edit" onclick="editEntry(${index})">Edit</button>
                <button class="delete" onclick="deleteEntry(${index})">Delete</button>
            `;
            entryList.appendChild(li);
        });

    updateSummary();
}

function editEntry(index) {
    const description = prompt('Edit description:', entries[index].description);
    const amount = parseFloat(prompt('Edit amount:', entries[index].amount));
    const type = prompt('Edit type (income/expense):', entries[index].type);

    if (description && !isNaN(amount) && (type === 'income' || type === 'expense')) {
        entries[index] = { description, amount, type };
        saveEntries();
        updateUI();
    }
}

function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        entries.splice(index, 1);
        saveEntries();
        updateUI();
    }
}

function saveEntries() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function loadEntries() {
    updateUI();
}

function updateSummary() {
    const totalIncome = entries.filter(entry => entry.type === 'income')
        .reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = entries.filter(entry => entry.type === 'expense')
        .reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('net-balance').textContent = netBalance.toFixed(2);
}

function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}
