import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"

export default function TitleJobsPage() {

  const router = useRouter()

  const { title,page=1 } = router.query

  const [jobs,setJobs] = useState([])
  const [loading,setLoading] = useState(true)
  const [totalPages,setTotalPages] = useState(1)

  useEffect(()=>{

    if(!title) return

    setLoading(true)

    fetch(`/api/search?title=${title}&page=${page}`)
      .then(res=>res.json())
      .then(data=>{

        setJobs(data.jobs || [])
        setTotalPages(data.totalPages || 1)

        setLoading(false)

      })

  },[title,page])

  const formattedTitle = title
    ? title.replace(/-/g," ")
    : ""

  const goToPage = (p)=>{
    router.push(`/jobs/title/${title}?page=${p}`)
  }

  return (

    <>
      <Head>

        <title>
          {formattedTitle} Jobs in India (Latest {formattedTitle} Job Vacancies) | FreshJobs
        </title>

        <meta
          name="description"
          content={`Find latest ${formattedTitle} jobs in India. Apply for top companies hiring ${formattedTitle} jobs. Updated daily on FreshJobs.`}
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <link
          rel="canonical"
          href={`https://www.freshjobs.store/jobs/title/${title}`}
        />

      </Head>

      <div style={{padding:"20px",maxWidth:"900px",margin:"auto"}}>

        <h1 style={{marginBottom:"20px"}}>
          Latest {formattedTitle} Jobs
        </h1>

        {loading && <p>Loading jobs...</p>}

        {!loading && jobs.length===0 && (
          <p>No jobs found.</p>
        )}

        {jobs.map(job=>(

          <div
            key={job.slug}
            style={{
              border:"1px solid #e5e7eb",
              padding:"18px",
              marginBottom:"15px",
              borderRadius:"8px"
            }}
          >

            <h2 style={{fontSize:"20px"}}>
              {job.title}
            </h2>

            <p>
              <strong>Company:</strong> {job.company}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <a
              href={`/job/${job.slug}`}
              style={{
                color:"#2563eb",
                fontWeight:"600"
              }}
            >
              View Job Details
            </a>

          </div>

        ))}

        {/* Pagination */}

        {totalPages > 1 && (

          <div style={{marginTop:"30px"}}>

            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button
                key={p}
                onClick={()=>goToPage(p)}
                style={{
                  marginRight:"8px",
                  padding:"8px 12px",
                  border:"1px solid #ddd",
                  background:p==page ? "#2563eb" : "#fff",
                  color:p==page ? "#fff" : "#000",
                  cursor:"pointer"
                }}
              >
                {p}
              </button>
            ))}

          </div>

        )}

      </div>
    </>
  )
}