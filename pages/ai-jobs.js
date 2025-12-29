import Head from "next/head"
import Link from "next/link"

export default function AIJobs({ jobs }) {
  return (
    <>
      <Head>
        <title>AI Jobs & Artificial Intelligence Jobs | FreshJobs.Store</title>
        <meta
          name="description"
          content="Latest AI jobs, machine learning jobs, data science and artificial intelligence job openings. Remote and India-based AI jobs updated daily."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://freshjobs.store/ai-jobs"
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-3">
          AI Jobs & Artificial Intelligence Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find latest <strong>AI jobs, Machine Learning jobs, Data Science roles</strong> and
          artificial intelligence career opportunities. Suitable for freshers,
          experienced professionals, and remote job seekers.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No AI jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={index}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1">
                {job.title || "AI Job Opening"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 140)}...
                </p>
              )}

              {job.link && (
                <Link
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Job →
                </Link>
              )}
            </article>
          ))}
        </div>
      </main>
    </>
  )
}

/* ✅ SAFE SERVER-SIDE FETCH (NO BUILD FAIL) */
export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/search?page=1&limit=30`
    )
    const data = await res.json()

    // 🔍 AI + ML + Data keywords filter
    const aiJobs = (data.jobs || []).filter((job) => {
      const text = `${job.title} ${job.description}`.toLowerCase()
      return (
        text.includes("ai") ||
        text.includes("artificial intelligence") ||
        text.includes("machine learning") ||
        text.includes("ml") ||
        text.includes("data scientist") ||
        text.includes("deep learning")
      )
    })

    return {
      props: {
        jobs: aiJobs,
      },
    }
  } catch (err) {
    return {
      props: {
        jobs: [],
      },
    }
  }
}