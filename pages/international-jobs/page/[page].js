import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

export default function InternationalJobsPage({
  jobs,
  currentPage,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/international-jobs/page/${currentPage}`
  const baseUrl = `${siteUrl}/international-jobs`

  return (
    <>
      <Head>
        <title>
          International Jobs 2026 – Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse international jobs page ${currentPage}. Find overseas and global job opportunities in IT, healthcare, engineering and remote roles.`}
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`International Jobs – Page ${currentPage}`} />
        <meta property="og:description" content="Latest international job openings worldwide." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Pagination SEO */}
        {currentPage > 1 && (
          <link
            rel="prev"
            href={
              currentPage === 2
                ? baseUrl
                : `${siteUrl}/international-jobs/page/${currentPage - 1}`
            }
          />
        )}

        {currentPage < totalPages && (
          <link
            rel="next"
            href={`${siteUrl}/international-jobs/page/${currentPage + 1}`}
          />
        )}
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "International Jobs", href: "/international-jobs" },
            { label: `Page ${currentPage}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          International Jobs – Page {currentPage}
        </h1>

        <p className="mb-6 text-gray-700">
          Explore more international job opportunities across USA, UAE,
          Canada, UK and other global destinations. Updated listings
          for skilled professionals and remote workers.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">
            {currentPage > 1 && (
              <Link
                href={
                  currentPage === 2
                    ? "/international-jobs"
                    : `/international-jobs/page/${currentPage - 1}`
                }
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                « Prev
              </Link>
            )}

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1
              return (
                <Link
                  key={pageNumber}
                  href={
                    pageNumber === 1
                      ? "/international-jobs"
                      : `/international-jobs/page/${pageNumber}`
                  }
                  className={`px-3 py-2 border rounded ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            })}

            {currentPage < totalPages && (
              <Link
                href={`/international-jobs/page/${currentPage + 1}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                Next »
              </Link>
            )}
          </div>
        )}
      </main>
    </>
  )
}

/* 🔥 FINAL Optimized Static Generation */
export async function getStaticProps({ params }) {
  const page = Number(params.page) || 1

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const response = await fetch(`${SHEET_URL}?limit=1000`)
    const data = await response.json()

    let jobs = Array.isArray(data.jobs) ? data.jobs : []

    const internationalDomains = [
      "remoteok",
      "weworkremotely",
      "remotive",
      "jobicy",
    ]

    jobs = jobs.filter((job) => {
      const urlText = `
        ${job.url || ""}
        ${job.link || ""}
        ${job.apply_url || ""}
        ${job.source || ""}
      `.toLowerCase()

      return internationalDomains.some((d) =>
        urlText.includes(d)
      )
    })

    const limit = 10
    const totalPages = Math.ceil(jobs.length / limit)

    if (page > totalPages || page < 1) {
      return { notFound: true }
    }

    const start = (page - 1) * limit

    return {
      props: {
        jobs: jobs.slice(start, start + limit),
        currentPage: page,
        totalPages,
        siteUrl,
      },
      revalidate: 1800,
    }
  } catch {
    return {
      props: {
        jobs: [],
        currentPage: page,
        totalPages: 1,
        siteUrl: "https://www.freshjobs.store",
      },
      revalidate: 1800,
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}