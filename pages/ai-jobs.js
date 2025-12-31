import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

/* ================= KEYWORDS ================= */

const AI_TITLE_KEYWORDS = [
  "ai engineer",
  "machine learning",
  "ml engineer",
  "data scientist",
  "deep learning",
  "nlp",
  "computer vision",
  "artificial intelligence",
  "generative ai",
  "gen ai",
  "llm",
  "chatgpt",
]

const AI_DESC_KEYWORDS = [
  "machine learning",
  "deep learning",
  "nlp",
  "computer vision",
  "artificial intelligence",
  "model training",
  "neural network",
  "llm",
  "gen ai",
]

const NEGATIVE_KEYWORDS = [
  "sales",
  "marketing",
  "hr",
  "human resource",
  "business development",
  "telecaller",
  "customer support",
  "bpo",
  "non technical",
]

export default function AIJobs({ jobs, page, hasMore }) {
  const router = useRouter()

  const loadMore = () => {
    router.push(`/ai-jobs?page=${page + 1}`)
  }

  return (
    <>
      <Head>
        <title>AI Jobs & Artificial Intelligence Jobs | FreshJobs.Store</title>
        <meta
          name="description"
          content="Latest verified AI jobs, Machine Learning, Data Science and Artificial Intelligence jobs in India and worldwide."
        />
        <link rel="canonical" href="https://freshjobs.store/ai-jobs" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          AI Jobs & Artificial Intelligence Careers
        </h1>

        {jobs.length === 0 && (
          <p className="text-red-500">No AI jobs found right now.</p>
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
                  className="text-blue-700 hover:underline"
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

        {/* 🔽 PAGINATION */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Load More AI Jobs
            </button>
          </div>
        )}
      </main>
    </>
  )
}

/* ================= SERVER SIDE ================= */

export async function getServerSideProps({ query }) {
  try {
    const page = parseInt(query.page || "1")
    const limit = 20

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/search?limit=200`
    )

    const data = await res.json()
    const allJobs = data.jobs || []

    /* 🔹 CLEAN AI FILTER */
    const cleanAIJobs = allJobs.filter((job) => {
      const title = (job.title || "").toLowerCase()
      const desc = (job.description || "").toLowerCase()
      const fullText = `${title} ${desc}`

      if (NEGATIVE_KEYWORDS.some((k) => fullText.includes(k))) {
        return false
      }

      if (AI_TITLE_KEYWORDS.some((k) => title.includes(k))) {
        return true
      }

      return AI_DESC_KEYWORDS.some((k) => desc.includes(k))
    })

    const start = (page - 1) * limit
    const end = start + limit

    return {
      props: {
        jobs: cleanAIJobs.slice(start, end),
        page,
        hasMore: end < cleanAIJobs.length,
      },
    }
  } catch (err) {
    return {
      props: {
        jobs: [],
        page: 1,
        hasMore: false,
      },
    }
  }
}