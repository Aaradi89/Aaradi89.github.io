function createLineChart(projects, NumberOfName) {

    // 1. Prepare data arrays for X and Y axis
    const dates = projects.map(project => new Date(project.updatedCompletedDate).getTime()); // Convert to timestamps
    const xpValues = projects.map(project => project.projectXP);

    // 2. Determine the chart's width and height
    const width = 1000;
    const height = 500;
    const padding = 120;

    // 3. Normalize the data to fit within the chart's dimensions
    const minXP = Math.min(...xpValues);
    const maxXP = Math.max(...xpValues);
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);

    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.style.border = "none";
    svg.style.backgroundColor = "#ffffff";
    svg.style.borderRadius = "15px";
    svg.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
    svg.style.padding = "10px";

    // Add gradient definitions
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Line gradient
    const lineGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    lineGradient.setAttribute("id", "lineGradient");
    lineGradient.setAttribute("x1", "0%");
    lineGradient.setAttribute("y1", "0%");
    lineGradient.setAttribute("x2", "100%");
    lineGradient.setAttribute("y2", "0%");
    
    const lineStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    lineStop1.setAttribute("offset", "0%");
    lineStop1.setAttribute("stop-color", "#4361ee");
    
    const lineStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    lineStop2.setAttribute("offset", "100%");
    lineStop2.setAttribute("stop-color", "#4cc9f0");
    
    lineGradient.appendChild(lineStop1);
    lineGradient.appendChild(lineStop2);
    
    // Area gradient
    const areaGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    areaGradient.setAttribute("id", "areaGradient");
    areaGradient.setAttribute("x1", "0%");
    areaGradient.setAttribute("y1", "0%");
    areaGradient.setAttribute("x2", "0%");
    areaGradient.setAttribute("y2", "100%");
    
    const areaStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    areaStop1.setAttribute("offset", "0%");
    areaStop1.setAttribute("stop-color", "#4361ee");
    areaStop1.setAttribute("stop-opacity", "0.3");
    
    const areaStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    areaStop2.setAttribute("offset", "100%");
    areaStop2.setAttribute("stop-color", "#4cc9f0");
    areaStop2.setAttribute("stop-opacity", "0.05");
    
    areaGradient.appendChild(areaStop1);
    areaGradient.appendChild(areaStop2);
    
    defs.appendChild(lineGradient);
    defs.appendChild(areaGradient);
    svg.appendChild(defs);

    // Add background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", width);
    background.setAttribute("height", height);
    background.setAttribute("fill", "#ffffff");
    background.setAttribute("rx", "15");
    svg.appendChild(background);

    // Create title 
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "500");
    title.setAttribute("y", "50");
    title.setAttribute("text-anchor", "middle");
    title.textContent = "Earned XP Per Project";
    title.setAttribute("font-size", "24");
    title.setAttribute("font-weight", "bold");
    title.setAttribute("fill", "#4361ee");
    svg.appendChild(title);

    // 4. Scale function to convert data points to chart coordinates
    const scaleX = (date) => padding + (date - minDate) / (maxDate - minDate) * (width - 2 * padding);
    const scaleY = (xp) => height - padding - (xp - minXP) / (maxXP - minXP) * (height - 2 * padding);

    // 5. Create the area path for the chart (filled area below the line)
    let areaPathData = `M${scaleX(dates[0])},${height - padding} L${scaleX(dates[0])},${scaleY(xpValues[0])}`;
    for (let i = 1; i < projects.length; i++) {
        areaPathData += ` L${scaleX(dates[i])},${scaleY(xpValues[i])}`;
    }
    areaPathData += ` L${scaleX(dates[projects.length-1])},${height - padding} Z`;

    const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    areaPath.setAttribute("d", areaPathData);
    areaPath.setAttribute("fill", "url(#areaGradient)");
    areaPath.setAttribute("opacity", "0");
    svg.appendChild(areaPath);
    
    // Animate the area path
    setTimeout(() => {
        areaPath.setAttribute("opacity", "1");
        areaPath.style.transition = "opacity 1s ease-in-out";
    }, 500);

    // 5. Create the line path for the chart
    let pathData = `M${scaleX(dates[0])},${scaleY(xpValues[0])}`; // Start path from the first data point
    for (let i = 1; i < projects.length; i++) {
        pathData += ` L${scaleX(dates[i])},${scaleY(xpValues[i])}`; // Add line to each subsequent point
    }

    // 6. Create the path element for the line chart
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "url(#lineGradient)");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-dasharray", path.getTotalLength());
    path.setAttribute("stroke-dashoffset", path.getTotalLength());
    
    // Animation for the line
    setTimeout(() => {
        path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
        path.setAttribute("stroke-dashoffset", "0");
    }, 100);

    // 7. Append the path to the SVG
    svg.appendChild(path);

    // 8. Add grid lines (horizontal and vertical)
    const gridLines = 4; // number of grid lines
    for (let i = 1; i <= gridLines; i++) {

        // Horizontal grid lines
        const horizontalGridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        horizontalGridLine.setAttribute("x1", padding);
        horizontalGridLine.setAttribute("y1", scaleY(minXP + (i * (maxXP - minXP)) / gridLines));
        horizontalGridLine.setAttribute("x2", width - padding);
        horizontalGridLine.setAttribute("y2", scaleY(minXP + (i * (maxXP - minXP)) / gridLines));
        horizontalGridLine.setAttribute("stroke", "#e0e0e0");
        horizontalGridLine.setAttribute("stroke-width", "1");
        horizontalGridLine.setAttribute("stroke-dasharray", "5,5");
        svg.appendChild(horizontalGridLine);

        // Vertical grid lines
        const verticalGridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        verticalGridLine.setAttribute("x1", scaleX(minDate + (i * (maxDate - minDate)) / gridLines));
        verticalGridLine.setAttribute("y1", padding);
        verticalGridLine.setAttribute("x2", scaleX(minDate + (i * (maxDate - minDate)) / gridLines));
        verticalGridLine.setAttribute("y2", height - padding);
        verticalGridLine.setAttribute("stroke", "#e0e0e0");
        verticalGridLine.setAttribute("stroke-width", "1");
        verticalGridLine.setAttribute("stroke-dasharray", "5,5");
        svg.appendChild(verticalGridLine);
    }

    // 9. X-axis (horizontal)
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", height - padding);
    xAxis.setAttribute("x2", width - padding);
    xAxis.setAttribute("y2", height - padding);
    xAxis.setAttribute("stroke", "#212529");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    // 10. Y-axis (vertical)
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", height - padding);
    yAxis.setAttribute("stroke", "#212529");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    // 11. Add axis labels
    const xAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xAxisLabel.setAttribute("x", width / 2);
    xAxisLabel.setAttribute("y", height - padding / 3);
    xAxisLabel.setAttribute("text-anchor", "middle");
    xAxisLabel.setAttribute("font-weight", "bold");
    xAxisLabel.setAttribute("fill", "#4361ee");
    xAxisLabel.textContent = "Date";
    svg.appendChild(xAxisLabel);

    const yAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yAxisLabel.setAttribute("x", padding / 2);
    yAxisLabel.setAttribute("y", height / 2);
    yAxisLabel.setAttribute("text-anchor", "middle");
    yAxisLabel.setAttribute("transform", "rotate(-90 " + padding / 2 + "," + height / 2 + ")");
    yAxisLabel.setAttribute("font-weight", "bold");
    yAxisLabel.setAttribute("fill", "#4361ee");
    yAxisLabel.textContent = "XP (KB)";
    svg.appendChild(yAxisLabel);

    // 12. Add value markers (tick marks)
    const tickSize = 4; // tick size
    const numTicksX = 4; // number of X ticks
    const numTicksY = 4; // number of Y ticks

    // X-axis value markers
    for (let i = 0; i <= numTicksX; i++) {
        const xTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const xValue = minDate + (i * (maxDate - minDate)) / numTicksX;
        xTick.setAttribute("x1", scaleX(xValue));
        xTick.setAttribute("y1", height - padding);
        xTick.setAttribute("x2", scaleX(xValue));
        xTick.setAttribute("y2", height - padding + tickSize);
        xTick.setAttribute("stroke", "#212529");
        svg.appendChild(xTick);

        const xTickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xTickLabel.setAttribute("x", scaleX(xValue));
        xTickLabel.setAttribute("y", height - padding + tickSize + 20);
        xTickLabel.setAttribute("text-anchor", "middle");
        xTickLabel.setAttribute("fill", "#212529");
        xTickLabel.setAttribute("font-size", "12");
        xTickLabel.textContent = new Date(xValue).toLocaleDateString();
        svg.appendChild(xTickLabel);
    }

    // Y-axis value markers
    for (let i = 0; i <= numTicksY; i++) {
        const yTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const yValue = minXP + (i * (maxXP - minXP)) / numTicksY;
        yTick.setAttribute("x1", padding - tickSize);
        yTick.setAttribute("y1", scaleY(yValue));
        yTick.setAttribute("x2", padding);
        yTick.setAttribute("y2", scaleY(yValue));
        yTick.setAttribute("stroke", "#212529");
        svg.appendChild(yTick);

        const yTickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yTickLabel.setAttribute("x", padding - tickSize - 12);
        yTickLabel.setAttribute("y", scaleY(yValue) + 4);
        yTickLabel.setAttribute("text-anchor", "end");
        yTickLabel.setAttribute("fill", "#212529");
        yTickLabel.setAttribute("font-size", "12");
        yTickLabel.textContent = yValue.toFixed(1);
        svg.appendChild(yTickLabel);
    }

    // Function to truncate text if too long
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + "...";
    };

    // Function to check if two labels would overlap
    const wouldOverlap = (x1, x2, minDistance) => {
        return Math.abs(x1 - x2) < minDistance;
    };

    // Calculate which labels to show to avoid overlapping
    const projectsToLabel = [];
    const minLabelDistance = 100; // Minimum distance between labels to avoid overlap
    const chartLeftBoundary = padding;
    const chartRightBoundary = width - padding;
    
    // Select projects to label based on the NumberOfName parameter and avoiding overlaps
    for (let i = 0; i < projects.length; i++) {
        if ((i + 1) % NumberOfName === 0) {
            const xPos = scaleX(dates[i]);
            
            // Check if this label would overlap with any previously selected label
            let overlaps = false;
            for (const labelPos of projectsToLabel) {
                if (wouldOverlap(xPos, labelPos.x, minLabelDistance)) {
                    overlaps = true;
                    break;
                }
            }
            
            if (!overlaps) {
                projectsToLabel.push({
                    index: i,
                    x: xPos,
                    y: scaleY(xpValues[i])
                });
            }
        }
    }

    // 13. Add project names and points
    projects.forEach((project, index) => {
        // Add a circle at each data point
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const xPos = scaleX(dates[index]);
        const yPos = scaleY(xpValues[index]);
        circle.setAttribute("cx", xPos);
        circle.setAttribute("cy", yPos);
        circle.setAttribute("r", "0");
        circle.setAttribute("fill", "#4895ef");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "2");
        
        // Animation for circles
        setTimeout(() => {
            circle.style.transition = "r 0.5s ease-out";
            circle.setAttribute("r", "6");
        }, 1500 + (index * 100));
        
        svg.appendChild(circle);

        // Add tooltip on hover
        circle.addEventListener("mouseover", function() {
            const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "g");
            tooltip.setAttribute("id", "tooltip-" + index);
            
            // Calculate tooltip width based on project name length to prevent trimming
            const projectNameWidth = project.projectName.length * 7;
            const tooltipWidth = Math.max(180, projectNameWidth + 40); // Ensure minimum width of 180px
            
            // Adjust tooltip position to ensure it stays within chart boundaries
            let tooltipX = xPos + 10;
            
            // Check if tooltip would extend beyond right edge
            if (tooltipX + tooltipWidth > chartRightBoundary - 10) {
                tooltipX = xPos - tooltipWidth - 10; // Place tooltip to the left of the point
            }
            
            const tooltipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            tooltipRect.setAttribute("x", tooltipX);
            tooltipRect.setAttribute("y", yPos - 60);
            tooltipRect.setAttribute("width", tooltipWidth);
            tooltipRect.setAttribute("height", "50");
            tooltipRect.setAttribute("fill", "#212529");
            tooltipRect.setAttribute("rx", "5");
            
            const tooltipXP = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tooltipXP.setAttribute("x", tooltipX + 10);
            tooltipXP.setAttribute("y", yPos - 40);
            tooltipXP.setAttribute("fill", "white");
            tooltipXP.setAttribute("font-size", "12");
            tooltipXP.textContent = `XP: ${project.projectXP}KB`;
            
            const tooltipName = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tooltipName.setAttribute("x", tooltipX + 10);
            tooltipName.setAttribute("y", yPos - 20);
            tooltipName.setAttribute("fill", "white");
            tooltipName.setAttribute("font-size", "12");
            tooltipName.textContent = `Project: ${project.projectName}`;
            
            tooltip.appendChild(tooltipRect);
            tooltip.appendChild(tooltipXP);
            tooltip.appendChild(tooltipName);
            svg.appendChild(tooltip);
            
            circle.setAttribute("r", "8");
        });
        
        circle.addEventListener("mouseout", function() {
            const tooltip = document.getElementById("tooltip-" + index);
            if (tooltip) {
                svg.removeChild(tooltip);
            }
            circle.setAttribute("r", "6");
        });
    });
    
    // Add project labels for selected points (to avoid overlapping)
    projectsToLabel.forEach(labelInfo => {
        const index = labelInfo.index;
        const project = projects[index];
        const xPos = labelInfo.x;
        const yPos = labelInfo.y;
        
        // Create a label container group
        const labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Add background for better readability
        const labelBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const truncatedName = truncateText(project.projectName, 15);
        const bgWidth = truncatedName.length * 7 + 10;
        
        // Adjust position to ensure label stays within chart boundaries
        let adjustedX = xPos;
        
        // Check if the label would extend beyond the left edge
        if (xPos - bgWidth/2 < chartLeftBoundary + 10) {
            adjustedX = chartLeftBoundary + 10 + bgWidth/2;
        }
        
        // Check if the label would extend beyond the right edge
        if (xPos + bgWidth/2 > chartRightBoundary - 10) {
            adjustedX = chartRightBoundary - 10 - bgWidth/2;
        }
        
        labelBg.setAttribute("x", adjustedX - bgWidth / 2);
        labelBg.setAttribute("y", yPos - 30);
        labelBg.setAttribute("width", bgWidth);
        labelBg.setAttribute("height", "20");
        labelBg.setAttribute("fill", "rgba(255, 255, 255, 0.8)");
        labelBg.setAttribute("rx", "4");
        labelGroup.appendChild(labelBg);
        
        // Add the project name
        const projectName = document.createElementNS("http://www.w3.org/2000/svg", "text");
        projectName.setAttribute("x", adjustedX);
        projectName.setAttribute("y", yPos - 15);
        projectName.setAttribute("text-anchor", "middle");
        projectName.setAttribute("fill", "#3f37c9");
        projectName.setAttribute("font-size", "12");
        projectName.setAttribute("font-weight", "bold");
        projectName.textContent = truncatedName;
        labelGroup.appendChild(projectName);
        
        // Add connecting line from label to point
        const connector = document.createElementNS("http://www.w3.org/2000/svg", "line");
        connector.setAttribute("x1", xPos);
        connector.setAttribute("y1", yPos - 10);
        connector.setAttribute("x2", adjustedX);
        connector.setAttribute("y2", yPos - 10);
        connector.setAttribute("stroke", "#3f37c9");
        connector.setAttribute("stroke-width", "1");
        connector.setAttribute("stroke-dasharray", "2,1");
        labelGroup.appendChild(connector);
        
        svg.appendChild(labelGroup);
    });

    return svg;
}
