import { useState } from "react"
import Head from "next/head"
import Breadcrumb from "../components/Breadcrumb"
import JobCard from "../components/JobCard"

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

  return (
    <>
      <Head>
        <title>
          International Jobs Outside India | Global Careers – FreshJobs.Store
        </title>

        <meta
          name="description"
          content="Browse latest international jobs outside India including onsite and remote roles from global companies. Apply for overseas careers."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://freshjobs.store/international-jobs"
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
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
          Explore verified{" "}
          <strong>international job opportunities</strong> including
          onsite and remote roles from global companies across multiple
          countries.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            Currently no international jobs available.
          </p>
        )}

        {/* ✅ USING UNIVERSAL JOBCARD */}
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
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