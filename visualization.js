// Sets dimensions and creates elements
const width = 600;
const height = 600;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Runs parsing JS
d3.text("mock_stock_data.csv").then(data => {
    const stockData = parseCSV(data);

    // Defines scales and axes
    const x = d3.scaleTime().range([0, width - margin.left - margin.right]);
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    x.domain(d3.extent(stockData, d => new Date(d.date)));
    y.domain([0, d3.max(stockData, d => d.price)]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Define line path function
    const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.price));

    // Add line path
    svg.append("path")
        .datum(stockData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add circles and tooltips
    svg.selectAll("circle")
        .data(stockData)
        .enter()
        .append("circle")
        .attr("cx", d => x(new Date(d.date)))
        .attr("cy", d => y(d.price))
        .attr("r", 5)
        .attr("fill", "red")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Date: ${d.date}<br>Stock: ${d.stock}<br>Price: ${d.price}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Dropdowns for stock filtering
    const stocks = [...new Set(stockData.map(d => d.stock))];
    const dropdown = d3.select("body").append("select")
        .attr("id", "stockDropdown")
        .selectAll("option")
        .data(stocks)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    dropdown.on("change", function() {
        const selectedStock = this.value;
        const filteredData = filterData(stockData, selectedStock);
        updateChart(filteredData);
    });

    // Function to update chart
    function updateChart(data) {
        x.domain(d3.extent(data, d => new Date(d.date)));
        y.domain([0, d3.max(data, d => d.price)]);

        svg.selectAll("g.x.axis").call(xAxis);
        svg.selectAll("g.y.axis").call(yAxis);

        svg.selectAll("path")
            .datum(data)
            .attr("d", line);

        svg.selectAll("circle")
            .data(data)
            .attr("cx", d => x(new Date(d.date)))
            .attr("cy", d => y(d.price));
    }
});

