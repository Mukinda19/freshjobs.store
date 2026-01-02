import Head from "next/head"
import Link from "next/link"

export default function WorkFromHomeJobs({ jobs }) {
  return (
    <>
      <Head>
        <title>
          Work From Home Jobs in India & Abroad | Remote Jobs – FreshJobs.Store
        </title>
        <meta
          name="description"
          content="Latest remote and work from home jobs in India and international locations. Verified WFH jobs from trusted portals."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://freshjobs.store/work-from-home"
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ BREADCRUMBS */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700 font-medium">
            Work From Home Jobs
          </span>
        </nav>

        <h1 className="text-3xl font-bold mb-3">
          Work From Home & Remote Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find verified{" "}
          <strong>work from home & remote jobs</strong> from India and
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
              key={job.link || index}
              className="border rounded-lg p-4 bg-white hover:shadow-lg transition"
            >
              {/* ✅ JOB TITLE */}
              <h2 className="font-semibold mb-1">
                {job.link ? (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {job.title || "Remote Job"}
                  </a>
                ) : (
                  <span className="text-blue-600">
                    {job.title || "Remote Job"}
                  </span>
                )}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 140)}...
                </p>
              )}

              {/* ✅ VIEW + APPLY */}
              {job.link && (
                <div className="flex items-center gap-4 mt-3">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Job →
                  </a>

                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700"
                  >
                    Apply Now →
                  </a>
                </div>
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
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/search?category=work-from-home&limit=50`
    )
    const data = await res.json()

    return {
      props: {
        jobs: data.jobs || [],
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