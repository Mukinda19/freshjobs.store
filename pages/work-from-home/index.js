import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Breadcrumb from "../../components/Breadcrumb"

/* 🔹 SAFE TEXT CLEANER */
const cleanText = (text = "") =>
  String(text).replace(/<[^>]*>?/gm, "").trim()

/* 🔹 SLUG NORMALIZER */
const normalizeSlug = (text = "") =>
  cleanText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export default function WorkFromHomeJobs({
  initialJobs,
  totalPages,
  siteUrl,
}) {

  const router = useRouter()

  const currentPage = Number(router.query.page) || 1

  const jobs = initialJobs || []

  const pageUrl =
    currentPage > 1
      ? `${siteUrl}/work-from-home?page=${currentPage}`
      : `${siteUrl}/work-from-home`

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
        name: "Work From Home Jobs",
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <Head>

        <title>
          Remote & Work From Home Jobs Worldwide
          {currentPage > 1 ? ` | Page ${currentPage}` : ""} | FreshJobs
        </title>

        <meta
          name="description"
          content="Find latest remote and work from home jobs from global companies. Updated daily with verified listings."
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={pageUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work From Home Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          Remote & Work From Home Jobs Worldwide
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore the latest <strong>remote jobs</strong>, work from home
          opportunities, online jobs and flexible careers from global
          companies.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No work from home jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">

          {jobs.map((job, index) => {

            const slug =
              job.slug ||
              normalizeSlug(`${job.title || ""} ${job.company || ""}`)

            const description = cleanText(job.description || "")

            return (

              <article
                key={job.link || slug || index}
                className="border rounded-lg p-4 bg-white hover:shadow-md transition"
              >

                <h2 className="font-semibold mb-1">

                  <Link
                    href={`/job/${slug}`}
                    prefetch={false}
                    className="text-blue-700 hover:underline"
                  >
                    {cleanText(job.title) || "Remote Job Opportunity"}
                  </Link>

                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  Source: {cleanText(job.source || "Verified Portal")}
                </p>

                {description && (
                  <p className="text-sm text-gray-700 mb-3">
                    {description.slice(0, 140)}...
                  </p>
                )}

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-block mt-2 bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
                  >
                    Apply on Official Site →
                  </a>
                )}

              </article>

            )

          })}

        </div>

        {/* ✅ Pagination */}

        {totalPages > 1 && (

          <div className="flex justify-center mt-10 space-x-2 flex-wrap">

            {currentPage > 1 && (
              <Link
                href={`/work-from-home?page=${currentPage - 1}`}
                className="px-4 py-2 border rounded hover:bg-gray-200"
              >
                « Prev
              </Link>
            )}

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1)
              .map((page) => (

                <Link
                  key={page}
                  href={`/work-from-home?page=${page}`}
                  className={`px-4 py-2 border rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {page}
                </Link>

              ))}

            {currentPage < totalPages && (
              <Link
                href={`/work-from-home?page=${currentPage + 1}`}
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

/* ✅ STATIC GENERATION */

export async function getServerSideProps({ query }) {

  const page = Number(query.page) || 1

  try {

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://freshjobs.store"

    const response = await fetch(
      `${siteUrl}/api/search?category=work-from-home&page=${page}&limit=10`
    )

    const data = await response.json()

    return {
      props: {
        initialJobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        siteUrl,
      },
    }

  } catch {

    return {
      props: {
        initialJobs: [],
        totalPages: 1,
        siteUrl: "https://freshjobs.store",
      },
    }

  }

}