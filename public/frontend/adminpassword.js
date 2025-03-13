document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("❌ Please fill in both email and password.");
            return;
        }

        // The CSRF token you provided directly
        const csrfToken = "8GNEc0nKkr818J2yLD43ySaXPKsSbUBtDnq6k7pq"; // Direct token (for testing)

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
                    if (data.user.is_verified) {
                        // If email is verified, proceed with redirection
                        localStorage.setItem("username", data.user.name);
                        localStorage.setItem("user_position", data.user.position);
                        sessionStorage.setItem("isLoggedIn", "true");

                        window.location.href = "sidebar.html";
                    } else {
                        document.body.innerHTML = `
                        <div class="login-container">
                            <div class="login-form">
                                <div 
                                    class="verification-container"
                                    style="
                                        font-family: 'Poppins', sans-serif;
                                        font-size: 12px;
                                        text-align: center;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight= bold;
                                    ">
                                    <img src="assets/check-mail.png" alt="Email Confirmation" class="verification-image" style="max-width: 100px; margin-bottom: 10px;">
                                    <h2 style="margin-bottom: 10px;">Email Confirmation</h2>
                                    <p style="line-height: 1.6;">
                                        We have sent an email to <strong style="color: #418655">${email}</strong> to confirm the validity of your email address. 
                                        After receiving the email, click the button provided to complete your registration.<br><br>
                                        <strong>Note:</strong> The verification link will expire in 15 minutes.
                                    </p>
                                    <hr style="width: 80%; margin: 15px auto;">
                                    <p>If you do not receive an email, <strong><a href="#" style="color: #418655; cursor: pointer" onclick="resendEmail('${email}')" style="color: #007bff; text-decoration: none;">Resend Confirmation Mail</a></strong></p>
                                </div>
                            </div>
                    `;
                    }
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

// Function to resend the verification email
function resendEmail(email) {
    axios.post('http://127.0.0.1:8000/api/v1/admin/resend-verification', { email: email })
        .then(response => {
            alert("✅ A new verification email has been sent to your email address.");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("❌ Failed to resend verification email. Please try again later.");
        });
}










//  wag mo muna gagalawin to putangina mo (Successfull verification)


// `
//                         <div class="login-container">
//                             <div class="login-form">
//                                 <div 
//                                     class="verification-container"
//                                     style="
//                                         font-family: 'Poppins', sans-serif;
//                                         font-size: 12px;
//                                         text-align: center;
//                                         align-items: center;
//                                         justify-content: center;
//                                         font-weight= bold;
//                                     ">
//                                     <img src="assets/check.png" alt="Email Confirmation" class="verification-image" style="max-width: 100px; margin-bottom: 10px;">
//                                     <h2 style="margin-bottom: 10px;">Account Successfully Verified</h2>
//                                     <p style="line-height: 1.6;">
//                                         Your Email Address ${email}
// <br>
// <span style="color: #418655; font-weight: bold;">has been successfully verified !</span>
// <br>
// You can now log in to you account
// </p>
// <br>
//                                     <p style="cursor: pointer; color: #ffffff; background-color: #418655; padding: 10px 0; text-align: center; justify-content: center; align-item: center">Proceed</p>
//                                 </div>
//                             </div>
//                         </div>
//                     `
