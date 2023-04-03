const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const jsonfile = require('jsonfile');
const ObjectsToCsv = require('objects-to-csv');

const jsonFiles = ['output/sample_01.json', 'output/sample_02.json', 'output/sample_03.json', 'output/sample_04.json'];

async function convertJSONtoCSV(jsonFile) {
  const inputFile = path.join(__dirname, jsonFile);
  const outputFile = path.join(__dirname, `${jsonFile.split('.')[0]}.csv`);

  const data = await jsonfile.readFile(inputFile);
  const headerSet = new Set();
  const objects = [];

  // Get all the keys from all the objects, without duplicates
  for (let obj of data) {
    for (let key in obj) {
      headerSet.add(key);
    }
  }

  const headers = Array.from(headerSet);
  const csvWriter = new ObjectsToCsv(objects);

  // Add headers to CSV file
  csvWriter.write({
    headers: headers
  });

  // Write each object to CSV file
  for (let obj of data) {
    const csvObj = {};

    // Map each object key to CSV header
    for (let key in obj) {
      csvObj[headers.indexOf(key)] = obj[key];
    }

    objects.push(csvObj);
    csvWriter.write(csvObj);
  }

  // Save CSV file
  await csvWriter.toDisk(outputFile, { append: false });

  console.log(`Total objects in ${jsonFile}: ${data.length}`);
  console.log(`Total rows in ${outputFile}: ${objects.length}`);
}

async function main() {
  for (let file of jsonFiles) {
    await convertJSONtoCSV(file);
  }
}

main();
