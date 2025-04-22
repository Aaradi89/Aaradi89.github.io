function createPiscineBarChart(PiscineCount, ChartTitle, TopResults) {
    // Create SVG container
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "800");
    svg.setAttribute("height", "600");
    svg.style.border = "none";
    svg.style.backgroundColor = "#ffffff";
    svg.style.borderRadius = "15px";
    svg.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";

    // Add gradient definitions
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Bar gradient
    const barGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    barGradient.setAttribute("id", "barGradient");
    barGradient.setAttribute("x1", "0%");
    barGradient.setAttribute("y1", "0%");
    barGradient.setAttribute("x2", "0%");
    barGradient.setAttribute("y2", "100%");
    
    const barStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    barStop1.setAttribute("offset", "0%");
    barStop1.setAttribute("stop-color", "#4361ee");
    
    const barStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    barStop2.setAttribute("offset", "100%");
    barStop2.setAttribute("stop-color", "#3a0ca3");
    
    barGradient.appendChild(barStop1);
    barGradient.appendChild(barStop2);
    defs.appendChild(barGradient);
    
    // Hover gradient
    const hoverGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    hoverGradient.setAttribute("id", "hoverGradient");
    hoverGradient.setAttribute("x1", "0%");
    hoverGradient.setAttribute("y1", "0%");
    hoverGradient.setAttribute("x2", "0%");
    hoverGradient.setAttribute("y2", "100%");
    
    const hoverStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    hoverStop1.setAttribute("offset", "0%");
    hoverStop1.setAttribute("stop-color", "#4895ef");
    
    const hoverStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    hoverStop2.setAttribute("offset", "100%");
    hoverStop2.setAttribute("stop-color", "#4cc9f0");
    
    hoverGradient.appendChild(hoverStop1);
    hoverGradient.appendChild(hoverStop2);
    defs.appendChild(hoverGradient);
    
    svg.appendChild(defs);

    // Add background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", "800");
    background.setAttribute("height", "600");
    background.setAttribute("fill", "#ffffff");
    background.setAttribute("rx", "15");
    svg.appendChild(background);

    // Add title
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "400");
    title.setAttribute("y", "40");
    title.setAttribute("text-anchor", "middle");
    title.textContent = ChartTitle;
    title.setAttribute("font-size", "24");
    title.setAttribute("font-weight", "bold");
    title.setAttribute("fill", "#4361ee");
    svg.appendChild(title);

    // Add subtitle
    const subtitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    subtitle.setAttribute("x", "400");
    subtitle.setAttribute("y", "70");
    subtitle.setAttribute("text-anchor", "middle");
    subtitle.textContent = "Top " + TopResults + " Results";
    subtitle.setAttribute("font-size", "16");
    subtitle.setAttribute("fill", "#3f37c9");
    svg.appendChild(subtitle);

    // Calculate chart dimensions
    const chartWidth = 700;
    const chartHeight = 400; 
    const marginLeft = 50;
    const marginTop = 100;
    const marginBottom = 100; 

    // Sort piscine count in descending order
    const sortedPiscines = Object.entries(PiscineCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, TopResults);

    // Calculate bar width and spacing
    const barCount = sortedPiscines.length;
    const barWidth = Math.min(80, (chartWidth / barCount) * 0.7);
    const barSpacing = (chartWidth / barCount) - barWidth;

    // Find maximum value for scaling
    const maxValue = Math.max(...sortedPiscines.map(item => item[1]));
    const scaleFactor = chartHeight / maxValue;

    // Add horizontal grid lines
    const gridLineCount = 5;
    const gridLineSpacing = chartHeight / gridLineCount;

    for (let i = 0; i <= gridLineCount; i++) {
        const y = marginTop + chartHeight - (i * gridLineSpacing);
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", marginLeft);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("x2", marginLeft + chartWidth);
        gridLine.setAttribute("y2", y);
        gridLine.setAttribute("stroke", "#e9ecef");
        gridLine.setAttribute("stroke-width", "1");
        svg.appendChild(gridLine);

        // Add y-axis labels
        const value = Math.round((i / gridLineCount) * maxValue);
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", marginLeft - 10);
        label.setAttribute("y", y + 5);
        label.setAttribute("text-anchor", "end");
        label.textContent = value;
        label.setAttribute("font-size", "12");
        label.setAttribute("fill", "#6c757d");
        svg.appendChild(label);
    }

    // Add y-axis title
    const yAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yAxisTitle.setAttribute("x", "20");
    yAxisTitle.setAttribute("y", marginTop + chartHeight / 2);
    yAxisTitle.setAttribute("text-anchor", "middle");
    yAxisTitle.setAttribute("transform", `rotate(-90, 20, ${marginTop + chartHeight / 2})`);
    yAxisTitle.textContent = "Number of Attempts";
    yAxisTitle.setAttribute("font-size", "14");
    yAxisTitle.setAttribute("fill", "#495057");
    svg.appendChild(yAxisTitle);

    // Add x-axis line
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", marginLeft);
    xAxis.setAttribute("y1", marginTop + chartHeight);
    xAxis.setAttribute("x2", marginLeft + chartWidth);
    xAxis.setAttribute("y2", marginTop + chartHeight);
    xAxis.setAttribute("stroke", "#adb5bd");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    // Add y-axis line
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", marginLeft);
    yAxis.setAttribute("y1", marginTop);
    yAxis.setAttribute("x2", marginLeft);
    yAxis.setAttribute("y2", marginTop + chartHeight);
    yAxis.setAttribute("stroke", "#adb5bd");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    // Create bars with animation
    sortedPiscines.forEach((item, index) => {
        const [piscineName, count] = item;
        const barHeight = count * scaleFactor;
        const x = marginLeft + (index * (barWidth + barSpacing)) + barSpacing / 2;
        const y = marginTop + chartHeight - barHeight;

        // Create bar group
        const barGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Create the bar
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x);
        bar.setAttribute("y", marginTop + chartHeight); 
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", 0); 
        bar.setAttribute("fill", "url(#barGradient)");
        bar.setAttribute("rx", "5");
        bar.setAttribute("ry", "5");
        
        // Add hover effect
        bar.addEventListener("mouseenter", function() {
            this.setAttribute("fill", "url(#hoverGradient)");
            valueLabel.setAttribute("opacity", "1");
            valueLabel.setAttribute("y", y - 10);
            nameTooltip.setAttribute("opacity", "1");
        });
        
        bar.addEventListener("mouseleave", function() {
            this.setAttribute("fill", "url(#barGradient)");
            valueLabel.setAttribute("opacity", "0.7");
            valueLabel.setAttribute("y", y - 5);
            nameTooltip.setAttribute("opacity", "0");
        });
        
        barGroup.appendChild(bar);
        
        // Animate the bar after a delay
        setTimeout(() => {
            bar.style.transition = "y 0.8s ease-out, height 0.8s ease-out";
            bar.setAttribute("y", y);
            bar.setAttribute("height", barHeight);
        }, index * 100);

        // Function to truncate text if too long
        const truncateText = (text, maxLength) => {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength - 3) + "...";
        };

        // Add x-axis label (piscine name)
        const nameLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        nameLabel.setAttribute("x", x + barWidth / 2);
        nameLabel.setAttribute("y", marginTop + chartHeight + 20);
        nameLabel.setAttribute("text-anchor", "middle");
        
        // Truncate long names
        const displayName = truncateText(piscineName, 15);
        nameLabel.textContent = displayName;
        
        nameLabel.setAttribute("font-size", "12");
        nameLabel.setAttribute("fill", "#495057");
        nameLabel.style.opacity = "0";
        
        // Always rotate labels for better readability
        nameLabel.setAttribute("transform", `rotate(45, ${x + barWidth / 2}, ${marginTop + chartHeight + 20})`);
        nameLabel.setAttribute("x", x + barWidth / 2 - 5);
        nameLabel.setAttribute("text-anchor", "start");
        
        // Animate the label
        setTimeout(() => {
            nameLabel.style.transition = "opacity 0.5s ease-in";
            nameLabel.style.opacity = "1";
        }, index * 100 + 500);
        
        barGroup.appendChild(nameLabel);
        
        // Create tooltip for full name on hover
        const nameTooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
        nameTooltip.setAttribute("x", x + barWidth / 2);
        nameTooltip.setAttribute("y", marginTop + chartHeight + 60);
        nameTooltip.setAttribute("text-anchor", "middle");
        nameTooltip.textContent = piscineName;
        nameTooltip.setAttribute("font-size", "14");
        nameTooltip.setAttribute("font-weight", "bold");
        nameTooltip.setAttribute("fill", "#212529");
        nameTooltip.setAttribute("opacity", "0");
        nameTooltip.style.pointerEvents = "none"; 
        
        // Add background for tooltip
        const tooltipBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        tooltipBg.setAttribute("x", x + barWidth / 2 - 5);
        tooltipBg.setAttribute("y", marginTop + chartHeight + 45);
        tooltipBg.setAttribute("width", piscineName.length * 8 + 10);
        tooltipBg.setAttribute("height", "20");
        tooltipBg.setAttribute("fill", "#f8f9fa");
        tooltipBg.setAttribute("stroke", "#e9ecef");
        tooltipBg.setAttribute("stroke-width", "1");
        tooltipBg.setAttribute("rx", "5");
        tooltipBg.setAttribute("opacity", "0");
        tooltipBg.style.pointerEvents = "none";
        
        // Group tooltip elements
        const tooltipGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        tooltipGroup.appendChild(tooltipBg);
        tooltipGroup.appendChild(nameTooltip);
        
        // Add the tooltip group to the bar group
        barGroup.appendChild(tooltipGroup);
        
        // Update tooltip position and visibility on hover
        bar.addEventListener("mouseenter", function() {
            tooltipBg.setAttribute("opacity", "0.9");
            nameTooltip.setAttribute("opacity", "1");
        });
        
        bar.addEventListener("mouseleave", function() {
            tooltipBg.setAttribute("opacity", "0");
            nameTooltip.setAttribute("opacity", "0");
        });

        // Add value label
        const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueLabel.setAttribute("x", x + barWidth / 2);
        valueLabel.setAttribute("y", y - 5);
        valueLabel.setAttribute("text-anchor", "middle");
        valueLabel.textContent = count;
        valueLabel.setAttribute("font-size", "14");
        valueLabel.setAttribute("font-weight", "bold");
        valueLabel.setAttribute("fill", "#4361ee");
        valueLabel.setAttribute("opacity", "0");
        
        // Animate the value label
        setTimeout(() => {
            valueLabel.style.transition = "opacity 0.5s ease-in";
            valueLabel.setAttribute("opacity", "0.7");
        }, index * 100 + 800);
        
        barGroup.appendChild(valueLabel);
        
        svg.appendChild(barGroup);
    });

    return svg;
}
