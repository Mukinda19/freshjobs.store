import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

export default function WorkFromHomePage({
  jobs,
  currentPage,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/work-from-home/page/${currentPage}`

  return (
    <>
      <Head>
        <title>
          Work From Home Jobs – Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse Work From Home Jobs – Page ${currentPage}. Explore verified remote and online job opportunities worldwide.`}
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Pagination SEO */}
        {currentPage > 1 && (
          <link
            rel="prev"
            href={
              currentPage === 2
                ? `${siteUrl}/work-from-home`
                : `${siteUrl}/work-from-home/page/${currentPage - 1}`
            }
          />
        )}

        {currentPage < totalPages && (
          <link
            rel="next"
            href={`${siteUrl}/work-from-home/page/${currentPage + 1}`}
          />
        )}

        {/* Open Graph */}
        <meta property="og:title" content={`Work From Home Jobs – Page ${currentPage}`} />
        <meta
          property="og:description"
          content="Latest remote and work from home jobs worldwide."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 my-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work From Home Jobs", href: "/work-from-home" },
            { label: `Page ${currentPage}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6">
          Work From Home Jobs – Page {currentPage}
        </h1>

        {jobs.length === 0 && (
          <p className="text-red-500">No jobs found on this page.</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* ✅ 1–10 Pagination System */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2 flex-wrap">
            {currentPage > 1 && (
              <Link
                href={
                  currentPage === 2
                    ? "/work-from-home"
                    : `/work-from-home/page/${currentPage - 1}`
                }
                className="px-4 py-2 border rounded hover:bg-gray-200"
              >
                « Prev
              </Link>
            )}

            {Array.from(
              { length: Math.min(10, totalPages) },
              (_, i) => i + 1
            ).map((page) => {
              const href =
                page === 1
                  ? "/work-from-home"
                  : `/work-from-home/page/${page}`

              return page === currentPage ? (
                <span
                  key={page}
                  className="px-4 py-2 border rounded bg-blue-600 text-white"
                >
                  {page}
                </span>
              ) : (
                <Link
                  key={page}
                  href={href}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  {page}
                </Link>
              )
            })}

            {currentPage < totalPages && (
              <Link
                href={`/work-from-home/page/${currentPage + 1}`}
                className="px-4 py-2 border rounded hover:bg-gray-200"
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
  const page = Number(params.page)

  if (!page || page < 2) {
    return { notFound: true }
  }

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=wfh&page=${page}&limit=10`
    )

    const data = await res.json()

    if (!data.jobs || data.jobs.length === 0) {
      return { notFound: true }
    }

    return {
      props: {
        jobs: data.jobs || [],
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