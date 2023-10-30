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

let isActive = false;

cartIcon.addEventListener('click', () => {
    if (isActive) {
        cart.classList.remove('active');
        isActive = false;
    } else {
        cart.classList.add('active');
        isActive = true;
    }
});

cartClose.addEventListener('click', () => {
    cart.classList.remove('active');
    isActive = false;
})

// App functions

// Start when the document is ready
if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

// ========== START ===============

function start() {
    addEvents();
}

// ============ END ===============

function update() {
    addEvents();
    updateTotal();
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

    // Buy order
    const buy_btn = document.querySelector(".btn-buy");
    buy_btn.addEventListener("click", handle_buyOrder);
}

// ============ Handle event functions ===============
let itemsAdded = []

function handle_addCartItem() {
    let product = this.parentElement;
    let title = product.querySelector(".product-title").textContent;
    let price = product.querySelector(".product-price").textContent;
    let imgSrc = product.querySelector(".product-img").src;

    // create an object
    let newToAdd = {
        title,
        price,
        imgSrc,
    };

    // handle item is already exist
    if (itemsAdded.find(p => p.title == newToAdd.title)) {
        alert('This item already exist!');
        return;
    } else {
        itemsAdded.push(newToAdd);
    }

    // add product(s) to cart
    let cartBoxElement = cartBoxComponent(title, price, imgSrc);
    let newNode = document.createElement("div");
    newNode.innerHTML = cartBoxElement;
    const cartContent = cart.querySelector('.cart-content');
    cartContent.appendChild(newNode);

    update();
}

function handle_removeCartItem() {
    this.parentElement.remove();
    itemsAdded = itemsAdded.filter(p => p.title != this.parentElement.querySelector('.cart-product-title').textContent);
    update();
}

function handle_changeItemQuantity() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    } else if (this.value > 10) {
        this.value = 10;
    }
    this.value = Math.floor(this.value); // to keep it integer

    update();

}

function handle_buyOrder() {
    if(itemsAdded.length <= 0){
        alert("Please make an order first!");
        return;
    }
    const cartContent = cart.querySelector(".cart-content");
    cartContent.textContent = '';
    alert("Your order has been placed successfully!");
    itemsAdded = [];

    update();
}

// ============ Update and re-render functions ===============
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


// ============ HTML functions ===============
function cartBoxComponent(title, price, imgSrc) {
    return `
    <div class="cart-box">
    <img src="${imgSrc}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" value="1" class="cart-quantity">
    </div>
    <!-- Remove cart -->
    <i class="fa-solid fa-trash fa-lg cart-remove"></i>
    </div>`;
}

