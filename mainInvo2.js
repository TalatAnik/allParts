const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

let cache1 = 'cacheFolder'
let cache2 = 'cacheFolder2'
let cache3 = 'cacheFolder3'
let cache4 = 'cacheFolder4'

let jsonArray = []




function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/output.json', (err, data) => {
      if (err) reject(err)
      
      const jsonData = JSON.parse(data)
      
      for (let i = 0; i < jsonData.length; i++) {
        // console.log(jsonData[i])
        jsonArray.push(jsonData[i])
      }
      resolve(jsonArray)
    })
  })
}



async function populateJsonArray() {
  await readFile()

  for(let i=0; i<12; i++) {
    if(jsonArray.length>0)
      console.log(jsonArray[i].SKU)
  }

  for (let i = 4; i < 12; i += 4) {


    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()

    arg1 = {
      url: jsonArray[i].SKU,
      cache: "./browserCache1"
    }

    arg2 = {
      url: jsonArray[i+1].SKU,
      cache: "./browserCache2"
    }

    arg3 = {
      url: jsonArray[i+2].SKU,
      cache: "./browserCache3"
    }

    arg4 = {
      url: jsonArray[i+3].SKU,
      cache: "./browserCache4"
    }

    // const arg1 = jsonArray[i].SKU 
    // const arg2 = cache1
    // const arg3 = jsonArray[i+1].SKU
    // const arg4 = cache2
    // const arg5 =jsonArray[i+2].SKU
    // const arg6 = cache3
    // const arg7 = jsonArray[i+3].SKU
    // const arg8 = cache4
    

    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'====== featured category no: '+ i + ' and '+ (i+1) + ' and '+ (i+2) + ' and '+ (i+3) +'===========')
    
    
    
    
    
    // const thread1 = new Promise((resolve, reject) => {
    //   execFile('node', ['scrapePageNew.js', ...args1], (err, stdout, stderr) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
    
    // const thread2 = new Promise((resolve, reject) => {
    //   execFile('node', ['scrapePageNew.js', ...args2], (err, stdout, stderr) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
    
    // const thread3 = new Promise((resolve, reject) => {
    //   execFile('node', ['scrapePageNew.js', ...args3], (err, stdout, stderr) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
    
    // const thread4 = new Promise((resolve, reject) => {
    //   execFile('node', ['scrapePageNew.js', ...args4], (err, stdout, stderr) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
    
    // await Promise.all([thread1, thread2, thread3, thread4]);
  


    


  }
}

populateJsonArray()
