document.addEventListener('DOMContentLoaded', function () { // Wait for full page to be loaded

    const token = localStorage.getItem('rebootToken');      // Check if token exists when the page loads
    
    if (token) {    // If token exists, skip login form and show user content
        
        document.querySelector('.container').style.display = 'none'; // Hide login form
        document.querySelector('.signout-button').style.display = 'block'; // Show sign-out button
        getData(token); // Fetch data using the token

    } else {    // If no token, show login form
        document.querySelector('.container').style.display = 'block'; // Show login form
        document.querySelector('.signout-button').style.display = 'none'; // Hide sign-out button
    }

    // Add event listener for login button click
    document.querySelector('.button').addEventListener('click', event => { // Add a Listener for the form login button
        event.preventDefault(); // Prevent the form from being submitted in the default way

        var username = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        try {

            if (token) {    // If token exists, use it to get data     
                getData(token); // Get Data using the above Token
            } else {

                getLoginToken(username, password).then(newToken => { // Get Token from Reboot for this user
                    if (newToken != "" && !newToken.startsWith("error:")) {
                        
                        localStorage.setItem('rebootToken', newToken);            // Store the token in localStorage
                        const storedToken = localStorage.getItem('rebootToken');
                        console.log('Token Stored:', storedToken);

                        // Get data using the new token
                        getData(newToken);
                    } else {
                        alert(newToken);
                    }
                });
            }

        } catch (error) {
            console.log(error);
        }
        return false;
    });
});

// Sign-out function
function logOut() {
    contentDiv.innerHTML = ""; // Clear user details
    contentDiv.style.display = 'none'; // Hide user info div
    document.querySelector('.container').style.display = 'block'; // Show login form (container)
    document.querySelector('.signout-button').style.display = 'none'; // Hide SIGN OUT button

    // Clear the values
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    localStorage.removeItem('rebootToken');
}
