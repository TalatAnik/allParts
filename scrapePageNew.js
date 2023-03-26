const puppeteer = require('puppeteer')
const fs = require('fs')
// const jsonfile = require('jsonfile')

let row = {}

// const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
// const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

const outputFileA = "output/sample01.json"
const outputFileB = "output/sample02.json"
const outputFileC = "output/sample03.json"
const outputFileD = "output/sample04.json"


async function main (searchString, browserCache, outputFile) {
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'], userDataDir: browserCache})
  const page = await browser.newPage()
  await page.goto('https://www.allpartsstore.com/ItemDetl.htm?ItemNumber='+searchString)
  
  // Scraping code goes here
//   const inputField = await page.$('input[name="TextSearch"]')
//   await inputField.type(searchString || '123')
//   const submitButton = await page.$('input[type="submit"][value="Search"]')
//   await submitButton.click()
  

  // await page.waitForNavigation({ waitUntil: 'networkidle2' })
  
  
  
  // Check if div with class "partNumber" exists
  const partNumberDiv = await page.$('.partNumber')
  if (partNumberDiv) {
    const textContent = await page.evaluate(element => element.textContent, partNumberDiv)
    console.log(textContent)
    row.part = textContent
  }


  // Check if div with id "partDescription" exists
  const partDescriptionDiv = await page.$('#partDescription')
  if (partDescriptionDiv) {
    const textContent = await page.evaluate(element => element.textContent.trimStart(), partDescriptionDiv)
    console.log(textContent)
    row.name = textContent
  }
  
  // Check if div with class "partPrice" exists
  const partPriceDiv = await page.$('.partPrice')
  if (partPriceDiv) {
    const textContent = await page.evaluate(element => element.textContent, partPriceDiv)
    const weightIndex = textContent.indexOf("weight:")
    const weightText = textContent.substring(weightIndex + 8).trimStart()
    console.log(weightText)
    row.weight = weightText
  }
  
  // Check if div with id "attContainer" exists
  // const attContainerDiv = await page.$('#attContainer')
  // if (attContainerDiv) {
  //   // Find all the <p> elements within the div with id "attContainer"
  //   const pElements = await page.$$('#attContainer>p')
  //   let textContents = []
  //   for (let i = 0; i < pElements.length; i++) {
  //     const textContent = await page.evaluate(element => element.innerText, pElements[i])
  //     textContents.push(textContent)
  //   }

  //   let productDescription = textContents.join('<br>')
  //   console.log(productDescription)
  //   row.description = productDescription
  // } else
  // {
  //   row.description = "null"
  // }


  const pElements = await page.$$('#attContainer p')
  let textContents = []
  for (let i = 0; i < pElements.length; i++) {
    const textContent = await page.evaluate(element => element.innerText, pElements[i])
    textContents.push(textContent)
  }
  console.log(textContents)

  let productDescription = textContents.join('<br>')
  console.log(productDescription)
  row.description = productDescription

  
  
  // Check if div with id "associatearea" exists
  const associateAreaDiv = await page.$('#associatearea')
  if (associateAreaDiv) {
    // Get all rows starting from the second row
    const tableRows = await page.$$('#associatearea tr:nth-child(n+2)')
    let extractedTexts = []
    for (let i = 0; i < tableRows.length; i++) {
      // Get the text from the first column
      const textContent = await page.evaluate(element => element.cells[0].innerText, tableRows[i])
      extractedTexts.push(textContent)
    }
    console.log(extractedTexts.join(', ').replace(/\s{2,}/g, ' ').trimStart())
    row.associated = extractedTexts.join(', ').replace(/\s{2,}/g, ' ').trimStart()
  } else {
    console.log('null')
    row.associated = 'null'
  }

  // Ensure all the contents on the page are loaded before looking for the images in the smallimgboxdivs
  await page.waitForSelector('div[id="smallimgbox"]')
  
  // Find all the divs with the id "smallimgbox" if any exists
  const smallImgBoxDivs = await page.$$('div[id="smallimgbox"] a img')
  if (smallImgBoxDivs.length > 0) {
    let urls = []
    for (let i = 0; i < smallImgBoxDivs.length; i++) {
      const url = await page.evaluate(element => element.getAttribute('src'), smallImgBoxDivs[i])
      urls.push(url)
    }
    // console.log(urls.join(','))
    row.images = urls.join(',')

    // Download and save the images within the anchor tags in the divs with id "smallimgbox" without changing the name of the image files
    for (let i = 0; i < urls.length; i++) {
      const fileName = urls[i].split('/').pop()
      const response = await page.goto(urls[i])
      await fs.writeFileSync(fileName, await response.buffer())
    }
  }
  
  console.log(JSON.stringify(row, null, 2))
  console.log('===================================')

  let prodStr = JSON.stringify(row, null, 2)
  prodStr += ',\n'
  fs.appendFileSync(outputFile, prodStr)
  


  await browser.close()
}

// main (inputData[0], inputData[1])


async function parallel(data1, data2, data3, data4) {
  Promise.allSettled(
    [
      main(data1.sku, data1.cache, outputFileA),
      main(data2.sku, data2.cache, outputFileB),
      main(data3.sku, data3.cache, outputFileC),
      main(data4.sku, data4.cache, outputFileD)
    ]
  )
}

// void parallel(inputData[0], inputData[1], inputData[2], inputData[3])


main('A-AM136327', "cacheFolder", outputFileA)