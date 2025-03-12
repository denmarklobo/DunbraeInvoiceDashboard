function openModal(index) {
    document.querySelectorAll(".modal")[index].style.display = "flex";
}

function closeModal(index) {
    document.querySelectorAll(".modal")[index].style.display = "none";
}
function saveChanges() {
    const invoiceAmount = document.getElementById("invoice-input").value;
    const targetAmount = document.getElementById("target-input").value;
    let message = "";

    if (!invoiceAmount && !targetAmount) {
        message = "Please enter both Invoice and Target amounts!";
    } else {
        message = `Invoice: ${invoiceAmount || "Not entered"}\nTarget: ${targetAmount || "Not entered"}`;
    }

    alert(message);
    if (invoiceAmount || targetAmount) closeModal();
}

// Close modal if user clicks outside the content
function closeModal() {
    document.getElementById("invoiceModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("invoiceModal");
    if (event.target === modal) {
        closeModal();
    }
};
