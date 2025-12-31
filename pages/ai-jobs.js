import { useState } from "react"
import Head from "next/head"
import Link from "next/link"

/* 🔹 LIGHT AI KEYWORDS – NO OVER FILTERING */
const AI_KEYWORDS = [
  "ai",
  "artificial intelligence",
  "machine learning",
  "ml",
  "data scientist",
  "deep learning"
]

function isAIJob(job) {
  const title = (job.title || "").toLowerCase()
  return AI_KEYWORDS.some(k => title.includes(k))
}

export default function AIJobs({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading) return
    setLoading(true)

    const nextPage = page + 1
    const res = await fetch(`/api/search?page=${nextPage}&limit=50`)
    const data = await res.json()

    const filtered = (data.jobs || []).filter(isAIJob)

    setJobs(prev => [...prev, ...filtered])
    setPage(nextPage)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>AI Jobs & Artificial Intelligence Jobs | FreshJobs.Store</title>
        <meta
          name="description"
          content="Latest AI, Machine Learning and Artificial Intelligence jobs worldwide."
        />
        <link rel="canonical" href="https://freshjobs.store/ai-jobs" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-3">
          AI Jobs & Artificial Intelligence Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Browse latest AI, Machine Learning & Artificial Intelligence jobs
          (India + International + Remote).
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No AI jobs found right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={index}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1">
                <Link
                  href={job.link || "#"}
                  target="_blank"
                  className="hover:underline text-blue-700"
                >
                  {job.title || "AI Job Opening"}
                </Link>
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700">
                  {job.description.slice(0, 150)}...
                </p>
              )}
            </article>
          ))}
        </div>

        {/* LOAD MORE */}
        {jobs.length >= 20 && (
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

/* ✅ SSR – FIRST PAGE ONLY */
export async function getServerSideProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/search?page=1&limit=50`)
    const data = await res.json()

    const filtered = (data.jobs || []).filter(isAIJob)

    return {
      props: {
        initialJobs: filtered,
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