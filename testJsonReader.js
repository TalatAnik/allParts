const fs = require('fs')
let jsonArray = []

function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/output.json', (err, data) => {
      if (err) reject(err)
      
      const jsonData = JSON.parse(data)
      
      for (let i = 0; i < 5; i++) {
        console.log(jsonData[i])
        jsonArray.push(jsonData[i])
      }
      resolve(jsonArray)
    })
  })
}

async function populateJsonArray() {
  await readFile()
}

populateJsonArray()