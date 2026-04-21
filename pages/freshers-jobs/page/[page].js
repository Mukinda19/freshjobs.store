import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

export default function FreshersJobsPage({
  jobs,
  currentPage,
  totalPages,
  siteUrl,
}) {
  const baseUrl = `${siteUrl}/freshers-jobs`

  const pageUrl =
    currentPage === 1
      ? baseUrl
      : `${baseUrl}/page/${currentPage}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Freshers Jobs",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Page ${currentPage}`,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <Head>
        <title>
          Freshers Jobs 2026 – Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse page ${currentPage} of latest freshers jobs in India for graduates, diploma holders and entry-level candidates.`}
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Freshers Jobs", href: "/freshers-jobs" },
            { label: `Page ${currentPage}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6">
          Freshers Jobs – Page {currentPage}
        </h1>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No freshers jobs found on this page.
          </p>
        )}

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
                    ? "/freshers-jobs"
                    : `/freshers-jobs/page/${currentPage - 1}`
                }
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                « Prev
              </Link>
            )}

            {Array.from(
              { length: Math.min(10, totalPages) },
              (_, i) => i + 1
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={
                  pageNumber === 1
                    ? "/freshers-jobs"
                    : `/freshers-jobs/page/${pageNumber}`
                }
                className={`px-3 py-2 border rounded ${
                  pageNumber === currentPage
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </Link>
            ))}

            {currentPage < totalPages && (
              <Link
                href={`/freshers-jobs/page/${currentPage + 1}`}
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
      `${siteUrl}/api/search?category=freshers-jobs&page=${page}&limit=10`
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