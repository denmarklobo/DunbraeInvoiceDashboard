document.addEventListener("DOMContentLoaded", function () {
    const contentArea = document.getElementById("content-area");
    const dashboardBtn = document.getElementById("dashboardBtn");
    const invoicesBtn = document.getElementById("invoicesBtn");
    const logoutBtn = document.querySelector(".logout");

    // Function to load pages dynamically and execute scripts
    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentArea.innerHTML = html;
                executeScripts(contentArea);
            })
            .catch(error => console.error("Error loading page:", error));
    }

    // ✅ Function to execute scripts inside the loaded content
    function executeScripts(container) {
        const scripts = container.querySelectorAll("script");
        scripts.forEach(script => {
            const newScript = document.createElement("script");
            if (script.src) {
                // External script
                newScript.src = script.src;
                newScript.onload = () => console.log(`Loaded: ${script.src}`);
            } else {
                // Inline script
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
        });
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
});
