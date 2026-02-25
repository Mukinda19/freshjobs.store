import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

export default function InternationalJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/international-jobs`

  return (
    <>
      <Head>
        <title>
          International Jobs 2026 | USA, UAE, Canada & Global Careers
        </title>

        <meta
          name="description"
          content="Find latest international jobs in USA, UAE, Canada, UK and other countries."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "International Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6">
          International Jobs & Global Career Opportunities
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">
            <Link
              href="/international-jobs"
              className="px-3 py-2 border rounded bg-blue-600 text-white"
            >
              1
            </Link>

            {[...Array(totalPages - 1)].map((_, i) => {
              const pageNumber = i + 2
              return (
                <Link
                  key={pageNumber}
                  href={`/international-jobs/page/${pageNumber}`}
                  className="px-3 py-2 border rounded hover:bg-gray-200"
                >
                  {pageNumber}
                </Link>
              )
            })}

            <Link
              href="/international-jobs/page/2"
              className="px-3 py-2 border rounded hover:bg-gray-200"
            >
              Next »
            </Link>
          </div>
        )}
      </main>
    </>
  )
}

/* 🔥 Optimized Static Generation */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const response = await fetch(`${SHEET_URL}?limit=1000`)
    const data = await response.json()

    let jobs = Array.isArray(data.jobs) ? data.jobs : []

    const internationalDomains = [
      "remoteok","weworkremotely","remotive","jobicy",
    ]

    const govtKeywords = [
      "government","govt","sarkari","psu","ssc","upsc",
      "railway","defence","police","court","ministry",
    ]

    const indiaKeywords = [
      "india","indian","bharat","new delhi","delhi",
      "mumbai","pune","bangalore","bengaluru",
      "chennai","hyderabad","kolkata","ahmedabad",
      "noida","gurgaon","maharashtra",
      "uttar pradesh","bihar","madhya pradesh",
      "rajasthan","tamil nadu","karnataka",
    ]

    jobs = jobs.filter((job) => {
      const text = `
        ${job.title || ""}
        ${job.description || ""}
        ${job.snippet || ""}
      `.toLowerCase()

      const urlText = `
        ${job.url || ""}
        ${job.link || ""}
        ${job.apply_url || ""}
        ${job.source || ""}
      `.toLowerCase()

      const isInternationalSource = internationalDomains.some((d) =>
        urlText.includes(d)
      )

      const isGovt = govtKeywords.some((kw) => text.includes(kw))
      const isIndia = indiaKeywords.some((kw) => text.includes(kw))

      return isInternationalSource && !isGovt && !isIndia
    })

    const limit = 10
    const totalPages = Math.ceil(jobs.length / limit)

    return {
      props: {
        jobs: jobs.slice(0, limit),
        totalPages,
        siteUrl,
      },
      revalidate: 1800,
    }
  } catch {
    return {
      props: {
        jobs: [],
        totalPages: 1,
        siteUrl: "https://www.freshjobs.store",
      },
      revalidate: 1800,
    }
  }
}