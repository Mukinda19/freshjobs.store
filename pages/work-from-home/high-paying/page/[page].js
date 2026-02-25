import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../../components/Breadcrumb"
import JobCard from "../../../../components/JobCard"

export default function HighPayingWFHPage({ jobs, currentPage, totalPages }) {
  return (
    <>
      <Head>
        <title>
          High Paying Work From Home Jobs – Page {currentPage} | FreshJobs
        </title>

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={`https://www.freshjobs.store/work-from-home/high-paying/page/${currentPage}`}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work From Home", href: "/work-from-home" },
            { label: "High Paying", href: "/work-from-home/high-paying" },
            { label: `Page ${currentPage}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6">
          High Paying Work From Home Jobs – Page {currentPage}
        </h1>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No jobs found on this page.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2 flex-wrap">
          {currentPage > 1 && (
            <Link
              href={
                currentPage === 2
                  ? "/work-from-home/high-paying"
                  : `/work-from-home/high-paying/page/${currentPage - 1}`
              }
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              « Prev
            </Link>
          )}

          <span className="px-4 py-2 border rounded bg-blue-600 text-white">
            {currentPage}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`/work-from-home/high-paying/page/${currentPage + 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Next »
            </Link>
          )}
        </div>
      </main>
    </>
  )
}

export async function getStaticProps({ params }) {
  const page = Number(params.page) || 1

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.freshjobs.store"

    const res = await fetch(
      `${baseUrl}/api/search?category=work-from-home&salary=high&page=${page}&limit=10`
    )

    const data = await res.json()

    return {
      props: {
        jobs: data.jobs || [],
        currentPage: page,
        totalPages: data.totalPages || 1,
      },
      revalidate: 300,
    }
  } catch {
    return {
      props: {
        jobs: [],
        currentPage: page,
        totalPages: 1,
      },
      revalidate: 300,
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}