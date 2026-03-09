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

const parser = new Parser({
timeout:20000
})

const wait=(ms)=>new Promise(r=>setTimeout(r,ms))

const hash=(s)=>
crypto.createHash("sha256").update(s||"").digest("hex")

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

/* INTERNATIONAL */

const abroadWords=[
"abroad","overseas","international",
"uae","saudi","qatar","oman",
"kuwait","canada","usa","uk",
"australia","europe","singapore"
]

if(abroadWords.some(w=>t.includes(w))) return "international"

/* REMOTE */

const remoteWords=[
"remote","work from home","wfh",
"anywhere","distributed","freelance"
]

if(remoteWords.some(w=>t.includes(w))) return "work-from-home"

/* AI */

const aiWords=[
"artificial intelligence",
"machine learning",
"deep learning",
"ai engineer",
"ml engineer",
"nlp engineer",
"computer vision",
"data scientist"
]

if(aiWords.some(w=>t.includes(w))) return "ai"

/* IT */

const itWords=[
"developer","software engineer","programmer",
"full stack","frontend","backend",
"react","node","python","java"
]

if(itWords.some(w=>t.includes(w))) return "it"

/* SALES */

const salesWords=[
"sales","business development",
"marketing","digital marketing"
]

if(salesWords.some(w=>t.includes(w))) return "sales"

/* BANKING */

const bankWords=[
"bank","banking",
"loan officer","credit officer"
]

if(bankWords.some(w=>t.includes(w))) return "banking"

return "general"

}

/* ---------- NEWS FILTER ---------- */

function isNews(title){

const t=(title||"").toLowerCase()

const badWords=[
"tension","war","missile","attack",
"politics","news","students",
"college","exam result","admit card",
"answer key","cut off","syllabus",
"results announced"
]

return badWords.some(w=>t.includes(w))

}

/* ---------- DESCRIPTION ---------- */

function buildDescription(title,category){

const cat=category.replace(/-/g," ")

return `Apply for the latest ${title}. Discover new ${cat} opportunities with leading companies worldwide. Check eligibility, salary details, application process and apply online through the official link.`

}

/* ---------- FETCH HELPER ---------- */

async function fetchFeed(url){

const res=await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
"Accept":"application/rss+xml, application/xml;q=0.9,*/*;q=0.8"
}
})

return res

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

const res=await fetchFeed(f.url)

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

for(const item of feed.items.slice(0,80)){

const link=item.link||""

const id=hash(link)

if(!link||seen[id]) continue

const title=item.title||""

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

await wait(250)

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