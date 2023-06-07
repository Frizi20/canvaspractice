const listInput = document.getElementById('list');
const addButton = document.getElementById('addButton');
const shoppingList = document.getElementById('shoppingList');


addButton.addEventListener('click', (event) => {
    const li = document.createElement('li');
	const inputValue = listInput.value

	if(inputValue.length < 1 ){
		return 
	}

    li.textContent = inputValue;

    shoppingList.appendChild(li);
});
