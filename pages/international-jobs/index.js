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
        name: "Can I apply for jobs outside my country?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, many international jobs listed here are open to global applicants. Please check visa and eligibility requirements before applying."
        }
      },
      {
        "@type": "Question",
        name: "Are remote international jobs available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we list both onsite and remote international job opportunities from global companies."
        }
      },
      {
        "@type": "Question",
        name: "Which countries are included in international jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We publish job listings from USA, UAE, Canada, UK, Australia and other countries."
        }
      }
    ]
  }

  return (
    <>
      <Head>
        {/* Primary SEO */}
        <title>
          International Jobs 2026 | USA, UAE, Canada & Global Careers
        </title>

        <meta
          name="description"
          content="Find latest international jobs in USA, UAE, Canada, UK and other countries. Explore overseas and remote global career opportunities with verified apply links."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="International Jobs 2026 | FreshJobs" />
        <meta
          property="og:description"
          content="Explore overseas and remote global job opportunities with trusted companies worldwide."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FreshJobs" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="International Jobs 2026 | FreshJobs" />
        <meta
          name="twitter:description"
          content="Discover verified international and overseas job opportunities."
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "International Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          International Jobs & Global Career Opportunities
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore verified international job opportunities including onsite and
          remote roles from global companies in USA, UAE, Canada, UK and other
          countries. Updated daily with trusted application links.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            Currently no international jobs available.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* Numeric Pagination */}
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
                href="/international-jobs/page/2"
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                Next »
              </Link>
            )}
          </div>
        )}

        {/* Internal Links */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Explore More Job Categories
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <Link href="/resume-builder">Free Resume Builder</Link>
            </li>
            <li>
              <Link href="/work-from-home">Remote & Work From Home Jobs</Link>
            </li>
            <li>
              <Link href="/ai-jobs">AI & Tech Jobs</Link>
            </li>
            <li>
              <Link href="/government-jobs">
                Government Jobs in India
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  )
}

/* Static Generation */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const response = await fetch(
      `${siteUrl}/api/search?category=international&page=1&limit=10`
    )

    const data = await response.json()

    return {
      props: {
        jobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        siteUrl,
      },
      revalidate: 600,
    }
  } catch {
    return {
      props: {
        jobs: [],
        totalPages: 1,
        siteUrl: "https://www.freshjobs.store",
      },
      revalidate: 600,
    }
  }
}