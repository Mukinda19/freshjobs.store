import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Link from "next/link"
import CategoryGrid from "../components/CategoryGrid"
import JobCard from "../components/JobCard"

export default function Home({ initialJobs }) {

  const router = useRouter()

  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)

  const [keyword,setKeyword] = useState("")
  const [category,setCategory] = useState("")
  const [location,setLocation] = useState("")

  const [filteredJobs,setFilteredJobs] = useState(initialJobs || [])

  /* -------- SEARCH -------- */

  const handleSearch = (e) => {

    e.preventDefault()

    const finalCategory = category || "all"
    const finalLocation = location || "india"

    const qParam = keyword
      ? `?q=${encodeURIComponent(keyword)}`
      : ""

    router.push(`/jobs/${finalCategory}/${finalLocation}${qParam}`)

  }

  /* -------- DEDUPE -------- */

  const dedupeJobs = (jobs) => {

    return Array.from(
      new Map(
        jobs.map(job => [
          job.slug || job.link,
          job
        ])
      ).values()
    )

  }

  /* -------- FILTER FETCH -------- */

  useEffect(()=>{

    if(!category && !keyword) return

    const controller = new AbortController()

    const fetchFilteredJobs = async ()=>{

      try{

        const qParam = keyword
          ? `&q=${encodeURIComponent(keyword)}`
          : ""

        const categoryParam =
          category && category!=="all"
            ? `&category=${encodeURIComponent(category)}`
            : ""

        const locationParam =
          location && location!=="india"
            ? `&location=${encodeURIComponent(location)}`
            : ""

        const res = await fetch(
          `/api/search?page=1&limit=10${categoryParam}${locationParam}${qParam}`,
          { signal: controller.signal }
        )

        if(!res.ok) throw new Error("API error")

        const data = await res.json()

        setFilteredJobs(
          dedupeJobs(data.jobs || [])
        )

        setPage(1)

      }

      catch(err){

        if(err.name !== "AbortError"){

          console.error("Search error:",err)

          setFilteredJobs([])

        }

      }

    }

    fetchFilteredJobs()

    return ()=>controller.abort()

  },[category,keyword,location])

  /* -------- LOAD MORE -------- */

  const loadMore = async ()=>{

    if(loading) return

    setLoading(true)

    const nextPage = page + 1

    try{

      const qParam = keyword
        ? `&q=${encodeURIComponent(keyword)}`
        : ""

      const categoryParam =
        category && category!=="all"
          ? `&category=${encodeURIComponent(category)}`
          : ""

      const locationParam =
        location && location!=="india"
          ? `&location=${encodeURIComponent(location)}`
          : ""

      const res = await fetch(
        `/api/search?page=${nextPage}&limit=10${categoryParam}${locationParam}${qParam}`
      )

      if(!res.ok) throw new Error("API error")

      const data = await res.json()

      const combined = [
        ...filteredJobs,
        ...(data.jobs || [])
      ]

      setFilteredJobs(
        dedupeJobs(combined)
      )

      setPage(nextPage)

    }

    catch(err){

      console.error("Load more error:",err)

    }

    finally{

      setLoading(false)

    }

  }

  /* -------- STRUCTURED DATA -------- */

  const structuredData = {

    "@context":"https://schema.org",

    "@type":"WebSite",

    "name":"FreshJobs",

    "url":"https://www.freshjobs.store",

    "potentialAction":{

      "@type":"SearchAction",

      "target":"https://www.freshjobs.store/jobs/all/india?q={search_term_string}",

      "query-input":"required name=search_term_string"

    }

  }

  return(

    <>

      <Head>

        <title>Latest Jobs in India 2026 | FreshJobs</title>

        <meta
          name="description"
          content="Find latest jobs in India including IT jobs, banking jobs, BPO jobs, engineering jobs, government jobs and work from home jobs."
        />

        <meta name="robots" content="index,follow"/>

        <link
          rel="canonical"
          href="https://www.freshjobs.store/"
        />

        <meta property="og:title" content="Latest Jobs in India | FreshJobs"/>
        <meta property="og:description" content="Explore thousands of latest job openings across IT, banking, BPO, engineering and government sectors."/>
        <meta property="og:url" content="https://www.freshjobs.store/"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="FreshJobs"/>

        <meta name="twitter:card" content="summary_large_image"/>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:JSON.stringify(structuredData)
          }}
        />

      </Head>

      {/* HERO */}

      <section className="text-center my-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Find Latest Jobs in India
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the newest job openings across IT, banking,
          BPO, engineering, government and work from home categories.
        </p>

      </section>

      {/* CATEGORY GRID */}

      <section className="my-10">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Popular Job Categories
        </h2>

        <CategoryGrid/>

      </section>

      {/* NEW SEO SECTION */}

      <section className="max-w-6xl mx-auto px-4 my-10">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Popular Job Locations
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">

          <Link href="/jobs/all/mumbai" className="hover:text-blue-600">Jobs in Mumbai</Link>
          <Link href="/jobs/all/delhi" className="hover:text-blue-600">Jobs in Delhi</Link>
          <Link href="/jobs/all/bangalore" className="hover:text-blue-600">Jobs in Bangalore</Link>
          <Link href="/jobs/all/pune" className="hover:text-blue-600">Jobs in Pune</Link>
          <Link href="/jobs/all/hyderabad" className="hover:text-blue-600">Jobs in Hyderabad</Link>

          <Link href="/jobs/all/chennai" className="hover:text-blue-600">Jobs in Chennai</Link>
          <Link href="/jobs/all/kolkata" className="hover:text-blue-600">Jobs in Kolkata</Link>
          <Link href="/jobs/all/ahmedabad" className="hover:text-blue-600">Jobs in Ahmedabad</Link>
          <Link href="/jobs/all/noida" className="hover:text-blue-600">Jobs in Noida</Link>
          <Link href="/jobs/all/gurgaon" className="hover:text-blue-600">Jobs in Gurgaon</Link>

        </div>

      </section>

      {/* SEARCH */}

      <section className="my-10">

        <form
          onSubmit={handleSearch}
          className="grid md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-md"
        >

          <input
            type="text"
            placeholder="Job title, skills or company"
            value={keyword}
            onChange={e=>setKeyword(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <select
            value={category}
            onChange={e=>setCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >

            <option value="">All Categories</option>
            <option value="it">IT Jobs</option>
            <option value="banking">Banking Jobs</option>
            <option value="bpo">BPO Jobs</option>
            <option value="sales">Sales Jobs</option>
            <option value="engineering">Engineering Jobs</option>
            <option value="govt-jobs">Government Jobs</option>
            <option value="work-from-home">Work From Home</option>
            <option value="ai">AI Jobs</option>

          </select>

          <select
            value={location}
            onChange={e=>setLocation(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >

            <option value="">All India</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="pune">Pune</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>

          </select>

          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
            Search Jobs
          </button>

        </form>

      </section>

      {/* JOB LIST */}

      <section className="my-12">

        <h2 className="text-2xl font-semibold mb-6">
          Latest Job Openings
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {filteredJobs.length > 0 ? (

            filteredJobs.map(job=>(
              <JobCard
                key={job.slug || job.link}
                job={job}
              />
            ))

          ) : (

            <p className="text-gray-500">
              No jobs found.
            </p>

          )}

        </div>

        {filteredJobs.length >= 10 && (

          <div className="text-center mt-8">

            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >

              {loading ? "Loading..." : "Load More Jobs"}

            </button>

          </div>

        )}

      </section>

    </>

  )

}

/* -------- STATIC PROPS -------- */

export async function getStaticProps(){

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.freshjobs.store"

  try{

    const res = await fetch(
      `${baseUrl}/api/search?page=1&limit=10`
    )

    if(!res.ok) throw new Error("API error")

    const data = await res.json()

    return{

      props:{
        initialJobs:data.jobs || []
      },

      revalidate:900

    }

  }

  catch{

    return{

      props:{
        initialJobs:[]
      },

      revalidate:600

    }

  }

}