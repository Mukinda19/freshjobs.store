import { useState } from "react"
import Head from "next/head"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

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
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work From Home", href: "/work-from-home" },
            { label: "High Paying Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          High Paying Work From Home Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore{" "}
          <strong>
            high salary remote & work from home jobs
          </strong>{" "}
          offering better pay, international exposure and flexible work options.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No high paying work from home jobs available right now.
          </p>
        )}

        {/* ✅ Universal JobCard Used */}
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
      `${baseUrl}/api/search?category=work-from-home&salary=high&page=1&limit=10`
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