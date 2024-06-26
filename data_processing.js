//U54529624
// Parses CSV files
function parseCSV(data) {
    const parsedData = [];
    const lines = data.split("\n");

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const [date, stock, price] = line.split(" ");
            parsedData.push({ date, stock, price: parseFloat(price) });
        }
    }
    return parsedData;
}

// Filters data by stock and range (date is null value)
function filterData(data, stockName = null, startDate = null, endDate = null) {
    return data.filter(item => {
        const date = new Date(item.date);
        const startDateValid = startDate ? new Date(startDate) <= date : true;
        const endDateValid = endDate ? new Date(endDate) >= date : true;
        const stockNameValid = stockName ? item.stock === stockName : true;
        return startDateValid && endDateValid && stockNameValid;
    });
}
