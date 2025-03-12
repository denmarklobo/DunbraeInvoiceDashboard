document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".sidebar-button");
    const contentContainer = document.querySelector(".content");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let page = this.textContent.trim().toLowerCase();   
            if (page === "dashboard") {
                loadPage("dashboard.html");
            } else if (page === "invoices") {
                loadPage("invoices.html");
            }
        });
    });

    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                contentContainer.innerHTML = data;
            })
            .catch(error => console.error("Error loading page:", error));
    }
});
