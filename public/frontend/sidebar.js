document.addEventListener("DOMContentLoaded", function () {
    const contentArea = document.getElementById("content-area");
    const dashboardBtn = document.getElementById("dashboardBtn");
    const invoicesBtn = document.getElementById("invoices-Btn");
    const logoutBtn = document.querySelector(".logout");

    // Function to load pages dynamically and reattach scripts
    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentArea.innerHTML = html;
                reinitializeScripts(); // Reinitialize scripts after loading content
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

    // Logout confirmation modal
    logoutBtn.addEventListener("click", function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of the system.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, logout"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "adminlogin.html";
            }
        });
    });

    // Function to update active button state
    function setActiveButton(activeButton) {
        document.querySelectorAll(".sidebar-button").forEach(btn => {
            btn.classList.remove("active");
        });
        activeButton.classList.add("active");
    }

    // Function to reinitialize scripts after page load
    function reinitializeScripts() {
        console.log("Reinitializing scripts...");

        // Dynamically load external JS scripts (if they exist in the loaded page)
        const scripts = contentArea.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.textContent = oldScript.textContent; // Copy inline script content
            document.body.appendChild(newScript).parentNode.removeChild(newScript); // Execute script
        });

        // Re-run initialization for charts, graphs, or any other JS functionality
        if (typeof initializeGraphs === "function") {
            initializeGraphs(); // Call your chart initialization function
        }
    }
});
