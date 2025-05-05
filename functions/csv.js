const { saveAs } = require("file-saver");
const Papa = require("papaparse");

export const exportToCSV = (data, filename = "data.csv") => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
};

module.exports = {
    exportToCSV
};