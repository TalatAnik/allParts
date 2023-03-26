const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn


const featCatsFile = 'data/output.json'



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
      // console.log("message: ", Buffer.from(data).toString('base64'))
    })

    proc.stderr.on('data', (data) => {
      console.error(`NodeERR: ${data}`)
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

  for (var i=0; i<4; i+=4)
  {

    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()

    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'====== featured category no: '+ i + ' and '+ (i+1) + ' and '+ (i+2) + ' and '+ (i+3) +'===========')
    console.log(skus[i].SKU, skus[i+1].SKU, skus[i+2].SKU, skus[i+3].SKU )
    
    arg1 = {
      sku: skus[i].SKU,
      cache: "./cacheFolder"
    }

    arg2 = {
      sku: skus[i+1].SKU,
      cache: "./cacheFolder2"
    }

    arg3 = {
      sku: skus[i+2].SKU,
      cache: "./cacheFolder3"
    }

    arg4 = {
      sku: skus[i+3].SKU,
      cache: "./cacheFolder4"
    }

    await runPupeteer([arg1, arg2, arg3, arg4])
    
    
  }
  
}

run()