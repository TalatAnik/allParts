const fs = require('fs');
const csv = require('csv-parser');
const jsonfile = require('jsonfile');

let jsonObjects = [];
let columnNames = [];

fs.createReadStream('data/skus.csv')
  .pipe(csv())
  .on('data', (row) => {
    let obj = {};
    if (row[0] !== '') {
      if (columnNames.length === 0) {
        columnNames = row;
      } else {
        for (let i = 0; i < row.length; i++) {
          obj[columnNames[i]] = row[i];
        }
        jsonObjects.push(obj);
      }
    }
  })
  .on('end', () => {
    jsonfile.writeFile('data/output.json', jsonObjects, function (err) {
      if (err) console.error(err);
      console.log(`Number of objects written to file: ${jsonObjects.length}`);
    });
  });