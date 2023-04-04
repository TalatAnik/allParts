const fs = require('fs');

const file1 = 'total_final.json';
const file2 = 'data/output.json';
const outputFile = 'data/comparison3.json';

// Load the data from the two files
const data1 = JSON.parse(fs.readFileSync(file1));
const data2 = JSON.parse(fs.readFileSync(file2));

// Extract the "part" values from the objects in file-1
const parts = data1.map(obj => obj.part);

// Filter the objects in file-2 to only include those with a SKU not in file-1
const filteredData = data2.filter(obj => !parts.includes(obj.SKU));

// Write the filtered data to the output file
fs.writeFileSync(outputFile, JSON.stringify(filteredData,null,2));

// Output the total number of objects in the output file
console.log(`Total objects in output file: ${filteredData.length}`);
