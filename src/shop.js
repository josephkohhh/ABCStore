/*
  This JavaScript file handles the functionality for a web page that displays products in a shop.
  It includes various features and functionality.

  Functions Overview:
  - cartOpenClose(): Manages the opening and closing of the shopping cart
  - searchFunction(): Implements product search based on user input
  - sortByButtonOpenClose(): Handles the opening and closing of the sort-by dropdown and provides functionality
                             for sorting products by price in both ascending and descending order
  - modalOpenClose(): Manages the opening and closing of the product modals
  - categorySideMenu(): Filter the products based on category 
  - categoryButtonXS(): Manages the opening and closing of the category button (XS version)
  - filterButtonXS(): Manges the opening and closing of the price filter button (XS version)
  - setMinMaxPrice(): Get and set min and max value for price slider
  - filterPriceRange(): Products will be filtered based selected price 
  - clearFilter(): Remove all filters by reloading page
  - updateCartState(): Check if cart is empty or not and manages cart state 
  - cartEvents(): Manages all click events that is related to the shopping cart
  - addToCart(): Add product to shopping cart and saves to local storage
  - modalAddToCart(): Add product to shopping cart and saves to local storage
  - deleteFromCart(): Delete the cart item from shopping cart
  - clearCart(): Clear the shopping cart
  - updateCartItemQuantity(): Updates cart item quantity and saves to local storage
  - updateTotal(): Update total price in shopping cart
  - updateLocalStorage(): Update the data stored in the browser's localStorage
  - cartItemComponent(): Create a HTML string that make up the cart item's structure
  - renderCartItems(): Update the cart item display in the shopping cart

  Note: This documentation provides a high-level understanding of the code's purpose and functions.
  For detailed information, please refer to the comments within each function.
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Declare and init variables
let cartList = []; // Declare array 

// Start when the document is ready
if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

// The start function initializes a series of functions
function start() {

    // Load cart items from local storage on page load
    if (localStorage.getItem('cartList')) {
        cartList = JSON.parse(localStorage.getItem('cartList'));
        renderCartItems();
    }
    
    cartOpenClose();
    searchFunction();
    sortByButtonOpenClose();
    modalOpenClose();
    categorySideMenu();
    categoryButtonXS();
    filterButtonXS();
    filterPriceRange();
    updateCartState();
    cartEvents();
    updateTotal();
}

// ============ Functions ===============
// Function for cart open/close
function cartOpenClose() {
    const cart = document.getElementsByClassName("cart")[0];
    const cartIcon = document.getElementById("cart-icon");
    const cartClose = document.getElementById("cart-close");

    cartIcon.addEventListener('click', () => {
        cart.classList.toggle('active');
    });

    cartClose.addEventListener('click', () => {
        cart.classList.remove('active');
    });
}

// Function for modal open/close 
function modalOpenClose() {
    const productBoxes = document.querySelectorAll('.product-box');
    const popups = document.querySelectorAll('.popup');
    const closeButtons = document.querySelectorAll('.close');

    // Opens the product's modal 
    productBoxes.forEach(function (productBox) {
        productBox.addEventListener('click', function (event) {
            if (!event.target.matches('.add-to-cart-btn')) { 
                const popupId = this.getAttribute('data-popup');
                const popup = document.getElementById(popupId);
                popup.style.display = 'flex';
            }
        });
    });

    // Check if the click is outside the popup-content
    popups.forEach(popup => {
        popup.addEventListener('click', (event) => {
            const popupContent = popup.querySelector('.popup-content');
            if (!popupContent.contains(event.target)) {
                popup.style.display = 'none';
            }
        });
    });

    // Check if the close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup');
            popup.style.display = 'none';
        });
    });
}

// Function for searching products 
function searchFunction() {
    const input = document.getElementById('myInput').value.toUpperCase();
    const productBoxes = Array.from(document.getElementsByClassName('product-box')); // Convert and get an array of product boxes

    // Iterate over each product box
    productBoxes.forEach((productBox) => {
        const title = productBox.querySelector('.product-title').textContent || productBox.querySelector('.product-title').innerText;
        productBox.style.display = title.toUpperCase().includes(input) ? '' : 'none';
    });
}

// Function for sort by button open/close
function sortByButtonOpenClose() {
    const dropdownButton = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });

    // Remove the 'show' class when a click occurs outside the dropdown button
    window.addEventListener('click', event => {
        !event.target.matches('.dropbtn') ? dropdownContent.classList.remove('show') : null;
    });

    const highToLow = document.getElementById('highToLow');
    const lowToHigh = document.getElementById('lowToHigh');

    highToLow.addEventListener('click', () => {
        const shopContent = document.querySelector('.shop-content');
        const productBoxes = Array.from(document.getElementsByClassName('product-box'));

        // Sort product boxes based on price in descending order
        productBoxes.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceB - priceA;
        });

        // Append sorted product boxes to the shop content
        productBoxes.forEach((productBox) => {
            shopContent.appendChild(productBox);
        });

        clearFilter();
    });

    lowToHigh.addEventListener('click', () => {
        const shopContent = document.querySelector('.shop-content');
        const productBoxes = Array.from(document.querySelectorAll('.product-box'));

        // Sort product boxes based on price in ascending order
        productBoxes.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceA - priceB;
        });

        // Append sorted product boxes to the shop content
        productBoxes.forEach((productBox) => {
            shopContent.appendChild(productBox);
        });

        clearFilter();
    });

}
// Function for sort by button open/close
function categorySideMenu() {
    const meatFishLinks = document.querySelectorAll('.meatFishLink');
    const fruitVegetableLinks = document.querySelectorAll('.fruitVegetableLink');
    const breadSpreadLinks = document.querySelectorAll('.breadSpreadLink');
    const beverageLinks = document.querySelectorAll('.beverageLink');
    const dairyLinks = document.querySelectorAll('.dairyLink');
    const snackLinks = document.querySelectorAll('.snackLink');
    const careProductLinks = document.querySelectorAll('.careProductLink');

    meatFishLinks.forEach((meatFishLink) => {
        meatFishLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');

                if (productCategory.textContent === "Meat" || productCategory.textContent === "Fish") {
                    productBox.style.display = '';
                } else {
                    productBox.style.display = 'none';
                }
            });
            clearFilter();
        });
    });

    fruitVegetableLinks.forEach((fruitVegetableLink) => {
        fruitVegetableLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');

                if (productCategory.textContent === "Fruit" || productCategory.textContent === "Vegetable") {
                    productBox.style.display = '';
                } else {
                    productBox.style.display = 'none';
                }
            });
            clearFilter();
        });
    });

    breadSpreadLinks.forEach((breadSpreadLink) => {
        breadSpreadLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');
                if (productCategory.textContent === "Bread" || productCategory.textContent === "Spread") {
                    productBox.style.display = '';
                } else {
                    productBox.style.display = 'none';
                }

            });
            clearFilter();
        });
    });

    beverageLinks.forEach((beverageLink) => {
        beverageLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');
                if (productCategory.textContent === "Beverage") {
                    productBox.style.display = '';
                } else {
                    productBox.style.display = 'none';
                }
            });
            clearFilter();
        });
    });

    dairyLinks.forEach((dairyLink) => {
        dairyLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');
                if (productCategory.textContent === "Dairy") {
                    productBox.style.display = '';
                } else {
                    productBox.style.display = 'none';
                }
            });
            clearFilter();
        });
    });

    snackLinks.forEach((snackLink) => {
        snackLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');
                productCategory.textContent === "Snack" ? productBox.style.display = '' : productBox.style.display = 'none';
            });
            clearFilter();
        });
    });

    careProductLinks.forEach((careProductLink) => {
        careProductLink.addEventListener("click", () => {
            const productBoxes = document.querySelectorAll('.product-box');
            productBoxes.forEach((productBox) => {
                const productCategory = productBox.querySelector('.product-category');
                productCategory.textContent === "Care Product" ? productBox.style.display = '' : productBox.style.display = 'none';
            });
            clearFilter();
        });
    });

}

// Function for category button open/close
function categoryButtonXS() {
    const categoryBtn = document.querySelector('.categorybtn');
    const categoryContent = document.querySelector('.categorization-dropdown-content');

    categoryBtn.addEventListener("click", () => {
        categoryContent.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.categorybtn'))
            categoryContent.classList.remove('show');
    });
}

// Function for filter price button open/close
function filterButtonXS() {
    const pricefilterbtn = document.querySelector('.pricefilterbtn');
    const pricefilterContent = document.querySelector('.pricefilter-dropdown-content');

    pricefilterbtn.addEventListener("click", () => {
        pricefilterContent.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.pricefilterbtn'))
            pricefilterContent.classList.remove('show');
    });
}

// Function to set min/max price for price range
function setMinMaxPrice() {
    const productBoxes = document.querySelectorAll('.product-box');
    const price = document.getElementById('selected-price');
    const priceXS = document.getElementById('selected-price-xs');

    let minPrice = Number.MAX_VALUE; // Declare and init minPrice to maximum possible value
    let maxPrice = Number.MIN_VALUE; // Declare and init maxPrice to minimum possible value

    productBoxes.forEach((productBox) => {
        const price = parseFloat(productBox.querySelector('.product-price').textContent.replace('$', ''));
        minPrice = Math.min(minPrice, price); // Updates minPrice to min value between current value and price
        maxPrice = Math.max(maxPrice, price); // Updates maxPrice to max value between current value and price
    });

    // Calculate step value with fixed decimal places
    const stepValue = 1;

    // Update price range's min and max price
    document.getElementById('price-slider').min = minPrice;
    document.getElementById('price-slider').max = maxPrice;
    document.getElementById('price-slider').step = stepValue;

    document.getElementById('price-slider-xs').min = minPrice;
    document.getElementById('price-slider-xs').max = maxPrice;
    document.getElementById('price-slider-xs').step = stepValue;

    // Set the selected price to min price
    price.textContent = `Selected Price: $${minPrice}`;
    priceXS.textContent = `Selected Price: $${minPrice}`;

}

// Function to filter price range
function filterPriceRange() {
    setMinMaxPrice();

    const priceFilter = document.getElementById('price-slider');
    const price = document.getElementById('selected-price');

    const priceFilterXS = document.getElementById('price-slider-xs');
    const priceXS = document.getElementById('selected-price-xs');

    priceFilter.addEventListener('click', () => {

        const selectedPrice = priceFilter.value;
        const productBoxes = document.querySelectorAll('.product-box');

        productBoxes.forEach((productBox) => {
            const productPrice = parseFloat(productBox.querySelector('.product-price').textContent.replace('$', ''));
            if (productPrice <= selectedPrice) {
                productBox.style.display = '';
            } else {
                productBox.style.display = 'none';
            }

        });

        price.textContent = `Selected Price: $${selectedPrice}`;
        clearFilter();
    });

    priceFilterXS.addEventListener('click', () => {

        const selectedPrice = priceFilterXS.value;
        const productBoxes = document.querySelectorAll('.product-box');

        productBoxes.forEach((productBox) => {
            const productPrice = parseFloat(productBox.querySelector('.product-price').textContent.replace('$', ''));
            if (productPrice <= selectedPrice) {
                productBox.style.display = '';
            } else {
                productBox.style.display = 'none';
            }

        });

        priceXS.textContent = `Selected Price: $${selectedPrice}`;
        clearFilter();
    });
}

// Function to clear all filters
function clearFilter() {
    const clearFilterBtn = document.querySelector('.clear-filter-btn');

    clearFilterBtn.style.display = 'block';

    clearFilterBtn.addEventListener('click', () => {
        location.reload();
    });
}

// Function to update cart state 
function updateCartState() {
    const cartState = document.querySelector('.fa-circle');
    const cartItemTitle = document.querySelectorAll('.cart-product-title');
    if (cartItemTitle.length > 0) {
        cartState.style.display = 'inline';
    } else {
        cartState.style.display = 'none';
    }
}

// ============ Cart Functions ===============
function cartEvents() {

    // Click event for add-to-cart button
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach((addToCartBtn) => {
        addToCartBtn.addEventListener('click', addToCart);
    });

    const modalAddToCartBtns = document.querySelectorAll('.modal-add-to-cart-btn');
    modalAddToCartBtns.forEach((modalAddToCartBtn) => {
        modalAddToCartBtn.addEventListener('click', modalAddToCart);
    });

    // Click event for cart-remove button
    const removeFromCartBtns = document.querySelectorAll('.cart-remove');
    removeFromCartBtns.forEach((removeFromCartBtn) => {
        removeFromCartBtn.addEventListener('click', deleteFromCart);
    });

    // Click event for btn-clear button
    const clearCartBtn = document.querySelector('.btn-clear');
    clearCartBtn.addEventListener('click', clearCart);

    // Click event for cart-quantity input
    const itemQuantityInputs = document.querySelectorAll('.cart-quantity');
    itemQuantityInputs.forEach((itemQuantityInput) => {
        itemQuantityInput.addEventListener('change', updateCartItemQuantity);
    });

}

// Function to add to cart
function addToCart() {
    // Declare and init product info based on the add-to-cart-btn clicked that is attached to the product box
    const product = this.closest(".product-box");
    const title = product.querySelector(".product-title").textContent;
    const price = product.querySelector(".product-price").textContent;
    const imgSrc = product.querySelector(".product-img").src;

    // const existingItem = cartList.find(p => p.title === title); // Short hand syntax
    const existingItem = cartList.find((element) => { // Find the object in the array
        return element.title === title;
    });

    if (existingItem) {
        existingItem.quantity += 1;
        updateLocalStorage();
        renderCartItems(); // Update cart item quantity in the cart 
        cartEvents(); // Ensure event listeners are attached to the newly rendered cart item(s)
        updateTotal();

    } else {

        // Create an object with properties
        let productItem = {
            title,
            price,
            imgSrc,
            quantity: 1
        };

        cartList.push(productItem); // Add the object to cartList array
        updateLocalStorage();

        let node = document.createElement("div"); // Create a new div element
        const cartContent = document.querySelector('.cart-content');

        // Call the cartItemComponent function to get the HTML string for a cart item
        let cartItem = cartItemComponent(title, price, imgSrc, 1);
        node.innerHTML = cartItem; // Set the innerHTML of the new div element to the HTML string of the cart item
        cartContent.appendChild(node); // Add cart item to the cart content

        cartEvents(); // Ensure event listeners are attached to the newly added cart item(s)
        updateCartState(); 
        updateTotal();
    }
}

// Function to add to cart
function modalAddToCart() {
    // Declare and init product info based on the add-to-cart-btn clicked that is attached to the product box
    const product = this.closest(".popup");
    const title = product.querySelector(".product-title").textContent;
    const price = product.querySelector(".product-price").textContent;
    const imgSrc = product.querySelector(".product-img").src;

    // const existingItem = cartList.find(p => p.title === title); // Short hand syntax
    const existingItem = cartList.find((element) => { // Find the object in the array
        return element.title === title;
    });

    if (existingItem) {
        existingItem.quantity += 1;
        updateLocalStorage();
        renderCartItems(); // Update cart item quantity in the cart 
        cartEvents(); // Ensure event listeners are attached to the newly rendered cart item(s)
        updateTotal();
    } else {

        // Create an object with properties
        let productItem = {
            title,
            price,
            imgSrc,
            quantity: 1
        };

        cartList.push(productItem); // Add the object to cartList array
        updateLocalStorage();

        let node = document.createElement("div"); // Create a new div element
        const cartContent = document.querySelector('.cart-content');

        // Call the cartItemComponent function to get the HTML string for a cart item
        let cartItem = cartItemComponent(title, price, imgSrc, 1);
        node.innerHTML = cartItem; // Set the innerHTML of the new div element to the HTML string of the cart item
        cartContent.appendChild(node); // Add cart item to the cart content

        cartEvents(); // Ensure event listeners are attached to the newly added cart item(s)
        updateTotal();
        updateCartState(); 

    }

    const popups = document.querySelectorAll('.popup');
    popups.forEach((popup) => {
        popup.style.display = 'none';
    });
}

// Function to delete cart item from cart
function deleteFromCart() {
    const productTitle = this.parentElement.querySelector('.cart-product-title').textContent;
    this.parentElement.remove();

    // cartList = cartList.filter((element) => element.title !== productTitle);  // Short hand syntax
    cartList = cartList.filter((element) => {
        return element.title !== productTitle;
    });

    updateLocalStorage();
    updateTotal();
    updateCartState(); 
}

// Function to clear cart 
function clearCart() {
    if (cartList.length <= 0) {
        alert("Please make an order first!");
        return; // Exit the function immediately preventing rest of logic being executed unnecessarily 
    }

    const cartContent = document.querySelector(".cart-content");
    cartContent.textContent = '';

    localStorage.removeItem('cartList'); // Delete the data based on keyname 
    cartList = []; // Reset the array

    updateTotal();
    updateCartState(); 
}

// Function to update cart item quantity 
function updateCartItemQuantity() {
    // Ensure that input value is valid positive integer between 1 and 10
    let newQuantity = parseInt(this.value);
    newQuantity = isNaN(newQuantity) ? 1 : Math.max(1, Math.min(newQuantity, 10));

    this.value = newQuantity;

    const productTitle = this.parentElement.querySelector('.cart-product-title').textContent;

    // Find the index of the cart item in the array
    // let foundIndex = itemsAdded.findIndex(item => item.title === productTitle); // Short hand syntax
    let index = cartList.findIndex((element) => {
        return element.title === productTitle;
    });
    
    if (index !== -1) { // Return -1 if the element is not found
        cartList[index].quantity = newQuantity;
        updateTotal();
        updateLocalStorage();
    }
}

// Function to update cart total price
function updateTotal() {
    const cartBoxes = document.querySelectorAll('.cart-box');
    let totalPrice = document.querySelector('.total-price');
    let total = 0;
    cartBoxes.forEach((cartBox)=> {
        let price = parseFloat(cartBox.querySelector('.cart-price').textContent.replace('$',''));
        let quantity = cartBox.querySelector('.cart-quantity').value;
        total += price * quantity; // Use += to accumulate the total
    });
     total = total.toFixed(2); // To keep 2 digits after the decimal point 
     totalPrice.textContent = "$" + total;
}

// Function to update the data stored in the browser's local storage
function updateLocalStorage() {
    localStorage.setItem('cartList', JSON.stringify(cartList));
}

// Function to create a cart item
function cartItemComponent(title, price, imgSrc, quantity) {
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

// Function to update the display of the cart item(s)
function renderCartItems() {
    const cartContent = document.querySelector('.cart-content');

    // Clear existing content inside the 'cart-content' element
    cartContent.innerHTML = "";

    // Iterate over each item in the array
    cartList.forEach((cartItem) => {
        // For each item, create an HTML string using the 'cartItemComponent' function
        const cartItemHTML = cartItemComponent(cartItem.title, cartItem.price, cartItem.imgSrc, cartItem.quantity);
        // Append the HTML string to the 'cart-content' element
        cartContent.insertAdjacentHTML('beforeend', cartItemHTML);
    });
}

