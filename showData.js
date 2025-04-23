const contentDiv = document.getElementById("showUserInfo");

function showUserData(data) {

    document.querySelector('.container').style.display = 'none'; // Hide login form (container)
    document.querySelector('.signout-button').style.display = 'block'; // Show SIGN OUT button
    contentDiv.style.display = 'block'; // Explicitly show the user info div
    contentDiv.innerHTML = ""; //Clear user details

    let userDetails = data.user[0]; // Store all user details

    //================================================================================
    // Show Basic User identification in the first section -- #1
    //================================================================================
    let userInfo = document.createElement("div");

    userInfo.innerHTML = `<br><h2>${userDetails.firstName} ${userDetails.lastName} (${userDetails.login})</h2>
    <h3>From <span>${userDetails.attrs.country}-${userDetails.attrs.addressCity}</span>, Joined on <span>${userDetails.createdAt.split('T')[0]}</span></h3>
    
    <h4>Your Current Audit Ratio is <span>${userDetails.auditRatio.toFixed(1)}</span>
    and the contact number is <span>${userDetails.attrs.Phone || userDetails.attrs.PhoneNumber}</span></h4><br>`;


    updateUserPage(userInfo, "UserInfo"); // Send to update the profile page


    //================================================================================
    // Show Audit ratio in the second section --  #2
    //================================================================================
    let passAudits = 0;
    let failAudits = 0;


    userDetails.audits.forEach(audit => {   // Go through all user audits & count pass vs fail
        if (audit.auditedAt) {              // Sample -  id: 21442, auditedAt: "2024-07-02T17:16:07.719+00:00", grade: 1.1764705882352942, … } / { id: 2924, auditedAt: "2023-08-17T17:05:03.114454+00:00", grade: 0.8, … }
            if (audit.grade >= 1) {
                passAudits++;
            } else {
                failAudits++;
            }
        }
    });

    updateUserPage(createBarChart(passAudits, failAudits), "AuditGraph"); // Call the function to draw the chart - BarChart
    // updateUserPage(createPieChart(passAudits, failAudits), "AuditGraph"); // Call the function to draw the chart - PieChart

    //================================================================================
    // Show XP earned per project (Go, JS),  in the third section --  #3
    //================================================================================
    let UserPaths = {};
    let ProjInfo = {};
    let ProjInfo2 = {};
    let Iterative = 0;
    let Iterative2 = 0;

    userDetails.progresses.forEach(progress => {    // Store the progress for each project/exercise/piscine
        UserPaths[progress.path] = progress;
    });

    userDetails.progressesByPath.forEach(byPath => {    // Store the attended project/exercise/piscine (Pass=true/Fail=false)
        if (UserPaths[byPath.path] != null) {
            UserPaths[byPath.path].succeeded = byPath.succeeded;
            UserPaths[byPath.path].updatedAt = byPath.updatedAt; // Completed date
        }
    });

    userDetails.xps.forEach(xp => {     // Store the XP per path
        UserPaths[xp.path].xp = xp.amount;
    });


    Object.values(UserPaths).forEach(path => {
        if (path.xp) {

            let completedDate = new Date(path.updatedAt);
            completedDate.setHours(completedDate.getHours() + 3);   // Add 3 hours to the date to match GMT time (match the website)
            let updatedCompletedDate = completedDate.toISOString(); // Format the date

            let projectName = path.path.split('/')[3]; // Get the project name only (Golang + JS)
            let projectXP = path.xp / 1000



            if (projectName.includes("quest") || projectName.includes("checkpoint") ||
                projectName.includes("piscine-js") || projectName.includes("quad") ||
                projectName.includes("sudoku")) {

                ProjInfo2[Iterative2] = { projectName, projectXP, updatedCompletedDate }
                Iterative2++

            } else {
                ProjInfo[Iterative] = { projectName, projectXP, updatedCompletedDate }
                Iterative++
            }
        }
    });

    // Sort the ProjInfo array based on updatedCompletedDate
    const sortedProjInfo = Object.values(ProjInfo).sort((a, b) => {
        const dateA = new Date(a.updatedCompletedDate);
        const dateB = new Date(b.updatedCompletedDate);
        return dateA - dateB;  // Sorting in ascending order
    });


    // Sort the ProjInfo array based on updatedCompletedDate
    const sortedProjInfo2 = Object.values(ProjInfo2).sort((a, b) => {
        const dateA = new Date(a.updatedCompletedDate);
        const dateB = new Date(b.updatedCompletedDate);
        return dateA - dateB;  // Sorting in ascending order
    });


    updateUserPage(createLineChart(sortedProjInfo, 3), "XP"); // Call the function to draw the chart - LineChart + Sequent of project names to be shown
    // updateUserPage(createLineChart(sortedProjInfo2, 3), "XP"); // Call the function to draw the chart - LineChart - For piscine,checkpoints


    //================================================================================
    // Show Piscine (JS/Go) stats  - Attempts for each exercise --  #4
    //================================================================================
    let UserPiscineAttemptsJS = {};
    let UserPiscineAttemptsGO = {};
    let JsID = 0;
    let GoID = 0;
    let JsPathCount = {};
    let GoPathCount = {};



    userDetails.progresses.forEach(progress => {    // Loop through the progresses of the user.

        if (progress.path.includes("piscine-js")) { // Filter JS Piscine
            progress.results.forEach(result => {
                let JsPath = progress.path;
                let JsGrade = result.grade;

                let JsPathNa = JsPath.split('/').pop();         // Get only the piscine name
                let JsPathName = JsPathNa.split('-').pop();     // If the name comes with - (Checkpoint), take the last value 


                // Track the count of each JS path
                if (!JsPathCount[JsPathName]) {
                    JsPathCount[JsPathName] = 0;
                }
                JsPathCount[JsPathName]++;

                UserPiscineAttemptsJS[JsID] = { JsPath, JsGrade };  // If needed
                JsID++;
            });

        } else if (progress.path.includes("bh-piscine")) { // Filter Go Piscine
            progress.results.forEach(result => {
                let GoPath = progress.path;
                let GoGrade = result.grade;

                let GoPathNa = GoPath.split('/').pop();         // Get only the piscine name
                let GoPathName = GoPathNa.split('-').pop();     // If the name comes with - (Checkpoint), take the last value 

                // Track the count of each GO path
                if (!GoPathCount[GoPathName]) {
                    GoPathCount[GoPathName] = 0;
                }
                GoPathCount[GoPathName]++;

                UserPiscineAttemptsGO[GoID] = { GoPath, GoGrade }; // If needed
                GoID++;
            });
        }
    });


    // Sort Go paths by count (descending)
    const sortedGoPathCount = Object.entries(GoPathCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});


    // Sort JS paths by count (descending)
    const sortedJsPathCount = Object.entries(JsPathCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});


    updateUserPage(createPiscineBarChart(sortedGoPathCount, "Attempts Per Exercise - Top 20 In Go Piscine", 20), "Piscine"); // Call the function to draw the chart - Bar chart
    updateUserPage(createPiscineBarChart(sortedJsPathCount, "Attempts Per Exercise - Top 20 In JS Piscine", 20), "Piscine"); // Call the function to draw the chart - Bar chart
}


function updateUserPage(section, type) {

    if (type == "Piscine") {
        // section.classList.add("Piscinestyle"); // If needed for additional style
        section.open = true;
        contentDiv.appendChild(section); // Update the profile page
        contentDiv.appendChild(document.createElement("br")); // Add a break line
        contentDiv.appendChild(document.createElement("br")); // Add a break line
    } else {
        section.open = true;
        contentDiv.appendChild(section); // Update the profile page
        contentDiv.appendChild(document.createElement("br")); // Add a break line
        contentDiv.appendChild(document.createElement("br")); // Add a break line
    }
}
