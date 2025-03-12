document.addEventListener("DOMContentLoaded", function () {
    const contentArea = document.getElementById("content-area");
    const dashboardBtn = document.getElementById("dashboardBtn");
    const invoicesBtn = document.getElementById("invoicesBtn");

    // Function to load pages dynamically
    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentArea.innerHTML = html;
            })
            .catch(error => console.error("Error loading page:", error));
    }

    // Load dashboard.html by default
    loadPage("dashboard.html");

    // Event Listeners for Sidebar Navigation
    dashboardBtn.addEventListener("click", function () {
        loadPage("dashboard.html");
        setActiveButton(dashboardBtn);
    });

    invoicesBtn.addEventListener("click", function () {
        loadPage("invoices.html");
        setActiveButton(invoicesBtn);
    });

    // Function to update active button state
    function setActiveButton(activeButton) {
        document.querySelectorAll(".sidebar-button").forEach(btn => {
            btn.classList.remove("active");
        });
        activeButton.classList.add("active");
    }
});
