import { useState } from "react"
import Head from "next/head"
import Link from "next/link"

export default function HighPayingWFHJobs({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialJobs.length === 10)

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const nextPage = page + 1
    const res = await fetch(
      `/api/search?category=work-from-home&salary=high&page=${nextPage}&limit=10`
    )
    const data = await res.json()

    if (!data.jobs || data.jobs.length === 0) {
      setHasMore(false)
    } else {
      setJobs((prev) => [...prev, ...data.jobs])
      setPage(nextPage)
      if (data.jobs.length < 10) setHasMore(false)
    }

    setLoading(false)
  }

  /* ✅ BASIC JOB SCHEMA (SAFE SEO) */
  const jobSchema = jobs.slice(0, 10).map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title || "High Paying Work From Home Job",
    description:
      job.description ||
      "High salary remote and work from home job opportunity.",
    hiringOrganization: {
      "@type": "Organization",
      name: job.source || "FreshJobs.Store",
    },
    employmentType: "FULL_TIME",
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    url: "https://freshjobs.store/work-from-home/high-paying",
  }))

  return (
    <>
      <Head>
        <title>
          High Paying Work From Home Jobs | Remote Jobs – FreshJobs.Store
        </title>
        <meta
          name="description"
          content="Find high paying work from home jobs and remote jobs with good salary packages. Verified WFH opportunities from India and abroad."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://freshjobs.store/work-from-home/high-paying"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobSchema),
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ BREADCRUMBS */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link href="/work-from-home" className="hover:text-blue-600">
            Work From Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700 font-medium">
            High Paying Jobs
          </span>
        </nav>

        <h1 className="text-3xl font-bold mb-3">
          High Paying Work From Home Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore <strong>high salary remote & work from home jobs</strong>{" "}
          offering better pay, international exposure and flexible work options.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No high paying work from home jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={job.link || index}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1 text-blue-700">
                {job.title || "High Paying Remote Job"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 150)}...
                </p>
              )}

              {/* ✅ APPLY NOW ONLY */}
              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700"
                >
                  Apply Now →
                </a>
              )}
            </article>
          ))}
        </div>

        {/* ✅ PAGINATION */}
        {hasMore && (
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
      </main>
    </>
  )
}

/* ✅ SSR – FIRST 10 JOBS */
export async function getServerSideProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=work-from-home&salary=high&page=1&limit=10`
    )
    const data = await res.json()

    return {
      props: {
        initialJobs: data.jobs || [],
      },
    }
  } catch (error) {
    return {
      props: {
        initialJobs: [],
      },
    }
  }
}