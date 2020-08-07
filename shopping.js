console.log('it works');
const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// We need an array to hold or  STATE or store the values
let items = []; // let

// Handling Submit
const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.currentTarget.item.value;
    // If it's empty don't submit
    if (!name) return;
    // Create object to store
    const item = {
        name,
        id: Date.now(),
        complete: false,
    }
    // Push to the item state
    items.push(item)
    console.log(`${items.length}`);

    // Reseting the form
    event.target.reset();
    // Fire off acustom event (Dispatch) that will tell anyone else who cares 
    list.dispatchEvent(new CustomEvent('itemUpdated'));
}

// Looping through the array items(state)
const displayItems = () => {
    const html = items.map(item => `
    <li class="shopping-item">
        <input value="${item.id}" type="checkbox" ${item.complete ? "checked" : ""}>
        <span class="itemName">${item.name}</span>
        <button aria-label="Remove ${item.name}" value="${item.id}">&times;</button>
    </li>`)
    .join('');
    list.innerHTML = html;
}

// Mirror the item to local storage
const mirrorToTheLocalStorage = () => {
    localStorage.setItem('items', JSON.stringify(items))
};

// Restore from local Storage
const restoreFromTheLocalStorage = () => {
    const lsItems = JSON.parse(localStorage.getItem('items'));
    console.log(lsItems)
    if (lsItems) {
        items.push(...lsItems); // Spread
        list.dispatchEvent(new CustomEvent('itemUpdated'));
    }    
};

// Delete Item
const deleteItem = (id) => {
    console.log(id);
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemUpdated'));
}

// Handling the checkbox
const markAsComplete = (id) => {
    console.log(id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete; // Check whether it is complete or not
    list.dispatchEvent(new CustomEvent('itemUpdated'));
}

// Submit form
shoppingForm.addEventListener('submit', handleSubmit);

// Display Item
list.addEventListener('itemUpdated', displayItems);

// Mirror to the local storage
list.addEventListener('itemUpdated', mirrorToTheLocalStorage);

// Delete and check(checkbox) the list items
list.addEventListener('click', (e) => {
    const id = Number(e.target.value); // Grabbing and converting thr id into number
    // Delete button
    if (e.target.matches('button')) {
        deleteItem(id);
    }
    // Checkbox if the items are complete
    if (e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
});

// Restore from the local storage
restoreFromTheLocalStorage();
