const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

// function to write to a file a JSON string object
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 2), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

// function to read a file, then add new content and write to the database
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// function to read a file, filter the data to not include any entry with a matching id
const readAndDelete = (file, id) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            var filteredData = parsedData.filter(e => e.id !== id);
            writeToFile(file, filteredData);
        }
    });
};

module.exports = { readFromFile, writeToFile, readAndAppend, readAndDelete };