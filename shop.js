// Functions for modal 
function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}

function hidePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

function closeModal() {
    document.querySelector('.popup').style.display = 'none';
}

// Functions for cart open/close
const cart = document.querySelector(".cart");
const cartIcon = document.querySelector("#cart-icon");
const cartClose = document.querySelector("#cart-close");

cartIcon.addEventListener('click', () => {
        cart.classList.toggle('active');
});

cartClose.addEventListener('click', () => {
    cart.classList.remove('active');
    isActive = false;
})

// Filter functions
const dropDownBtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");

dropDownBtn.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function (event) {
    if (event.target !== dropDownBtn) {
        dropdownContent.classList.remove('show');
        isActiveFilter = false;
    }
});

function searchFunction() {
    let input, filter, productBoxes, productTitles, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    productBoxes = document.getElementsByClassName('product-box');

    for (i = 0; i < productBoxes.length; i++) {
        productTitles = productBoxes[i].querySelectorAll('.product-title');
        txtValue = productTitles[0].textContent || productTitles[0].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            productBoxes[i].style.display = '';
        } else {
            productBoxes[i].style.display = 'none';
        }
    }
}


// Cart functions
// Start when the document is ready
if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

// ========== START ===============

let itemsAdded = [];

function start() {
    // Load items from local storage on page load
    if (localStorage.getItem('itemsAdded')) {
        itemsAdded = JSON.parse(localStorage.getItem('itemsAdded'));
        renderCartItems();
    }
    addEvents();

    // Update the quantity values from the local storage
    let cartQuantityInputs = document.querySelectorAll('.cart-quantity');
    cartQuantityInputs.forEach((input) => {
        let productTitle = input.parentElement.querySelector('.cart-product-title').textContent;
        let foundItem = itemsAdded.find(item => item.title === productTitle);
        if (foundItem) {
            input.value = foundItem.quantity;
        }
    });

    updateTotal();
    updateCartState();
}

// ============ END ===============

function update() {
    addEvents();
    updateTotal();
    updateCartState();
}

// ============ ADD Events ===============

function addEvents() {
    // Remove items from cart
    let cartRemove_btns = document.querySelectorAll('.cart-remove')
    cartRemove_btns.forEach((btn) => {
        btn.addEventListener("click", handle_removeCartItem);
    });

    // Change item quantity
    let cartQuantity_inputs = document.querySelectorAll('.cart-quantity');
    cartQuantity_inputs.forEach((input) => {
        input.addEventListener("change", handle_changeItemQuantity);
    })

    // Add item to cart
    let addCart_btns = document.querySelectorAll('.add-to-cart-btn');
    addCart_btns.forEach((btn) => {
        btn.addEventListener("click", handle_addCartItem);
    });

    // Add item to cart from popup
    let addCart_btns2 = document.querySelectorAll('.modal-add-to-cart-btn');
    addCart_btns2.forEach((btn) => {
        btn.addEventListener("click", handle_addModalCartItem);
    });

    // Buy order
    const buy_btn = document.querySelector(".btn-buy");
    buy_btn.addEventListener("click", handle_buyOrder);

    // Clear order
    const clear_btn = document.querySelector(".btn-clear");
    clear_btn.addEventListener("click", handle_clearOrder);
}

// ============ Handle event functions ===============

function handle_addCartItem() {
    let product = this.parentElement;
    let title = product.querySelector(".product-title").textContent;
    let price = product.querySelector(".product-price").textContent;
    let imgSrc = product.querySelector(".product-img").src;

    let existingItem = itemsAdded.find(p => p.title === title);

    if (existingItem) {
        // If the item already exists, increase the quantity by 1
        existingItem.quantity += 1;
        updateLocalStorage();
        renderCartItems();
        update();

    } else {
        // If the item does not exist, create a new entry with quantity 1
        let newToAdd = {
            title,
            price,
            imgSrc,
            quantity: 1
        };
        itemsAdded.push(newToAdd);
        updateLocalStorage();

        // Add product to the cart
        let cartBoxElement = cartBoxComponent(title, price, imgSrc, 1); // Set the quantity to 1 when adding the item to the cart
        let newNode = document.createElement("div");
        newNode.innerHTML = cartBoxElement;
        const cartContent = cart.querySelector('.cart-content');
        cartContent.appendChild(newNode);

        renderCartItems();
        update();

    }
}

function handle_addModalCartItem() {
    let product = this.closest(".popup");
    let title = product.querySelector(".product-title").textContent;
    let price = product.querySelector(".product-price").textContent;
    let imgSrc = product.querySelector(".product-img").src;

    let existingItem = itemsAdded.find(p => p.title === title);

    if (existingItem) {
        // If the item already exists, increase the quantity by 1
        existingItem.quantity += 1;
        updateLocalStorage();
        renderCartItems();
        update();

    } else {
        // If the item does not exist, create a new entry with quantity 1
        let newToAdd = {
            title,
            price,
            imgSrc,
            quantity: 1
        };
        itemsAdded.push(newToAdd);
        updateLocalStorage();

        // Add product to the cart
        let cartBoxElement = cartBoxComponent(title, price, imgSrc, 1); // Set the quantity to 1 when adding the item to the cart
        let newNode = document.createElement("div");
        newNode.innerHTML = cartBoxElement;
        const cartContent = cart.querySelector('.cart-content');
        cartContent.appendChild(newNode);

        renderCartItems();
        update();

    }
}

function handle_removeCartItem() {
    let productTitle = this.parentElement.querySelector('.cart-product-title').textContent
    this.parentElement.remove();

    // Remove the item from the itemsAdded array
    itemsAdded = itemsAdded.filter(p => p.title !== productTitle);

    updateLocalStorage();

    update();
}

function handle_changeItemQuantity() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    } else if (this.value > 10) {
        this.value = 10;
    }
    this.value = Math.floor(this.value); // to keep it integer

    let productTitle = this.parentElement.querySelector('.cart-product-title').textContent;
    let foundIndex = itemsAdded.findIndex(p => p.title === productTitle);

    if (foundIndex !== -1) { // element in an array return -1 if the element is not found
        itemsAdded[foundIndex].quantity = parseInt(this.value); // Update the quantity in the itemsAdded array
        updateLocalStorage(); // Update local storage
    }

    update();

}

function handle_buyOrder() {
    if (itemsAdded.length <= 0) {
        alert("Please make an order first!");
        return;
    }
    const cartContentBuy = cart.querySelector(".cart-content");
    cartContentBuy.textContent = '';
    alert("Your order has been placed successfully!");
    // Clear all items from local storage
    localStorage.removeItem('itemsAdded');

    itemsAdded = []; // Reset the itemsAdded array

    update();
}

function handle_clearOrder() {
    if (itemsAdded.length <= 0) {
        alert("Please make an order first!");
        return;
    }
    const cartContentClear = cart.querySelector(".cart-content");
    cartContentClear.textContent = '';
    // Clear all items from local storage
    localStorage.removeItem('itemsAdded');
    itemsAdded = []; // Reset the itemsAdded array

    update();

}

// ============ Update and re-render functions ===============
function renderCartItems() {
    const cartContent = cart.querySelector('.cart-content');
    cartContent.innerHTML = ""; // Clear existing content before rendering
    itemsAdded.forEach(item => {
        cartContent.insertAdjacentHTML('beforeend', cartBoxComponent(item.title, item.price, item.imgSrc, item.quantity));
    });
}

function updateLocalStorage() {
    localStorage.setItem('itemsAdded', JSON.stringify(itemsAdded));
}

function updateTotal() {
    let cartBoxes = document.querySelectorAll('.cart-box');
    const totalElement = cart.querySelector('.total-price');
    let total = 0;
    cartBoxes.forEach((cartBox) => {
        let priceElement = cartBox.querySelector('.cart-price');
        let price = parseFloat(priceElement.textContent.replace("$", ""));
        let quantity = cartBox.querySelector('.cart-quantity').value;
        total += price * quantity;
    });

    // To keep 2 digits after the decimal point 
    total = total.toFixed(2); // or you can use total = Math.round(total * 100) / 100; 

    totalElement.textContent = "$" + total;
}

function updateCartState() {
    const cartState = document.querySelector(".fa-circle");
    const cartContentTitles = document.querySelectorAll('.cart-product-title')
    if (cartContentTitles.length > 0) {
        cartState.style.display = 'inline';
    } else {
        cartState.style.display = 'none';
    }
}

// ============ HTML functions ===============
function cartBoxComponent(title, price, imgSrc, quantity) {
    return `
    <div class="cart-box">
    <img src="${imgSrc}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" value="${quantity}" class="cart-quantity">
    </div>
    <!-- Remove cart -->
    <i class="fa-solid fa-trash fa-lg cart-remove"></i>
    </div>`;
}


