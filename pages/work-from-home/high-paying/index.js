import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

export default function HighPayingWFHJobs({ jobs, totalPages, siteUrl }) {
  const pageUrl = `${siteUrl}/work-from-home/high-paying`

  return (
    <>
      <Head>
        {/* Primary SEO */}
        <title>
          High Paying Work From Home Jobs 2026 | Best Remote Jobs with High Salary
        </title>

        <meta
          name="description"
          content="Explore high paying work from home jobs with top salary packages. Verified remote jobs, international WFH opportunities and premium salary remote careers updated daily."
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="High Paying Work From Home Jobs 2026" />
        <meta
          property="og:description"
          content="Find verified high salary remote and work from home jobs from trusted companies worldwide."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FreshJobs" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="High Paying Work From Home Jobs 2026"
        />
        <meta
          name="twitter:description"
          content="Top paying remote and work from home jobs with premium salary packages."
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work From Home", href: "/work-from-home" },
            { label: "High Paying Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          High Paying Work From Home Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Discover high salary remote and work from home jobs offering
          competitive pay, global opportunities, flexible schedules and
          long-term career growth.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No high paying work from home jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* ✅ Numeric Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            {/* Page 1 Active */}
            <Link
              href="/work-from-home/high-paying"
              className="px-3 py-2 border rounded bg-blue-600 text-white"
            >
              1
            </Link>

            {/* Other Pages */}
            {[...Array(totalPages - 1)].map((_, i) => {
              const pageNumber = i + 2
              return (
                <Link
                  key={pageNumber}
                  href={`/work-from-home/high-paying/page/${pageNumber}`}
                  className="px-3 py-2 border rounded hover:bg-gray-200"
                >
                  {pageNumber}
                </Link>
              )
            })}

            {/* Next Button */}
            <Link
              href="/work-from-home/high-paying/page/2"
              className="px-3 py-2 border rounded hover:bg-gray-200"
            >
              Next »
            </Link>

          </div>
        )}
      </main>
    </>
  )
}

/* ✅ Static Generation */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=work-from-home&salary=high&page=1&limit=10`
    )

    const data = await res.json()

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