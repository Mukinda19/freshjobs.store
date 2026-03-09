import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function runScript(script){

return new Promise((resolve)=>{

const start = Date.now()

console.log(`\n🚀 Starting ${script}`)

exec(`node ${path.join(__dirname,script)}`, (error, stdout, stderr) => {

if(stdout) console.log(stdout)

if(stderr) console.log(stderr)

if(error){

console.log(`❌ ${script} failed`)
console.log(error.message)

return resolve(false)

}

const time=((Date.now()-start)/1000).toFixed(2)

console.log(`✅ ${script} completed in ${time}s`)

resolve(true)

})

})

}

async function main(){

const startAll = Date.now()

console.log("\n🔥 FreshJobs MASTER FETCH STARTED\n")

const scripts=[

"fetch-jobs.js",      // RSS feeds
"fetch-api-jobs.js"   // APIs

]

let success=0

for(const script of scripts){

const ok=await runScript(script)

if(ok) success++

}

const totalTime=((Date.now()-startAll)/1000).toFixed(2)

console.log("\n📊 FETCH SUMMARY")
console.log(`Scripts run: ${scripts.length}`)
console.log(`Successful: ${success}`)
console.log(`Failed: ${scripts.length-success}`)
console.log(`Total time: ${totalTime}s`)

console.log("\n🎉 ALL JOB FETCH COMPLETED\n")

}

main().catch(err=>{

console.error("❌ MASTER SCRIPT ERROR",err)

process.exit(1)

})