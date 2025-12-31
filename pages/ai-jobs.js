import { useState } from "react"
import Head from "next/head"
import Link from "next/link"

export default function AIJobs({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading) return
    setLoading(true)

    const nextPage = page + 1
    const res = await fetch(
      `/api/search?category=ai-jobs&page=${nextPage}&limit=50`
    )
    const data = await res.json()

    setJobs((prev) => [...prev, ...(data.jobs || [])])
    setPage(nextPage)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>AI Jobs & Artificial Intelligence Jobs | FreshJobs.Store</title>
        <meta
          name="description"
          content="Latest AI jobs, machine learning jobs, data science and artificial intelligence job openings. Indian and international AI jobs including remote roles."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://freshjobs.store/ai-jobs" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-3">
          AI Jobs & Artificial Intelligence Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore latest <strong>AI jobs, Machine Learning roles, Data Science careers</strong>{" "}
          including Indian and international opportunities. Remote AI jobs are also included.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            Currently no AI job openings found.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={index}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1">
                {job.link ? (
                  <Link
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-700"
                  >
                    {job.title || "AI Job Opening"}
                  </Link>
                ) : (
                  job.title || "AI Job Opening"
                )}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 150)}...
                </p>
              )}
            </article>
          ))}
        </div>

        {/* LOAD MORE */}
        {jobs.length >= 50 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Load More AI Jobs"}
            </button>
          </div>
        )}
      </main>
    </>
  )
}

/* SSR – FIRST PAGE ONLY */
export async function getServerSideProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=ai-jobs&page=1&limit=50`
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