document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Dummy authentication (Replace this with actual authentication logic)
        if (email === "admin@example.com" && password === "admin123") {
            // Save login status to sessionStorage
            sessionStorage.setItem("isLoggedIn", "true");

            // Redirect to sidebar.html
            window.location.href = "sidebar.html";
        } else {
            alert("❌ Invalid email or password!");
        }
    });
});
