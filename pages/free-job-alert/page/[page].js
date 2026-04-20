import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

export default function FreeJobAlertPage({
  jobs,
  currentPage,
  totalPages,
  siteUrl,
}) {
  const baseUrl = `${siteUrl}/free-job-alert`

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
        name: "Free Job Alert",
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

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free Job Alert - Page ${currentPage}`,
    description: `Browse page ${currentPage} of latest government jobs, private jobs, freshers jobs and remote jobs.`,
    url: pageUrl,
  }

  return (
    <>
      <Head>
        <title>
          Free Job Alert 2026 - Page {currentPage} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Browse page ${currentPage} of latest free job alerts including government jobs, private jobs, railway jobs, freshers jobs and remote jobs.`}
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

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Free Job Alert - Page ${currentPage}`}
        />
        <meta
          property="og:description"
          content="Latest free job alerts updated daily."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FreshJobs" />

        <meta name="twitter:card" content="summary_large_image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(collectionSchema),
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Free Job Alert", href: "/free-job-alert" },
            { label: `Page ${currentPage}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6">
          Free Job Alert - Page {currentPage}
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            {currentPage > 1 && (
              <Link
                href={
                  currentPage === 2
                    ? "/free-job-alert"
                    : `/free-job-alert/page/${currentPage - 1}`
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
                    ? "/free-job-alert"
                    : `/free-job-alert/page/${pageNumber}`
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
                href={`/free-job-alert/page/${currentPage + 1}`}
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
      `${siteUrl}/api/search?page=${page}&limit=10`
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