const Papa = require("papaparse");
const XLSX = require("xlsx");
const { saveAs } = require("file-saver");

const prepareDataForExport = (data) => {
    return data.map(item => {
        const newItem = { ...item };
        for (const key in newItem) {
            if (Array.isArray(newItem[key])) {
                newItem[key] = newItem[key].join(", ");
            }
        }
        return newItem;
    });
};

const exportToCSV = (data, filename = "data.csv") => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
};

const exportToXLSX = (data, filename = "data.xlsx") => {
    const preparedData = prepareDataForExport(data);

    const worksheet = XLSX.utils.json_to_sheet(preparedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, filename);
};

module.exports = {
    exportToCSV,
    exportToXLSX,
};