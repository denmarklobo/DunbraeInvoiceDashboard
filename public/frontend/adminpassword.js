document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Check if the form fields are not empty
        if (!email || !password) {
            alert("❌ Please fill in both email and password.");
            return;
        }

        // The CSRF token you provided directly
        const csrfToken = "8GNEc0nKkr818J2yLD43ySaXPKsSbUBtDnq6k7pq"; // Direct token (for testing)

        // Use Axios to send a POST request
        axios.post('http://127.0.0.1:8000/api/v1/admin/login', {
            email: email,
            password: password
        }, {
            headers: {
                'X-CSRF-TOKEN': csrfToken
            },
            withCredentials: true  // Allow cookies to be sent
        })
        .then(response => {
            const data = response.data;

            if (data.message === 'Login successful') {
                // Save login status to sessionStorage
                sessionStorage.setItem("isLoggedIn", "true");

                // Redirect to sidebar.html or the appropriate page
                window.location.href = "sidebar.html";
            } else {
                alert("❌ Invalid email or password!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("❌ There was an error processing your request. Please try again later.");
        });
    });
});
