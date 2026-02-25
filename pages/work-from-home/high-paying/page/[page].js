import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../../components/Breadcrumb"
import JobCard from "../../../../components/JobCard"

export default function HighPayingWFHPage({
  jobs,
  currentPage,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/work-from-home/high-paying/page/${currentPage}`

  return (
    <>
      <Head>
        <title>
          High Paying Work From Home Jobs – Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse page ${currentPage} of high paying work from home jobs. Discover premium salary remote jobs and international WFH careers updated daily.`}
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`High Paying Work From Home Jobs – Page ${currentPage}`}
        />
        <meta
          property="og:description"
          content="Verified high salary remote and work from home jobs from trusted companies."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FreshJobs" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`High Paying WFH Jobs – Page ${currentPage}`}
        />
        <meta
          name="twitter:description"
          content="Top paying remote jobs with competitive salary packages."
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
          <p className="text-red-500">No jobs found on this page.</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* ✅ Numeric Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            {/* Prev Button */}
            {currentPage > 1 && (
              <Link
                href={
                  currentPage === 2
                    ? "/work-from-home/high-paying"
                    : `/work-from-home/high-paying/page/${currentPage - 1}`
                }
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                « Prev
              </Link>
            )}

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1

              const href =
                pageNumber === 1
                  ? "/work-from-home/high-paying"
                  : `/work-from-home/high-paying/page/${pageNumber}`

              const isActive = pageNumber === currentPage

              return (
                <Link
                  key={pageNumber}
                  href={href}
                  className={`px-3 py-2 border rounded ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            })}

            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={`/work-from-home/high-paying/page/${currentPage + 1}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                Next »
              </Link>
            )}

          </div>
        )}
      </main>
    </>
  )
}

export async function getStaticProps({ params }) {
  const page = Number(params.page) || 1

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=work-from-home&salary=high&page=${page}&limit=10`
    )

    const data = await res.json()

    return {
      props: {
        jobs: data.jobs || [],
        currentPage: page,
        totalPages: data.totalPages || 1,
        siteUrl,
      },
      revalidate: 600,
    }
  } catch {
    return {
      props: {
        jobs: [],
        currentPage: page,
        totalPages: 1,
        siteUrl: "https://www.freshjobs.store",
      },
      revalidate: 600,
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}