document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("❌ Please fill in both email and password.");
            return;
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

        axios.post('http://127.0.0.1:8000/api/v1/admin/login', {
            email: email,
            password: password
        }, {
            headers: { 'X-CSRF-TOKEN': csrfToken },
            withCredentials: true
        })
        .then(response => {
            const data = response.data;

            if (data.verified === false) { 
                // If email is not verified, show the verification page
                showVerificationMessage(email);
            } else if (data.message === 'Login successful') {
                // Redirect to dashboard if email is verified
                window.location.href = "dashboard.html";
            }
        })
        .catch(error => {
            if (error.response && error.response.data.message === "Email not verified") {
                // Explicitly check for the "Email not verified" response
                showVerificationMessage(email);
            } else {
                alert("❌ Invalid email or password!");
            }
        });
    });
});

// Function to display verification message
function showVerificationMessage(email) {
    document.body.innerHTML = `
        <div class="login-container">
            <div class="login-form">
                <div class="verification-container"
                    style="font-family: 'Poppins', sans-serif; font-size: 12px; text-align: center; align-items: center; justify-content: center; font-weight: bold;">
                    <img src="assets/check.png" alt="Email Confirmation" class="verification-image" style="max-width: 100px; margin-bottom: 10px;">
                    <h2 style="margin-bottom: 10px;">Account Verification Required</h2>
                    <p style="line-height: 1.6;">
                        Your Email Address <strong style="color: #418655">${email}</strong><br>
                        <span style="color: #418655; font-weight: bold;">is not yet verified!</span><br>
                        Please check your email inbox for a verification link.
                    </p>
                    <br>
                    <p style="cursor: pointer; color: #ffffff; background-color: #418655; padding: 10px 0; text-align: center; justify-content: center; align-items: center"
                        onclick="resendVerificationEmail('${email}')">
                        Resend Verification Email
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Function to resend verification email
function resendVerificationEmail(email) {
    axios.post('http://127.0.0.1:8000/api/v1/admin/resend-verification', { email })
        .then(response => alert("✅ A new verification email has been sent."))
        .catch(error => alert("❌ Error resending verification email."));
}



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

