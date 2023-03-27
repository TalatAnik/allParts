const puppeteer = require('puppeteer')
const fs = require('fs')

let row = {}
row.description = ''

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
  await page.waitForSelector('#attContainer')

  const attContainerDiv = await page.$('#attContainer')
    if (attContainerDiv) {
      // Get all elements with p tag
      const pElements = await page.$$('#attContainer p')
      let extractedTexts = []
      for (let i = 0; i < pElements.length; i++) {
        // Get the text from the element
        const textContent = await page.evaluate(element => element.innerText.replace(/\\/g, ''), pElements[i])
        extractedTexts.push(textContent)
      }
      console.log(extractedTexts.join(', ').replace(/\s{2,}/g, ' ').trimStart())
      row.description = extractedTexts.join(', ').replace(/\s{2,}/g, ' ').trimStart()
    } else {
      console.log('null')
      row.description = 'null'
  }
  
  // Check if div with id "associatearea" exists
  await page.waitForSelector('#associatearea')
  
  const associateAreaDiv = await page.$('#associatearea')
  if (associateAreaDiv) {
    // Get all rows starting from the second row
    const tableRows = await page.$$('#associatearea tr:nth-child(n+2)')
    let extractedTexts = []
    
    
    for (let i = 0; i < tableRows.length; i++) {
      // Get the text from the first column
      const textContent = await page.evaluate(element => element.cells[0].textContent, tableRows[i])
      extractedTexts.push(textContent)
    }
    console.log(extractedTexts.join(', ').replace(/\s{2,}/g, ' ').trimStart())
    row.associated = extractedTexts.join(', ').replace(/\s{2,}/g, ' ').trimStart()
    
    if (row.associated == "")
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
      await fs.writeFileSync(`images/${fileName}`, await response.buffer())
    }
  }
  
  console.log(JSON.stringify(row, null, 2))
  console.log('===================================')

  await browser.close()

}


main('A-AL68485', 'cacheFolder', 'output/test.json')