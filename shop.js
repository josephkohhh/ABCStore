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
