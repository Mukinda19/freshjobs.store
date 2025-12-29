import Head from "next/head"
import Link from "next/link"
import jobsData from "../data/jobsdata.json"

export default function WorkFromHomeJobs({ jobs }) {
  return (
    <>
      <Head>
        <title>Work From Home Jobs in India | Remote Jobs – FreshJobs Store</title>
        <meta
          name="description"
          content="Latest work from home jobs and remote jobs in India. Verified WFH job openings updated daily from trusted sources."
        />
      </Head>

      <main className="container mx-auto px-6 py-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold mb-3">
          Work From Home Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore the latest <strong>remote and work from home jobs</strong> from trusted international job portals.
          These opportunities are ideal for freshers and experienced professionals looking for flexible work.
        </p>

        {/* Jobs List */}
        <div className="grid gap-6">
          {jobs.length === 0 && (
            <p className="text-red-500">
              No work from home jobs available right now.
            </p>
          )}

          {jobs.map((job, index) => (
            <div
              key={index}
              className="border rounded-lg p-5 hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-semibold mb-1">
                {job.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source}
              </p>

              <p className="text-sm text-gray-700 mb-3">
                {job.description?.slice(0, 150)}...
              </p>

              <Link
                href={job.link}
                target="_blank"
                className="inline-block text-blue-600 font-medium hover:underline"
              >
                View Job →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export async function getStaticProps() {
  // 🔹 Only Work From Home category jobs
  const wfhJobs = jobsData.filter(
    (job) => job.category === "wfh"
  )

  return {
    props: {
      jobs: wfhJobs.slice(0, 50), // limit for SEO + performance
    },
    revalidate: 3600, // re-generate every 1 hour
  }
}