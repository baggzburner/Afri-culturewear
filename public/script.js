// checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const orderSummary = document.getElementById('orderSummary');
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');

        const itemName = document.createElement('span');
        itemName.classList.add('item-name');
        itemName.textContent = item.name;
        itemDiv.appendChild(itemName);

        const itemPrice = document.createElement('span');
        itemPrice.textContent = "$" + item.price.toFixed(2);
        itemDiv.appendChild(itemPrice);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.value = item.quantity;
        quantityInput.classList.add('quantity-input');
        quantityInput.setAttribute('readonly', true);
        itemDiv.appendChild(quantityInput);

        const totalLabel = document.createElement('label');
        totalLabel.textContent = "Total:";
        itemDiv.appendChild(totalLabel);

        const totalInput = document.createElement('input');
        totalInput.type = 'text';
        totalInput.value = "$" + (item.price * item.quantity).toFixed(2);
        totalInput.classList.add('total-input');
        totalInput.setAttribute('readonly', true);
        itemDiv.appendChild(totalInput);

        orderSummary.appendChild(itemDiv);
    });

    // Calculate and display overall total
    const overallTotal = document.getElementById('overallTotal');
    const totalInputs = document.querySelectorAll('.total-input');
    let total = 0;
    totalInputs.forEach(input => {
        total += parseFloat(input.value.replace('$', ''));
    });
    overallTotal.value = "$" + total.toFixed(2);
});

function openCart() {
    document.getElementById("mySidebar").style.width = "300px";
}

function closeCart() {
    document.getElementById("mySidebar").style.width = "0";
}

document.addEventListener('DOMContentLoaded', () => {
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

    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.addEventListener('click', () => {
        const cartItems = document.getElementById("cartItems");
        const items = Array.from(cartItems.children).map(item => {
            const name = item.querySelector('.item-name').textContent;
            const price = parseFloat(item.querySelector('span:nth-child(2)').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            return { name, price, quantity };
        });

        // Store cart items in localStorage
        localStorage.setItem('cart', JSON.stringify(items));

        // Redirect to checkout page
        window.location.href = '/checkout';
    });
});

function addToCart(name, price, quantity) {
    const cartItems = document.getElementById("cartItems");

    const existingItem = Array.from(cartItems.children).find(item => {
        return item.querySelector('.item-name').textContent === name;
    });

    if (existingItem) {
        const quantityInput = existingItem.querySelector('.quantity-input');
        const totalInput = existingItem.querySelector('.total-input');
        
        const newQuantity = parseInt(quantityInput.value) + parseInt(quantity);
        quantityInput.value = newQuantity;

        totalInput.value = "$" + (price * newQuantity).toFixed(2);
    } else {
        const item = document.createElement("div");
        item.classList.add("cart-item");

        const itemName = document.createElement("span");
        itemName.classList.add("item-name");
        itemName.textContent = name;
        item.appendChild(itemName);

        const itemPrice = document.createElement("span");
        itemPrice.textContent = "$" + price.toFixed(2);
        item.appendChild(itemPrice);

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = quantity;
        quantityInput.min = "1";
        quantityInput.classList.add("quantity-input");
        quantityInput.addEventListener('input', () => {
            totalInput.value = "$" + (price * parseInt(quantityInput.value)).toFixed(2);
            updateOverallTotal();
            updateCartCount();
        });
        item.appendChild(quantityInput);

        const totalLabel = document.createElement("label");
        totalLabel.textContent = "Total:";
        item.appendChild(totalLabel);

        const totalInput = document.createElement("input");
        totalInput.type = "text";
        totalInput.value = "$" + (price * quantity).toFixed(2);
        totalInput.readOnly = true;
        totalInput.classList.add("total-input");
        item.appendChild(totalInput);

        const hr = document.createElement("hr");
        hr.style.border = "none";
        hr.style.height = "2px";
        hr.style.backgroundColor = "#333";
        hr.style.margin = "10px 0";
        hr.style.fontWeight = "700";
        item.appendChild(hr);

        cartItems.appendChild(item);
    }

    updateOverallTotal();
    updateCartCount();
}

function updateCartCount() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cart-count");
    
    let count = 0;
    Array.from(cartItems.children).forEach(item => {
        const quantityInput = item.querySelector('.quantity-input');
        if (quantityInput) {
            count += parseInt(quantityInput.value);
        }
    });

    cartCount.textContent = count;
}

// Function to retrieve cart count
function getCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    let count = 0;
    cartItems.forEach(item => {
        count += item.quantity;
    });
    return count;
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(getCartCount());
});

function updateOverallTotal() {
    const cartItems = document.getElementById("cartItems");
    const overallTotal = document.getElementById("overallTotal");

    let total = 0;
    Array.from(cartItems.children).forEach(item => {
        const totalInput = item.querySelector('.total-input');
        if (totalInput) {
            total += parseFloat(totalInput.value.replace('$', ''));
        }
    });

    overallTotal.value = "$" + total.toFixed(2);
}
