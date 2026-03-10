import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function handler(req, res) {

  try {

    console.log("🚀 Vercel cron started")

    const scriptPath = path.join(process.cwd(),"scripts","fetch-all-jobs.js")

    exec(`node ${scriptPath}`, (error, stdout, stderr) => {

      if(stdout) console.log(stdout)
      if(stderr) console.log(stderr)

      if(error){
        console.log("❌ Cron script error",error.message)
      }

    })

    return res.status(200).json({
      success:true,
      message:"FreshJobs cron triggered"
    })

  } catch (error) {

    return res.status(500).json({
      success:false,
      error:error.message
    })

  }

}