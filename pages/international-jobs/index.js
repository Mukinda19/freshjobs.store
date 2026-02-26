import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

export default function InternationalJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/international-jobs`

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I apply for international jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can apply directly through the official job source link provided inside each job listing.",
        },
      },
      {
        "@type": "Question",
        name: "Which countries are included in international jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "International jobs include opportunities from USA, UAE, Canada, UK, Europe and other global locations.",
        },
      },
    ],
  }

  return (
    <>
      <Head>
        <title>
          International Jobs 2026 | USA, UAE, Canada & Global Careers
        </title>

        <meta
          name="description"
          content="Find latest international jobs in USA, UAE, Canada, UK and other countries. Apply for global career opportunities in IT, healthcare, engineering and more."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:title" content="International Jobs 2026" />
        <meta property="og:description" content="Latest international job openings worldwide." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "International Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          International Jobs & Global Career Opportunities
        </h1>

        <p className="mb-6 text-gray-700">
          Explore verified international job openings across USA, UAE,
          Canada, UK and other countries. Updated regularly to help
          you find trusted global opportunities.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
              const pageNumber = i + 1
              const href =
                pageNumber === 1
                  ? "/international-jobs"
                  : `/international-jobs/page/${pageNumber}`

              return (
                <Link
                  key={pageNumber}
                  href={href}
                  className={`px-3 py-2 border rounded ${
                    pageNumber === 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            })}

            {totalPages > 1 && (
              <Link
                href={`/international-jobs/page/2`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                Next »
              </Link>
            )}

          </div>
        )}

        {/* Explore More */}
        <div className="mt-16 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">
            Explore More Job Categories
          </h2>

          <div className="flex flex-wrap gap-3">
            <Link href="/government-jobs" className="text-blue-600 underline">
              Government Jobs
            </Link>
            <Link href="/private-jobs" className="text-blue-600 underline">
              Private Jobs
            </Link>
            <Link href="/work-from-home" className="text-blue-600 underline">
              Work From Home Jobs
            </Link>
          </div>
        </div>

      </main>
    </>
  )
}


/* ✅ FINAL API BASED STATIC GENERATION */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=international&page=1&limit=10`
    )

    const data = await res.json()

    return {
      props: {
        jobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        siteUrl,
      },
      revalidate: 1800,
    }

  } catch {
    return {
      props: {
        jobs: [],
        totalPages: 1,
        siteUrl: "https://www.freshjobs.store",
      },
      revalidate: 1800,
    }
  }
}