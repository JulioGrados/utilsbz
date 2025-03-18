'use strict'

const csvParser = require("csv-parser");
const { Readable } = require("stream");
const iconv = require("iconv-lite");

const parseCSV = async (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const decodedString = iconv.decode(buffer, "utf8"); // Si sigue fallando, prueba con "latin1"
        const stream = Readable.from(decodedString);

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

