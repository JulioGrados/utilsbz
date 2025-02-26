'use strict'

const csvParser = require("csv-parser");
const { Readable } = require("stream");

const parseCSV = async (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(buffer.toString());

        stream
            .pipe(csvParser()) // Usa la primera fila como nombres de las claves
            .on("data", (row) => {
                results.push(row);
            })
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};



module.exports = {
    parseCSV
}

