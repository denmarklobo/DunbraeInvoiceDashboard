document.addEventListener("DOMContentLoaded", function () {
    const dashboardBtn = document.getElementById("dashboardBtn");
    const invoicesBtn = document.getElementById("invoicesBtn");
    const logoutBtn = document.querySelector(".logout");

    const username = localStorage.getItem("username");
    const position = localStorage.getItem("user_position");

    // Display user details at the top of the dashboard
    if (username && position) {
        document.getElementById("display-name").textContent = username;
        document.getElementById("display-position").textContent = position;
    }

    // Event listeners for sidebar buttons to navigate to pages
    dashboardBtn.addEventListener("click", function () {
        window.location.href = "dashboard.html";  // Navigate to dashboard.html
    });

    invoicesBtn.addEventListener("click", function () {
        window.location.href = "invoices.html";  // Navigate to invoices.html
    });
    // Ensure logoutBtn exists
    if (logoutBtn) {
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
    } else {
        console.error("Logout button not found!");
    }
});