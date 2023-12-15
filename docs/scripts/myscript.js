// add your JavaScript/D3 to this file
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var data = [{'borough': 'BRONX', 'salary': 60489.08}, {'borough': 'BROOKLYN', 'salary': 62027.56}, {'borough': 'MANHATTAN', 'salary': 82130.08}, {'borough': 'OTHER', 'salary': 109857.73}, {'borough': 'QUEENS', 'salary': 61280.07}, {'borough': 'RICHMOND', 'salary': 68550.15}];

var locations = {'BRONX': {'x': 0.75, 'y': 0.2, 'r': 0.025}, 'BROOKLYN': {'x': 0.5, 'y': 0.5, 'r': 0.075}, 'MANHATTAN': {'x': 0.3, 'y': 0.3, 'r': 0.05}, 'OTHER': {'x': 0.4, 'y': 0.6, 'r': 0.1}, 'QUEENS': {'x': 0.7, 'y': 0.5, 'r': 0.04}, 'RICHMOND': {'x': 0.1, 'y': 0.7, 'r': 0.06}};

// Create bubbles
var bubble = svg.selectAll(".bubble")
    .data(data)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
        return "translate(" + (locations[d.borough].x * width) + "," + (locations[d.borough].y * height) + ")";
    });

bubble.append("circle")
    .attr("r", function(d) { return locations[d.borough].r * width; })
    .style("fill", "pink") // Apply fill color directly
    .style("stroke", "black")
    .style("stroke-width", "1px");

// Add labels to the bubbles
bubble.append("text")
    .attr("class", "label")
    .attr("dy", ".3em")
    .text(function(d) { return d.borough; });

// Add hover interaction to display salary
bubble.on("mouseover", function(event, d) {
    d3.select(this).select("circle").transition()
        .duration(300)
        .attr("opacity", 0.6);
    var xPosition = parseFloat(d3.select(this).attr("transform").split("(")[1]);
    var yPosition = parseFloat(d3.select(this).attr("transform").split(",")[1]);

    svg.append("text")
        .attr("id", "tooltip")
        .attr("x", xPosition)
        .attr("y", yPosition - locations[d.borough].r * width - 10)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("$" + d.salary.toFixed(2));
})
    .on("mouseout", function(event, d) {
        d3.select(this).select("circle").transition()
            .duration(300)
            .attr("opacity", 1);
        d3.select("#tooltip").remove();
    });

// Button to toggle the salary table view
var button = d3.select("body").append("button")
    .text("Click to display the salary sorting table")
    .on("click", function() {
        if (d3.select("table").empty()) {
            // Create a table element and the header
            var table = d3.select("body").append("table");
            table.append("thead").append("tr")
                .selectAll("th")
                .data(["Borough", "Annual Salary"])
                .enter()
                .append("th")
                .text(function(column) { return column; });
            var tbody = table.append("tbody");

            // Sort the data by salary in descending order for the table
            var sortedData = data.sort(function(a, b) {
                return b.salary - a.salary;
            });

            // Create a row for each object in the data
            tbody.selectAll("tr")
                .data(sortedData)
                .enter()
                .append("tr")
                .selectAll("td")
                .data(function(row) {
                    return ["borough", "salary"].map(function(column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append("td")
                .text(function(d) { return d.value; });
        } else {
            d3.select("table").remove();
        }
    });