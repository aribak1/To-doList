document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup_btn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get input values
        var username = document.getElementById('username').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Create payload object
        var payload = {
            username: username,
            email: email,
            password: password
        };
        console.log(payload);

        // Make POST request to signup API endpoint
        fetch('https://77fhquitji.execute-api.us-east-1.amazonaws.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log(data);
            alert('Signup successful! Redirecting to login page...');
            // Redirect to login page
            window.location.href = 'login.html';
        })
        .catch(error => {
            // Handle error
            console.error('There was an error!', error);
            alert('Signup failed. Please try again.');
        });
    });
});
