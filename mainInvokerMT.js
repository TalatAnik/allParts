const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn


const featCatsFile = 'data/output.json'

const outputFileA = "output/sample_01.json"
const outputFileB = "output/sample_02.json"
const outputFileC = "output/sample_03.json"
const outputFileD = "output/sample_04.json"

async function runPupeteer(data) {
  
  const jsonData = JSON.stringify(data)
  const b64Data = Buffer.from(jsonData).toString('base64')
  let stdoutData = ''

  return await new Promise((resolve) => {
    const proc = spawn('node', [
      path.resolve(__dirname, 'scrapePageNew.js'),
      `--input-data${b64Data}`,
      '--tagprocess'
    ], { shell: false })

    proc.stdout.on('data', (data) => {
      stdoutData += data
      console.log("message: ", data)
    })

    proc.stderr.on('data', (data) => {
      console.error(`NodeERR: error detected`)
      proc.kill()
      resolve(stdoutData)
    })

    proc.on('close', async (code) => {
    })

    proc.on('exit', function () {
      proc.kill()
      resolve(stdoutData)
    })

  })

}



async function run() {
  
  const skus = jsonfile.readFileSync(featCatsFile)

  await wait(1500)

  const promises = []

  for (var i=5000; i<6000; i+=4)
  {

    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()

    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'====== featured category no: '+ i +' to ' + + (i+3) +'===========')
    console.log(skus[i].SKU, skus[i+1].SKU, skus[i+2].SKU, skus[i+3].SKU)
    
    arg1 = {
      sku: skus[i].SKU,
      cache: "cacheFolder",
      outFile: outputFileA
    }

    arg2 = {
      sku: skus[i+1].SKU,
      cache: "cacheFolder2",
      outFile: outputFileB
    }

    arg3 = {
      sku: skus[i+2].SKU,
      cache: "cacheFolder3",
      outFile: outputFileC
    }

    arg4 = {
      sku: skus[i+3].SKU,
      cache: "cacheFolder4",
      outFile: outputFileD
    }

    // await runPupeteer([arg1, arg2, arg3, arg4])
    
    promises.push(runPupeteer(arg1))
    promises.push(runPupeteer(arg2))
    promises.push(runPupeteer(arg3))
    promises.push(runPupeteer(arg4))

    await Promise.all(promises)
    promises.length = 0
  }


  
}


function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}


run()