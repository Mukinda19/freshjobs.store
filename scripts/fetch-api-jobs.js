import fs from "fs"
import path from "path"
import crypto from "crypto"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname,"../data")
const SEEN_FILE = path.join(DATA_DIR,"seen.json")

const APPSCRIPT_POST_URL =
"https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

const hash = (s) =>
crypto.createHash("sha256").update(s || "").digest("hex")

/* ---------------- STORAGE ---------------- */

function loadSeen(){
try{
return JSON.parse(fs.readFileSync(SEEN_FILE,"utf8"))
}catch{
return {}
}
}

function saveSeen(data){
fs.writeFileSync(SEEN_FILE,JSON.stringify(data,null,2))
}

/* ---------------- SLUG ---------------- */

function generateSlug(title,link){

const base=(title||"job")
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-")
.replace(/(^-|-$)/g,"")

const id=crypto
.createHash("md5")
.update(link||title)
.digest("hex")
.slice(0,6)

return `${base}-${id}`

}

/* ---------------- CATEGORY ---------------- */

function detectCategory(title){

const t=(title||"").toLowerCase()

if(t.includes("ai")||t.includes("machine learning")) return "ai"
if(t.includes("developer")||t.includes("software")) return "it"
if(t.includes("marketing")||t.includes("sales")) return "sales"
if(t.includes("bank")) return "banking"

return "work-from-home"

}

/* ---------------- SAFE FETCH ---------------- */

async function safeFetch(url){

const controller = new AbortController()

const timeout = setTimeout(()=>{
controller.abort()
},10000)

try{

const res = await fetch(url,{signal:controller.signal})
clearTimeout(timeout)

return res

}catch(err){

console.log(`⚠️ Fetch failed: ${url}`)
return null

}

}

/* ---------------- POST JOB ---------------- */

async function postJob(payload){

try{

const res = await fetch(APPSCRIPT_POST_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
})

return res.ok

}catch{

return false

}

}

/* ---------------- REMOTIVE ---------------- */

async function fetchRemotive(seen){

console.log("🔎 Fetching Remotive API")

const res = await safeFetch("https://remotive.com/api/remote-jobs")

if(!res) return

const data = await res.json()

let count=0

for(const job of data.jobs.slice(0,300)){

const link=job.url
const id=hash(link)

if(seen[id]) continue

const title=job.title
const category=detectCategory(title)

const payload={

title,
slug:generateSlug(title,link),
company:job.company_name,
location:job.candidate_required_location||"Remote",
category,
source:"Remotive",
link,
description:job.description,
datePosted:job.publication_date

}

const ok = await postJob(payload)

if(ok){

seen[id]=true
count++

console.log(`✅ ${title}`)

}

}

console.log(`🎉 Remotive jobs: ${count}`)

}

/* ---------------- ARBEITNOW ---------------- */

async function fetchArbeitnow(seen){

console.log("🔎 Fetching Arbeitnow API")

const res = await safeFetch("https://www.arbeitnow.com/api/job-board-api")

if(!res) return

const data = await res.json()

let count=0

for(const job of data.data.slice(0,300)){

const link=job.url
const id=hash(link)

if(seen[id]) continue

const title=job.title
const category=detectCategory(title)

const payload={

title,
slug:generateSlug(title,link),
company:job.company_name,
location:job.location||"Worldwide",
category,
source:"Arbeitnow",
link,
description:job.description,
datePosted:new Date().toISOString()

}

const ok = await postJob(payload)

if(ok){

seen[id]=true
count++

console.log(`✅ ${title}`)

}

}

console.log(`🎉 Arbeitnow jobs: ${count}`)

}

/* ---------------- MAIN ---------------- */

async function main(){

console.log("🚀 API job fetch started")

const seen=loadSeen()

await Promise.all([
fetchRemotive(seen),
fetchArbeitnow(seen)
])

saveSeen(seen)

console.log("🎉 API job fetch completed")

}

main().catch(err=>{
console.log("❌ API fetch error",err)
})