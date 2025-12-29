import Head from "next/head"
import Link from "next/link"
import jobsData from "../data/seen.json" // ✅ ONLY LINE CHANGED

export default function WorkFromHomeJobs({ jobs }) {
  return (
    <>
      <Head>
        <title>Work From Home Jobs in India | Remote Jobs – FreshJobs Store</title>
        <meta
          name="description"
          content="Latest work from home jobs and remote jobs in India. Verified WFH job openings updated daily from trusted sources."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://freshjobs.store/work-from-home-jobs"
        />
      </Head>

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-3">
          Work From Home Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore verified <strong>work from home jobs</strong> and
          <strong> remote jobs</strong> ideal for freshers and experienced
          professionals.
        </p>

        <div className="grid gap-6">
          {jobs.length === 0 && (
            <p className="text-red-500">
              No work from home jobs available right now.
            </p>
          )}

          {jobs.map((job, index) => (
            <article
              key={index}
              className="border rounded-lg p-5 bg-white hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-1">
                {job.title || "WFH Job Opening"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 150)}...
                </p>
              )}

              {job.link && (
                <Link
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 font-medium hover:underline"
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

export async function getStaticProps() {
  const wfhJobs = Array.isArray(jobsData)
    ? jobsData.filter(
        (job) =>
          job?.category === "wfh" ||
          job?.tags?.includes("work from home") ||
          job?.title?.toLowerCase().includes("remote")
      )
    : []

  return {
    props: {
      jobs: wfhJobs.slice(0, 50),
    },
    revalidate: 3600,
  }
}