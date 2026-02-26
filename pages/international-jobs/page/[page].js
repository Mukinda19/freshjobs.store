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

  /* ✅ Breadcrumb Schema */
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
        name: "International Jobs",
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

  /* ✅ Collection Schema */
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `International Jobs – Page ${currentPage}`,
    description: `Browse page ${currentPage} of verified international and overseas job opportunities.`,
    url: pageUrl,
  }

  return (
    <>
      <Head>
        <title>
          International Jobs 2026 – Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse page ${currentPage} of international jobs. Find verified overseas and global career opportunities.`}
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Prev / Next */}
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

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`International Jobs – Page ${currentPage}`}
        />
        <meta
          property="og:description"
          content="Latest verified international job openings worldwide."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FreshJobs" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
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

        {jobs.length === 0 && (
          <p className="text-red-500">
            No international jobs found on this page.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* ✅ Smart Pagination (1–10 window) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            {/* Prev */}
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

            {/* Page Numbers */}
            {Array.from(
              { length: Math.min(10, totalPages) },
              (_, i) => i + 1
            ).map((pageNumber) => (
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
            ))}

            {/* Next */}
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

/* ✅ STATIC GENERATION */
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