import { useState } from "react"
import Head from "next/head"
import Breadcrumb from "../components/Breadcrumb"

export default function InternationalJobs({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialJobs.length === 10)

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const nextPage = page + 1
    const res = await fetch(
      `/api/search?category=international&page=${nextPage}&limit=10`
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

  /* ✅ SEO SAFE JOB SCHEMA */
  const jobSchema = jobs.slice(0, 10).map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title || "International Job Opening",
    description:
      job.description || "International job opportunity outside India",
    hiringOrganization: {
      "@type": "Organization",
      name: job.source || "FreshJobs.Store",
    },
    employmentType: "FULL_TIME",
    jobLocationType: job.remote ? "TELECOMMUTE" : "ON_SITE",
    url: job.link || "https://freshjobs.store/international-jobs",
  }))

  return (
    <>
      <Head>
        <title>
          International Jobs Outside India | Global Careers – FreshJobs.Store
        </title>

        <meta
          name="description"
          content="Browse latest international jobs outside India including onsite and remote roles from global companies."
        />

        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://freshjobs.store/international-jobs"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobSchema),
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ REUSABLE BREADCRUMB (FINAL) */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "International Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          International Jobs (Outside India)
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore verified <strong>international job opportunities</strong>{" "}
          including onsite and remote roles from global companies.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            Currently no international jobs available.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={job.link || index}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1 text-blue-700">
                {job.title || "International Job Opening"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.location && (
                <p className="text-sm text-gray-600 mb-2">
                  Location: {job.location}
                </p>
              )}

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 150)}...
                </p>
              )}

              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
                >
                  Apply Now →
                </a>
              )}
            </article>
          ))}
        </div>

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

/* ✅ SSR */
export async function getServerSideProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=international&page=1&limit=10`
    )
    const data = await res.json()

    return {
      props: {
        initialJobs: data.jobs || [],
      },
    }
  } catch {
    return {
      props: {
        initialJobs: [],
      },
    }
  }
}