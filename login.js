document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get email and password from inputs
    const email = emailInput.value;
    const password = passwordInput.value;

    const requestBody = {
      email: email,
      password: password,
    };

    // Send POST request to login API endpoint
    fetch("https://77fhquitji.execute-api.us-east-1.amazonaws.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        // Handle successful login
        console.log(data);
        // Save user_id in localStorage
        localStorage.setItem("user_id", data.user_id); //storing user id
        // Redirect to index page
        window.location.href = "index.html";
      })
      .catch((error) => {
        // Handle login error
        console.error(error);
        alert("Login failed");
      });
  });
});
