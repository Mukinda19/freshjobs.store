import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

export default function InternationalJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/international-jobs`

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I apply for international jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can apply directly through the official job source link provided inside each job listing."
        }
      },
      {
        "@type": "Question",
        "name": "Which countries are included in international jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "International jobs include opportunities from USA, UAE, Canada, UK, Europe and other global locations."
        }
      }
    ]
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

        {/* Open Graph */}
        <meta property="og:title" content="International Jobs 2026" />
        <meta property="og:description" content="Latest international job openings worldwide." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
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

        {/* Intro SEO Content */}
        <p className="mb-6 text-gray-700">
          Explore the latest international job openings across USA, UAE,
          Canada, UK and other countries. Find opportunities in IT,
          healthcare, engineering, remote jobs and skilled worker roles.
          All listings are updated regularly to help you find verified
          global career opportunities.
        </p>

        {/* Job Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">
            <Link
              href="/international-jobs"
              className="px-3 py-2 border rounded bg-blue-600 text-white"
            >
              1
            </Link>

            {[...Array(totalPages - 1)].map((_, i) => {
              const pageNumber = i + 2
              return (
                <Link
                  key={pageNumber}
                  href={`/international-jobs/page/${pageNumber}`}
                  className="px-3 py-2 border rounded hover:bg-gray-200"
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

        {/* Explore More Categories */}
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
            <Link href="/work-from-home-jobs" className="text-blue-600 underline">
              Work From Home Jobs
            </Link>
          </div>
        </div>

      </main>
    </>
  )
}

/* 🔥 Optimized Static Generation */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const response = await fetch(`${SHEET_URL}?limit=1000`)
    const data = await response.json()

    let jobs = Array.isArray(data.jobs) ? data.jobs : []

    const internationalDomains = [
      "remoteok","weworkremotely","remotive","jobicy",
    ]

    jobs = jobs.filter((job) => {
      const urlText = `
        ${job.url || ""}
        ${job.link || ""}
        ${job.apply_url || ""}
        ${job.source || ""}
      `.toLowerCase()

      return internationalDomains.some((d) =>
        urlText.includes(d)
      )
    })

    const limit = 10
    const totalPages = Math.ceil(jobs.length / limit)

    return {
      props: {
        jobs: jobs.slice(0, limit),
        totalPages,
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