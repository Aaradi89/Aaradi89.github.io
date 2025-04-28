function toBase64Unicode(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return btoa(binary);
}

async function getLoginToken(username, password) { // Fetches the JWT token from Reboot login endpoint

    try {
        let newToken = "";

        let base64Credentials = toBase64Unicode(username + ":" + password);
        //Make a POST request to the signin endpoint, and supply your credentials using Basic authentication, with base64 encoding.
        let response = await fetch(`https://learn.reboot01.com/api/auth/signin`, {
            method: "POST",
            headers: {
                Authorization: `basic ${base64Credentials}`, // Encode a string in base64
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });


        newToken = await response.json(); // Wait for the full data to be loaded

        if (newToken.error) {
            console.error(newToken.error);
            return "error: " + newToken.error; // User does not exist or password incorrect
        }

        return newToken; // Return the token

    } catch (error) { // Catch any error
        console.error(error);
        return "error: " + error;
    }
}

async function getData(token) {

    await fetch(`https://learn.reboot01.com/api/graphql-engine/v1/graphql`, { // Get the data from reboot API with Token
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`, // Supply the JWT using Bearer authentication.
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // GraphQL Query to get the values for this user
            query: `query {
                        user {
                            firstName
                            lastName
                            login
                            email
                            createdAt
                            auditRatio
                            attrs

                            audits(where:{auditedAt:{_is_null: false}}) {
                            auditedAt
                            grade
                            }


                            progresses(where: {isDone: { _eq:true}}) {
                                createdAt
                                path
                                results {
                                    id
                                    grade
                                }
                            }


                            progressesByPath {
                                createdAt
                                updatedAt
                                path
                                succeeded
                            }

                            xps {
                                amount
                                originEventId
                                event {
                                    createdAt
                                }
                                path
                            }
                        }
                    }`
        })
    }).then(response => {
        response.json().then(json => { // Transfer to JSON format


            if (json.errors && json.errors.length > 0) { // Return error (If any)
                console.error(json.errors);
                json.errors.forEach(error => {
                    console.error(error);
                    alert(error);
                });
            } else {
                showUserData(json.data);    // Show the output for the user in the profile page
            }
        });
    }).catch(error => {
        console.error(error);
    });
}