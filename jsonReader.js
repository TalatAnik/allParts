const fs = require('fs')

fs.readFile('total_final.json', (err, data) => {
  if (err) throw err
  const jsonData = JSON.parse(data)
  console.log(`Total number of objects in the file: ${jsonData.length}`)
})

