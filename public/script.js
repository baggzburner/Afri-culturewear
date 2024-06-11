document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    attachPurchaseButtonListeners();
    attachAddToCartButtonListener();
    attachCheckoutButtonListener();
    updateCartCount();
    updateOverallTotal();

    // Check if we are on the checkout page and display order summary
    if (window.location.pathname === '/checkout') {
        displayOrderSummary();
    }
});

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function attachPurchaseButtonListeners() {
    const purchaseButtons = document.querySelectorAll('[id^="purchaseButton"]');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            const name = document.getElementById(`productName${index}`).textContent;
            const price = parseFloat(document.getElementById(`productPrice${index}`).textContent.replace('$', ''));
            const quantity = parseInt(document.getElementById(`quantity${index}`).value);
            addToCart(name, price, quantity);
        });
    });
}

function attachAddToCartButtonListener() {
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const productName = document.querySelector('.product-details h1').textContent;
            const productPrice = parseFloat(document.querySelector('.product-details p:nth-of-type(2)').textContent.replace('Price: $', ''));
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(productName, productPrice, quantity);
        });
    }
}

function attachCheckoutButtonListener() {
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            sessionStorage.setItem('cart', JSON.stringify(cartItems));
            window.location.href = '/checkout';
        });
    }
}

function addToCart(name, price, quantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ name, price, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    loadCartItems();
    updateOverallTotal();
}

function deleteFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    loadCartItems();
    updateOverallTotal();
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        const itemName = document.createElement('span');
        itemName.classList.add('item-name');
        itemName.textContent = item.name;
        itemDiv.appendChild(itemName);

        const itemPrice = document.createElement('span');
        itemPrice.textContent = "$" + item.price.toFixed(2);
        itemDiv.appendChild(itemPrice);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = "1";
        quantityInput.classList.add('quantity-input');
        quantityInput.addEventListener('input', () => {
            item.quantity = parseInt(quantityInput.value);
            totalInput.value = "$" + (item.price * item.quantity).toFixed(2);
            updateCartCount();
            saveCartItems(cartItems);
            updateOverallTotal();
        });
        itemDiv.appendChild(quantityInput);

        const totalLabel = document.createElement('label');
        totalLabel.textContent = "Total:";
        itemDiv.appendChild(totalLabel);

        const totalInput = document.createElement('input');
        totalInput.type = 'text';
        totalInput.value = "$" + (item.price * item.quantity).toFixed(2);
        totalInput.readOnly = true;
        totalInput.classList.add('total-input');
        itemDiv.appendChild(totalInput);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            deleteFromCart(index);
        });
        itemDiv.appendChild(deleteButton);

        const hr = document.createElement('hr');
        hr.style.border = "none";
        hr.style.height = "2px";
        hr.style.backgroundColor = "#333";
        hr.style.margin = "10px 0";
        hr.style.fontWeight = "700";
        itemDiv.appendChild(hr);

        cartItemsContainer.appendChild(itemDiv);
    });
    updateOverallTotal();
}

function updateOverallTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const overallTotal = document.getElementById("overallTotal");
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
    });
    if (overallTotal) {
        overallTotal.value = "$" + total.toFixed(2);
    }
    const overallTotalInput = document.getElementById("overallTotalInput");
    if (overallTotalInput) {
        overallTotalInput.value = "$" + total.toFixed(2);
    }
}

function saveCartItems(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function openCart() {
    document.getElementById("mySidebar").style.width = "300px";
}

function closeCart() {
    document.getElementById("mySidebar").style.width = "0";
}

// Checkout Page Order Summary
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/checkout') {
        displayOrderSummary();
    }
});

function displayOrderSummary() {
    const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const orderSummaryContainer = document.getElementById('orderSummary');
    orderSummaryContainer.innerHTML = '';

    if (cartItems.length === 0) {
        orderSummaryContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    const ul = document.createElement('ul');

    cartItems.forEach(item => {
        const li = document.createElement('li');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        nameSpan.style.color = 'black';
        li.appendChild(nameSpan);

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `$${item.price.toFixed(2)}`;
        priceSpan.style.color = 'black';
        li.appendChild(priceSpan);

        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = `Quantity: ${item.quantity}`;
        quantitySpan.style.color = 'black';
        li.appendChild(quantitySpan);

        const totalSpan = document.createElement('span');
        totalSpan.textContent = `Total: $${(item.price * item.quantity).toFixed(2)}`;
        totalSpan.style.color = 'black';
        li.appendChild(totalSpan);

        ul.appendChild(li);
    });   
     orderSummaryContainer.appendChild(ul);

    const overallTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    const overallTotalElement = document.getElementById('overallTotalInput');
    if (overallTotalElement) {
        overallTotalElement.value = `$${overallTotal}`;
    }
}
