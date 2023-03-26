const fs = require('fs')

fs.readFile('data/output.json', (err, data) => {
  if (err) throw err
  const jsonData = JSON.parse(data)
  console.log(`Total number of objects in the file: ${jsonData.length}`)
  for (let i = 0; i < 5; i++) {
    console.log(jsonData[i])
  }
})

