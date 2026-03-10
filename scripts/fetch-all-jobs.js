import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCRIPT_TIMEOUT = 1000 * 60 * 5 // 5 minutes

function runScript(script){

return new Promise((resolve)=>{

const scriptPath = path.join(__dirname,script)

const start = Date.now()

console.log(`\n🚀 Starting ${script}`)

const process = exec(`node "${scriptPath}"`,{
timeout: SCRIPT_TIMEOUT,
maxBuffer: 1024 * 1024 * 20
},
(error,stdout,stderr)=>{

if(stdout) console.log(stdout)

if(stderr) console.log(stderr)

const time=((Date.now()-start)/1000).toFixed(2)

if(error){

if(error.killed){

console.log(`⏰ ${script} timed out after ${time}s`)

}else{

console.log(`❌ ${script} failed`)
console.log(error.message)

}

return resolve(false)

}

console.log(`✅ ${script} completed in ${time}s`)

resolve(true)

})

})

}

async function main(){

const startAll = Date.now()

console.log("\n🔥 FreshJobs MASTER FETCH STARTED\n")

const scripts=[

"fetch-jobs.js",      // RSS jobs
"fetch-api-jobs.js"   // API jobs

]

let success=0

/* ---------------- PARALLEL EXECUTION ---------------- */

const results = await Promise.all(

scripts.map(script=>runScript(script))

)

results.forEach(ok=>{
if(ok) success++
})

/* ---------------- SUMMARY ---------------- */

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