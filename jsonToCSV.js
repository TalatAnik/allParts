const fs = require('fs');
const json2csv = require('json2csv').parse;
const path = require('path');

// Load JSON file
const inputPath = path.join(__dirname, 'output/total.json');
const jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));


// Get the total number of objects in the JSON file
const totalObjects = jsonData.length;
console.log(`Total number of objects in the JSON file: ${totalObjects}`);

// Determine headers
let headers = [];
jsonData.forEach((item) => {
  headers = headers.concat(Object.keys(item));
});
headers = [...new Set(headers)]; // remove duplicates

// Create CSV data
const csvData = json2csv(jsonData, { header: true, fields: headers });

const rows = csvData.split('\n');
const totalRows = rows.length - 1; // Subtract the header row
console.log(`Total number of rows in the CSV file: ${totalRows}`);


// Write CSV file
const outputPath = path.join(__dirname, 'output/final_output.csv');
fs.writeFileSync(outputPath, headers.join(',') + '\n' + csvData, 'utf-8');
console.log('CSV file created!');
