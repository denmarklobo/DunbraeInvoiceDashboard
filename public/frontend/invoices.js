function openModal() {
    document.getElementById('invoiceModal').style.display = "flex";
}

function closeModal() {
    document.getElementById('invoiceModal').style.display = "none";
}

function switchForm(type) {
    const title = document.getElementById('modal-title');
    const label = document.getElementById('modal-label');
    
    if (type === 'invoice') {
        title.innerText = "Add Invoice";
        label.innerText = "Enter Invoice Amount";
    } else if (type === 'target') {
        title.innerText = "Add Target";
        label.innerText = "Enter Target Amount";
    }
}

function saveChanges() {
    alert("Invoice/Target added successfully!");
    closeModal();
}

// Close modal if user clicks outside the content
window.onclick = function(event) {
    const modal = document.getElementById('invoiceModal');
    if (event.target === modal) {
        closeModal();
    }
};