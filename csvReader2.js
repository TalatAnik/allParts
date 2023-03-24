const fs = require('fs')
const csv = require('csv-parser')

let jsonObjects = []

fs.createReadStream('data/skus.csv')
  .pipe(csv())
  .on('data', (row) => {
    jsonObjects.push(row)
  })
  .on('end', () => {
    const jsonString = JSON.stringify(jsonObjects, null, 2)
    fs.writeFileSync('output.json', jsonString, 'utf8')
    console.log(`${jsonObjects.length} objects read`)
  })