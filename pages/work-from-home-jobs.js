import Head from "next/head"
import Link from "next/link"

const WFH_KEYWORDS = [
  "remote",
  "work from home",
  "work-from-home",
  "wfh",
  "home based",
  "home-based"
]

export default function WorkFromHomeJobs({ jobs }) {
  return (
    <>
      <Head>
        <title>Work From Home Jobs in India & Abroad | Remote Jobs – FreshJobs.Store</title>
        <meta
          name="description"
          content="Latest remote and work from home jobs in India and international locations. Verified WFH jobs from trusted portals."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://freshjobs.store/work-from-home-jobs"
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-3">
          Work From Home & Remote Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find verified <strong>work from home & remote jobs</strong> from India and
          international companies. Updated daily.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No work from home jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={index}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1">
                {job.title || "Remote Job"}
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

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/search?page=1&limit=100`
    )
    const data = await res.json()

    const wfhJobs = (data.jobs || []).filter((job) => {
      const text = `${job.title || ""} ${job.description || ""} ${(job.tags || []).join(" ")}`
        .toLowerCase()

      return WFH_KEYWORDS.some((keyword) => text.includes(keyword))
    })

    return {
      props: {
        jobs: wfhJobs.slice(0, 30),
      },
    }
  } catch (error) {
    return {
      props: {
        jobs: [],
      },
    }
  }
}