function createBarChart(passes, fails) {
    const total = passes + fails;
    const passPercentage = (passes / total) * 100;
    const failPercentage = (fails / total) * 100;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "500");
    svg.setAttribute("height", "450");
    svg.style.border = "none";
    svg.style.backgroundColor = "#ffffff";
    svg.style.borderRadius = "15px";
    svg.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
    svg.style.padding = "10px";

    // Add gradient definitions
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Pass gradient
    const passGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    passGradient.setAttribute("id", "passGradient");
    passGradient.setAttribute("x1", "0%");
    passGradient.setAttribute("y1", "0%");
    passGradient.setAttribute("x2", "0%");
    passGradient.setAttribute("y2", "100%");
    
    const passStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    passStop1.setAttribute("offset", "0%");
    passStop1.setAttribute("stop-color", "#4895ef");
    
    const passStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    passStop2.setAttribute("offset", "100%");
    passStop2.setAttribute("stop-color", "#4cc9f0");
    
    passGradient.appendChild(passStop1);
    passGradient.appendChild(passStop2);
    
    // Fail gradient
    const failGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    failGradient.setAttribute("id", "failGradient");
    failGradient.setAttribute("x1", "0%");
    failGradient.setAttribute("y1", "0%");
    failGradient.setAttribute("x2", "0%");
    failGradient.setAttribute("y2", "100%");
    
    const failStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    failStop1.setAttribute("offset", "0%");
    failStop1.setAttribute("stop-color", "#f72585");
    
    const failStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    failStop2.setAttribute("offset", "100%");
    failStop2.setAttribute("stop-color", "#b5179e");
    
    failGradient.appendChild(failStop1);
    failGradient.appendChild(failStop2);
    
    defs.appendChild(passGradient);
    defs.appendChild(failGradient);
    svg.appendChild(defs);

    // Add background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", "500");
    background.setAttribute("height", "450");
    background.setAttribute("fill", "#ffffff");
    background.setAttribute("rx", "15");
    svg.appendChild(background);

    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "250");
    title.setAttribute("y", "50");
    title.setAttribute("text-anchor", "middle");
    title.textContent = "Your Audits Ratio";
    title.setAttribute("font-size", "24");
    title.setAttribute("font-weight", "bold");
    title.setAttribute("fill", "#4361ee");
    svg.appendChild(title);

    const subtitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    subtitle.setAttribute("x", "250");
    subtitle.setAttribute("y", "80");
    subtitle.setAttribute("text-anchor", "middle");
    subtitle.textContent = "Pass vs Fail";
    subtitle.setAttribute("font-size", "18");
    subtitle.setAttribute("fill", "#3f37c9");
    svg.appendChild(subtitle);

    // Create pass bar
    const passBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    passBar.setAttribute("x", "100");
    passBar.setAttribute("y", 350 - (passPercentage * 2.5));
    passBar.setAttribute("width", "100");
    passBar.setAttribute("height", passPercentage * 2.5);
    passBar.setAttribute("fill", "url(#passGradient)");
    passBar.setAttribute("rx", "10");
    // Add animation
    passBar.setAttribute("opacity", "0");
    setTimeout(() => {
        passBar.setAttribute("opacity", "1");
        passBar.style.transition = "opacity 0.5s ease-in-out";
    }, 100);
    svg.appendChild(passBar);

    // Add pass label
    const passLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    passLabel.setAttribute("x", "150");
    passLabel.setAttribute("y", "380");
    passLabel.setAttribute("text-anchor", "middle");
    passLabel.textContent = "PASS";
    passLabel.setAttribute("font-size", "16");
    passLabel.setAttribute("font-weight", "bold");
    passLabel.setAttribute("fill", "#4361ee");
    svg.appendChild(passLabel);

    // Add pass value text
    const passText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    passText.setAttribute("x", "150");
    passText.setAttribute("y", 340 - (passPercentage * 2.5));
    passText.setAttribute("text-anchor", "middle");
    passText.textContent = passes;
    passText.setAttribute("font-size", "24");
    passText.setAttribute("font-weight", "bold");
    passText.setAttribute("fill", "#4361ee");
    svg.appendChild(passText);

    // Add pass percentage
    const passPercentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    passPercentText.setAttribute("x", "150");
    passPercentText.setAttribute("y", 320 - (passPercentage * 2.5));
    passPercentText.setAttribute("text-anchor", "middle");
    passPercentText.textContent = `${Math.round(passPercentage)}%`;
    passPercentText.setAttribute("font-size", "16");
    passPercentText.setAttribute("fill", "#4361ee");
    svg.appendChild(passPercentText);

    // Create fail bar
    const failBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    failBar.setAttribute("x", "300");
    failBar.setAttribute("y", 350 - (failPercentage * 2.5));
    failBar.setAttribute("width", "100");
    failBar.setAttribute("height", failPercentage * 2.5);
    failBar.setAttribute("fill", "url(#failGradient)");
    failBar.setAttribute("rx", "10");
    // Add animation
    failBar.setAttribute("opacity", "0");
    setTimeout(() => {
        failBar.setAttribute("opacity", "1");
        failBar.style.transition = "opacity 0.5s ease-in-out";
    }, 300);
    svg.appendChild(failBar);

    // Add fail label
    const failLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    failLabel.setAttribute("x", "350");
    failLabel.setAttribute("y", "380");
    failLabel.setAttribute("text-anchor", "middle");
    failLabel.textContent = "FAIL";
    failLabel.setAttribute("font-size", "16");
    failLabel.setAttribute("font-weight", "bold");
    failLabel.setAttribute("fill", "#f72585");
    svg.appendChild(failLabel);

    // Add fail value text
    const failText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    failText.setAttribute("x", "350");
    failText.setAttribute("y", 340 - (failPercentage * 2.5));
    failText.setAttribute("text-anchor", "middle");
    failText.textContent = fails;
    failText.setAttribute("font-size", "24");
    failText.setAttribute("font-weight", "bold");
    failText.setAttribute("fill", "#f72585");
    svg.appendChild(failText);

    // Add fail percentage
    const failPercentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    failPercentText.setAttribute("x", "350");
    failPercentText.setAttribute("y", 320 - (failPercentage * 2.5));
    failPercentText.setAttribute("text-anchor", "middle");
    failPercentText.textContent = `${Math.round(failPercentage)}%`;
    failPercentText.setAttribute("font-size", "16");
    failPercentText.setAttribute("fill", "#f72585");
    svg.appendChild(failPercentText);

    // Add horizontal line
    const horizontalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    horizontalLine.setAttribute("x1", "50");
    horizontalLine.setAttribute("y1", "350");
    horizontalLine.setAttribute("x2", "450");
    horizontalLine.setAttribute("y2", "350");
    horizontalLine.setAttribute("stroke", "#e0e0e0");
    horizontalLine.setAttribute("stroke-width", "2");
    svg.appendChild(horizontalLine);

    return svg;
}
