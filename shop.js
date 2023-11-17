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
    if (!event.target.matches('.dropbtn')) {
        dropdownContent.classList.remove('show');
    }
});

// Category button
const dropDownCBtn = document.querySelector(".categorization-dropdown");
const dropdownCContent = document.querySelector(".categorization-dropdown-content");

dropDownCBtn.addEventListener('click', () => {
    dropdownCContent.classList.toggle('show');
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function (event) {
    if (!event.target.matches('.categorybtn')) {
        dropdownCContent.classList.remove('show');
    }
});

// Filter By Price button
const dropDownFBtn = document.querySelector(".pricefilter-dropdown");
const dropdownFContent = document.querySelector(".pricefilter-dropdown-content");

dropDownFBtn.addEventListener('click', () => {
    dropdownFContent.classList.toggle('show');
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function (event) {
    if (!event.target.matches('.pricefilterbtn')) {
        dropdownFContent.classList.remove('show');
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

    showClearFilter();
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
    findMinAndMaxPrices();
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

    // Sort by Price 
    let highToLow = document.getElementById('highToLow');
    highToLow.addEventListener("click", () => {
        let shopContent = document.querySelector('.shop-content');
        let productBoxes = Array.from(document.querySelectorAll('.product-box'));

        // Sort product boxes based on the product-price in descending order
        productBoxes.sort((a, b) => {
            let priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            let priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceB - priceA;

        });

        // Append sorted product boxes back to the container
        productBoxes.forEach((productBox) => {
            shopContent.appendChild(productBox);
        });

        showClearFilter();
    })

    let lowToHigh = document.getElementById('lowToHigh');
    lowToHigh.addEventListener("click", () => {
        let shopContent = document.querySelector('.shop-content');
        let productBoxes = Array.from(document.querySelectorAll('.product-box'));

        // Sort product boxes based on the product-price in descending order
        productBoxes.sort((a, b) => {
            let priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            let priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceA - priceB;
        });

        // Append sorted product boxes back to the container
        productBoxes.forEach((productBox) => {
            shopContent.appendChild(productBox);
        });

        showClearFilter();

    })

    // Category Filter
    let meatFishLinks = document.querySelectorAll('.meatFishLink');
    meatFishLinks.forEach((meatFishLink) => {
        meatFishLink.addEventListener("click", () => {
            let productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                let productCategory = productBox.querySelector('.product-category');

                if (productCategory && (productCategory.textContent === "Meat" || productCategory.textContent === "Fish")) {
                    productBox.style.display = '';
                } else {
                    productBox.style.display = 'none';
                }

            });
            showClearFilter();
        });
    });
    let fruitVegetableLinks = document.querySelectorAll('.fruitVegetableLink');
    fruitVegetableLinks.forEach((fruitVegetableLink) => {
        fruitVegetableLink.addEventListener("click", () => {
            let productBoxes = document.getElementsByClassName('product-box');
            for (i = 0; i < productBoxes.length; i++) {
                let productCategory = productBoxes[i].querySelector('.product-category');
                if (productCategory.textContent == "Fruit" || productCategory.textContent == "Vegetable") {
                    productBoxes[i].style.display = '';
                } else {
                    productBoxes[i].style.display = 'none';
                }
            }
            showClearFilter();
        });
    });
    let breadSpreadLinks = document.querySelectorAll('.breadSpreadLink');
    breadSpreadLinks.forEach((breadSpreadLink) => {
        breadSpreadLink.addEventListener("click", () => {
            let productBoxes = document.getElementsByClassName('product-box');
            for (i = 0; i < productBoxes.length; i++) {
                let productCategory = productBoxes[i].querySelector('.product-category');
                if (productCategory.textContent == "Bread" || productCategory.textContent == "Spread") {
                    productBoxes[i].style.display = '';
                } else {
                    productBoxes[i].style.display = 'none';
                }
            }
            showClearFilter();
        });
    })

    let beverageLinks = document.querySelectorAll('.beverageLink');
    beverageLinks.forEach((beverageLink) => {
        beverageLink.addEventListener("click", () => {
            let productBoxes = document.getElementsByClassName('product-box');
            for (i = 0; i < productBoxes.length; i++) {
                let productCategory = productBoxes[i].querySelector('.product-category');
                if (productCategory.textContent == "Beverage") {
                    productBoxes[i].style.display = '';
                } else {
                    productBoxes[i].style.display = 'none';
                }
            }
            showClearFilter();
        });
    });

    let dairyLinks = document.querySelectorAll('.dairyLink');
    dairyLinks.forEach((dairyLink) => {
        dairyLink.addEventListener("click", () => {
            let productBoxes = document.getElementsByClassName('product-box');
            for (i = 0; i < productBoxes.length; i++) {
                let productCategory = productBoxes[i].querySelector('.product-category');
                if (productCategory.textContent == "Dairy") {
                    productBoxes[i].style.display = '';
                } else {
                    productBoxes[i].style.display = 'none';
                }
            }
            showClearFilter();
        });
    });

    let snackLinks = document.querySelectorAll('.snackLink');
    snackLinks.forEach((snackLink) => {
        snackLink.addEventListener("click", () => {
            let productBoxes = document.getElementsByClassName('product-box');
            for (i = 0; i < productBoxes.length; i++) {
                let productCategory = productBoxes[i].querySelector('.product-category');
                if (productCategory.textContent == "Snack") {
                    productBoxes[i].style.display = '';
                } else {
                    productBoxes[i].style.display = 'none';
                }
            }
            showClearFilter();
        });
    });

    let careProductLinks = document.querySelectorAll('.careProductLink');
    careProductLinks.forEach((careProductLink) => {
        careProductLink.addEventListener("click", () => {
            let productBoxes = document.getElementsByClassName('product-box');
            for (i = 0; i < productBoxes.length; i++) {
                let productCategory = productBoxes[i].querySelector('.product-category');
                if (productCategory.textContent == "Care Product") {
                    productBoxes[i].style.display = '';
                } else {
                    productBoxes[i].style.display = 'none';
                }
            }
            showClearFilter();
        });
    });

    // Price Slider Filter
    const priceSlider = document.getElementById('price-slider');
    const priceRange = document.getElementById('price-range');
    let priceFilter = document.getElementById('price-slider');

    priceFilter.addEventListener("click", () => {

        const selectedPrice = `${priceFilter.value}`;
        let productBoxes = document.querySelectorAll('.product-box');
        productBoxes.forEach((productBox) => {
            let productPrice = parseFloat(productBox.querySelector('.product-price').textContent.replace('$', ''));
            if (productPrice <= selectedPrice) {
                productBox.style.display = '';
            } else {
                productBox.style.display = 'none';
            }
        });

        showClearFilter();
    });

    function updateDisplayedPrice() {
        const selectedPrice = `${priceSlider.value}`;
        priceRange.textContent = `Selected Price: $${selectedPrice}`;

    }

    priceSlider.addEventListener('input', updateDisplayedPrice);
    updateDisplayedPrice();

    // Price Slider Filter xs
    const priceSliderXS = document.getElementById('price-slider-xs');
    const priceRangeXS = document.getElementById('price-range-xs');
    let priceFilterXS = document.getElementById('price-slider-xs');

    priceFilterXS.addEventListener("click", () => {

        const selectedPrice2 = `${priceFilterXS.value}`;
        let productBoxes2 = document.querySelectorAll('.product-box');
        productBoxes2.forEach((productBox) => {
            let productPrice2 = parseFloat(productBox.querySelector('.product-price').textContent.replace('$', ''));
            if (productPrice2 <= selectedPrice2) {
                productBox.style.display = '';
            } else {
                productBox.style.display = 'none';
            }
        });

        showClearFilter();
    });

    function updateDisplayedPrice2() {
        const selectedPrice = `${priceSliderXS.value}`;
        priceRangeXS.textContent = `Selected Price: $${selectedPrice}`;

    }

    priceSliderXS.addEventListener('input', updateDisplayedPrice2);
    updateDisplayedPrice2();
   
}

// ============ Handle event functions ===============

function handle_addCartItem() {
    let product = this.closest(".product-box");
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

// Price slider function
// Function to traverse product boxes and get min and max prices
function findMinAndMaxPrices() {
    const productBoxes = document.querySelectorAll('.product-box');
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;

    productBoxes.forEach(box => {
        const priceElement = box.querySelector('.product-price');
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
    });

    // Update the input range values
    document.getElementById('price-slider').min = minPrice;
    document.getElementById('price-slider').max = maxPrice;
    document.getElementById('price-slider-xs').min = minPrice;
    document.getElementById('price-slider-xs').max = maxPrice;
}

// Clear filter function
function showClearFilter() {
    const clearFilterBtn = document.querySelector('.clear-filter-btn');
    clearFilterBtn.style.display = 'block';
    clearFilterBtn.addEventListener('click', () => {
        location.reload();
    });
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


