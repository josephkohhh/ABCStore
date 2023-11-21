/*
  This JavaScript file handles the functionality for a web page that displays products in a shop.
  It includes various features and functionality.

  Functions Overview:
  - cartOpenClose(): Manages the opening and closing of the shopping cart.
  - searchFunction(): Implements product search based on user input.
  - sortByButtonOpenClose(): Handles the opening and closing of the sort-by dropdown and provides functionality
                             for sorting products by price in both ascending and descending order.
  - modalOpenClose(): Manages the opening and closing of the product modals.

  Note: This documentation provides a high-level understanding of the code's purpose and functions.
  For detailed information, please refer to the comments within each function.
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Start when the document is ready
if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

// The start function initializes a series of functions
function start() {
    cartOpenClose();
    searchFunction();
    sortByButtonOpenClose();
    modalOpenClose();
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
    productBoxes.forEach(function (box) {
        box.addEventListener('click', function () {
            const popupId = this.getAttribute('data-popup');
            const popup = document.getElementById(popupId);
            popup.style.display = 'flex';
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
    productBoxes.forEach(box => {
        const title = box.querySelector('.product-title').textContent || box.querySelector('.product-title').innerText;
        box.style.display = title.toUpperCase().includes(input) ? '' : 'none';
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

    });

}   
