document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    attachPurchaseButtonListeners();
    attachAddToCartButtonListener();
    attachCheckoutButtonListener();
    updateCartCount();
});

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
            const cartItems = document.getElementById("cartItems");
            const items = Array.from(cartItems.children).map(item => {
                const name = item.querySelector('.item-name').textContent;
                const price = parseFloat(item.querySelector('span:nth-child(2)').textContent.replace('$', ''));
                const quantity = parseInt(item.querySelector('.quantity-input').value);
                return { name, price, quantity };
            });
            localStorage.setItem('cart', JSON.stringify(items));
            window.location.href = '/checkout'; // Ensure this route exists
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
    cartItems.forEach(item => {
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
            item.total = item.price * parseInt(quantityInput.value);
            totalInput.value = "$" + item.total.toFixed(2);
            updateOverallTotal();
            updateCartCount();
            saveCartItems(cartItems);
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
    overallTotal.value = "$" + total.toFixed(2);
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
