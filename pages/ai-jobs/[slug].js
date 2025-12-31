import Head from "next/head"
import Link from "next/link"

export default function AIJobDetail({ job }) {
  if (!job) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-red-600">
          Job not found
        </h1>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>
          {job.title
            ? `${job.title} – AI Job | FreshJobs.Store`
            : "AI Job Opening | FreshJobs.Store"}
        </title>

        <meta
          name="description"
          content={
            job.description
              ? job.description.slice(0, 160)
              : "Latest AI and Artificial Intelligence job opening."
          }
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={`https://freshjobs.store/ai-jobs/${job.slug}`}
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <article className="border rounded-lg p-6 bg-white shadow-sm">
          <h1 className="text-2xl font-bold mb-3">
            {job.title || "AI Job Opening"}
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Source: {job.source || "Verified Portal"}
          </p>

          {job.description && (
            <div className="text-gray-800 leading-relaxed mb-6 whitespace-pre-line">
              {job.description}
            </div>
          )}

          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
            >
              Apply Now →
            </a>
          )}

          <div className="mt-8">
            <Link
              href="/ai-jobs"
              className="text-blue-600 hover:underline"
            >
              ← Back to AI Jobs
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/* 🔹 SSR – FETCH SINGLE JOB BY SLUG */
export async function getServerSideProps({ params }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=ai-jobs&limit=200`
    )

    const data = await res.json()

    const job = (data.jobs || []).find(
      (j) => j.slug === params.slug
    )

    return {
      props: {
        job: job || null,
      },
    }
  } catch (error) {
    return {
      props: {
        job: null,
      },
    }
  }
}