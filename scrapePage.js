const puppeteer = require('puppeteer')
const fs = require('fs');

async function main (searchString, browserCache) {
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'], userDataDir: browserCache})
  const page = await browser.newPage()
  await page.goto('https://www.allpartsstore.com/index.htm')
  
  // Scraping code goes here
  const inputField = await page.$('input[name="TextSearch"]')
  await inputField.type(searchString || '123')
  const submitButton = await page.$('input[type="submit"][value="Search"]')
  await submitButton.click()
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  
  
  
  // Check if div with class "partNumber" exists
  const partNumberDiv = await page.$('.partNumber')
  if (partNumberDiv) {
    const textContent = await page.evaluate(element => element.textContent, partNumberDiv)
    console.log(textContent)
  }


  // Check if div with id "partDescription" exists
  const partDescriptionDiv = await page.$('#partDescription')
  if (partDescriptionDiv) {
    const textContent = await page.evaluate(element => element.textContent.trimStart(), partDescriptionDiv)
    console.log(textContent)
  }
  
  // Check if div with class "partPrice" exists
  const partPriceDiv = await page.$('.partPrice')
  if (partPriceDiv) {
    const textContent = await page.evaluate(element => element.textContent, partPriceDiv)
    const weightIndex = textContent.indexOf("weight:")
    const weightText = textContent.substring(weightIndex + 8).trimStart()
    console.log(weightText)
  }
  
  // Check if div with id "attContainer" exists
  const attContainerDiv = await page.$('#attContainer')
  if (attContainerDiv) {
    // Find all the <p> elements within the div with id "attContainer"
    const pElements = await page.$$('#attContainer>p')
    let textContents = []
    for (let i = 0; i < pElements.length; i++) {
      const textContent = await page.evaluate(element => element.innerText.trimStart(), pElements[i])
      textContents.push(textContent)
    }

    let productDescription = textContents.join('<br>').replace(/\s{2,}/g, ' ')
    console.log(productDescription)
  }
  
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
  } else {
    console.log('null')
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
    console.log(urls.join(','))
    
    // Download and save the images within the anchor tags in the divs with id "smallimgbox" without changing the name of the image files
    for (let i = 0; i < urls.length; i++) {
      const fileName = urls[i].split('/').pop();
      const response = await page.goto(urls[i]);
      await fs.writeFileSync(fileName, await response.buffer());
    }
  }
  
  await browser.close()
}

main (process.argv[2], './cacheFolder')