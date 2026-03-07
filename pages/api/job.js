export default async function handler(req, res) {

try{

/* ---------------- GET SLUG ---------------- */

const { slug } = req.query

if(!slug){

return res.status(400).json({
success:false,
message:"Missing job slug"
})

}

/* ---------------- FETCH JOB ---------------- */

const response=await fetch(
`https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec?slug=${encodeURIComponent(slug)}`
)

/* ---------------- API FAILURE ---------------- */

if(!response.ok){

return res.status(502).json({
success:false,
message:"Job service unavailable"
})

}

/* ---------------- PARSE DATA ---------------- */

const data=await response.json()

if(!data||!data.job){

return res.status(404).json({
success:false,
message:"Job not found"
})

}

/* ---------------- SUCCESS ---------------- */

return res.status(200).json({
success:true,
job:data.job
})

}catch(error){

/* ---------------- SERVER ERROR ---------------- */

return res.status(500).json({
success:false,
message:"Internal server error",
error:error.message
})

}

}