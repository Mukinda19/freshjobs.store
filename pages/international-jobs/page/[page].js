import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

export default function InternationalJobsPage({
  jobs,
  currentPage,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/international-jobs/page/${currentPage}`
  const baseUrl = `${siteUrl}/international-jobs`

  return (
    <>
      <Head>
        <title>
          International Jobs 2026 – Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse international jobs page ${currentPage}. Find overseas and global job opportunities.`}
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {currentPage > 1 && (
          <link
            rel="prev"
            href={
              currentPage === 2
                ? baseUrl
                : `${baseUrl}/page/${currentPage - 1}`
            }
          />
        )}

        {currentPage < totalPages && (
          <link
            rel="next"
            href={`${baseUrl}/page/${currentPage + 1}`}
          />
        )}
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "International Jobs", href: "/international-jobs" },
            { label: `Page ${currentPage}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          International Jobs – Page {currentPage}
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            {currentPage > 1 && (
              <Link
                href={
                  currentPage === 2
                    ? "/international-jobs"
                    : `/international-jobs/page/${currentPage - 1}`
                }
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                « Prev
              </Link>
            )}

            {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <Link
                  key={pageNumber}
                  href={
                    pageNumber === 1
                      ? "/international-jobs"
                      : `/international-jobs/page/${pageNumber}`
                  }
                  className={`px-3 py-2 border rounded ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            })}

            {currentPage < totalPages && (
              <Link
                href={`/international-jobs/page/${currentPage + 1}`}
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


/* ✅ FINAL API BASED STATIC GENERATION */
export async function getStaticProps({ params }) {
  const page = Number(params.page) || 1

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=international&page=${page}&limit=10`
    )

    const data = await res.json()

    if (!data.jobs || data.jobs.length === 0) {
      return { notFound: true }
    }

    return {
      props: {
        jobs: data.jobs,
        currentPage: page,
        totalPages: data.totalPages || 1,
        siteUrl,
      },
      revalidate: 1800,
    }

  } catch {
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}