import fs from "fs"
import path from "path"
import Parser from "rss-parser"
import crypto from "crypto"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const APPSCRIPT_POST_URL =
"https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

const FEEDS_PATH = path.join(__dirname,"feeds.json")
const DATA_DIR = path.join(__dirname,"../data")
const SEEN_FILE = path.join(DATA_DIR,"seen.json")

if(!fs.existsSync(DATA_DIR)){
fs.mkdirSync(DATA_DIR,{recursive:true})
}

/* ---------- RSS PARSER ---------- */

const parser = new Parser({
timeout:20000,
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}
})

const wait=(ms)=>new Promise(r=>setTimeout(r,ms))

const hash=(s)=>
crypto.createHash("sha256").update(s||"").digest("hex")

/* ---------- RETRY FETCH ---------- */

async function fetchWithRetry(url,retries=3){

try{

const res=await fetch(url,{
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
"Accept":"application/rss+xml, application/xml;q=0.9,*/*;q=0.8"
}
})

if(!res.ok){

if(retries>0){
console.log(`🔁 Retry ${url} (${retries})`)
await wait(2000)
return fetchWithRetry(url,retries-1)
}

return res

}

return res

}catch(err){

if(retries>0){
console.log(`🔁 Retry error ${url}`)
await wait(2000)
return fetchWithRetry(url,retries-1)
}

throw err

}

}

/* ---------- SLUG ---------- */

function generateSlug(title,link){

const base=(title||"job-opening")
.toLowerCase()
.replace(/<[^>]*>?/gm,"")
.replace(/[^a-z0-9]+/g,"-")
.replace(/(^-|-$)/g,"")

const id=crypto
.createHash("md5")
.update(link||title)
.digest("hex")
.slice(0,6)

return `${base}-${id}`

}

/* ---------- STORAGE ---------- */

function loadSeen(){
try{
return JSON.parse(fs.readFileSync(SEEN_FILE,"utf8"))
}catch{
return{}
}
}

function saveSeen(data){
fs.writeFileSync(SEEN_FILE,JSON.stringify(data,null,2))
}

/* ---------- CATEGORY ENGINE ---------- */

function detectCategory(feedCategory,title){

const t=(title||"").toLowerCase()

if(feedCategory==="govt") return "govt-jobs"
if(feedCategory==="wfh") return "work-from-home"

if(t.includes("remote")) return "work-from-home"

if(t.includes("developer")||t.includes("software")) return "it"

if(t.includes("ai")||t.includes("machine learning")) return "ai"

if(t.includes("sales")||t.includes("marketing")) return "sales"

if(t.includes("bank")) return "banking"

return "general"

}

/* ---------- NEWS FILTER ---------- */

function isNews(title){

const t=(title||"").toLowerCase()

const badWords=[
"result",
"exam result",
"board result",
"university result",
"admit card",
"answer key",
"cut off",
"syllabus",
"timetable",
"date sheet",
"students",
"college result",
"school result",
"announcement",
"results declared"
]

return badWords.some(w=>t.includes(w))

}

/* ---------- DESCRIPTION ---------- */

function buildDescription(title,category){

const cat=category.replace(/-/g," ")

return `Apply for the latest ${title}. Explore new ${cat} opportunities from trusted companies worldwide. Check eligibility, salary details and apply through the official job link.`

}

/* ---------- MAIN ---------- */

async function main(){

console.log("🚀 Job fetch started")

const feeds=JSON.parse(fs.readFileSync(FEEDS_PATH,"utf8"))
const seen=loadSeen()

let postedCount=0

for(const f of feeds){

try{

console.log(`🔎 Reading feed: ${f.source}`)

const res=await fetchWithRetry(f.url)

if(!res.ok){

console.log(`⚠️ Feed failed: ${f.source} | Status: ${res.status}`)
continue

}

const xml=await res.text()

if(!xml.includes("<rss") && !xml.includes("<feed")){

console.log(`⚠️ Invalid RSS: ${f.source}`)
continue

}

const feed=await parser.parseString(xml)

/* -------- JOB LIMIT INCREASED -------- */

for(const item of feed.items.slice(0,300)){

const link=item.link || item.guid || ""
const id=hash(link)

if(!link||seen[id]) continue

/* -------- TITLE CLEAN -------- */

const title=(item.title||"").replace(/\s+/g," ").trim()

if(!title) continue

if(isNews(title)) continue

const category=detectCategory(f.category,title)

const slug=generateSlug(title,link)

const job={

title,
slug,
company:item.creator||item.author||f.source,
location:item.location||"Worldwide",
category,
source:f.source,
link,

description:
item.contentSnippet||
item.summary||
buildDescription(title,category),

datePosted:item.pubDate||new Date().toISOString()

}

const post=await fetch(APPSCRIPT_POST_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(job)
})

if(post.ok){

seen[id]=true
postedCount++

console.log(`✅ Posted: ${title}`)

}

await wait(200)

}

}catch(err){

console.log(`⚠️ Feed error (${f.source}):`,err.message)

}

}

saveSeen(seen)

console.log(`🎉 Fetch completed. Jobs posted: ${postedCount}`)

}

main().catch(err=>{
console.error("❌ Fatal error:",err)
process.exit(1)
})