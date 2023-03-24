const puppeteer = require('puppeteer')

async function main (searchString) {
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'], userDataDir: './cacheFolder'})
  const page = await browser.newPage()
  await page.goto('https://www.allpartsstore.com/index.htm')
  
  // Scraping code goes here
  const inputField = await page.$('input[name="TextSearch"]')
  await inputField.type(searchString || '123')
  const submitButton = await page.$('input[type="submit"][value="Search"]')
  await submitButton.click()
  await page.waitForNavigation()
  
  // Check if div with id "partDescription" exists
  const partDescriptionDiv = await page.$('#partDescription')
  if (partDescriptionDiv) {
    const textContent = await page.evaluate(element => element.textContent, partDescriptionDiv)
    console.log(textContent)
  }
  
  // Check if div with class "partNumber" exists
  const partNumberDiv = await page.$('.partNumber')
  if (partNumberDiv) {
    const textContent = await page.evaluate(element => element.textContent, partNumberDiv)
    console.log(textContent)
  }
  
  // Check if div with class "partPrice" exists
  const partPriceDiv = await page.$('.partPrice')
  if (partPriceDiv) {
    const textContent = await page.evaluate(element => element.textContent, partPriceDiv)
    const weightIndex = textContent.indexOf("weight:")
    const weightText = textContent.substring(weightIndex + 8)
    console.log(weightText)
  }
  
  // await browser.close()
}

main (process.argv[2])