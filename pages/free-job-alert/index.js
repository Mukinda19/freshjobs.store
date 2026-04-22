import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

export default function FreeJobAlert({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/free-job-alert`

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
        item: pageUrl,
      },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Job Alert 2026",
    description:
      "Latest free job alerts for government jobs, railway jobs, banking jobs, defence jobs and freshers jobs.",
    url: pageUrl,
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      url: `${siteUrl}/job/${job.slug}`,
    })),
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Free Job Alert page updated daily?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, latest jobs are updated regularly with new openings and notifications.",
        },
      },
      {
        "@type": "Question",
        name: "Which jobs are available here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Government jobs, railway jobs, banking jobs, defence jobs, freshers jobs and other career alerts.",
        },
      },
      {
        "@type": "Question",
        name: "How to apply for jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open any job listing and apply through the official source link.",
        },
      },
    ],
  }

  return (
    <>
      <Head>
        <title>
          Free Job Alert 2026 | Latest Govt Job Notifications
        </title>

        <meta
          name="description"
          content="Get free job alerts for latest government jobs, railway jobs, banking jobs, defence jobs and freshers jobs updated daily."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Free Job Alert 2026 | Latest Govt Job Notifications"
        />
        <meta
          property="og:description"
          content="Latest government, railway, banking and freshers job alerts updated daily."
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />
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
            { label: "Free Job Alert" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          Free Job Alert 2026 – Latest Job Notifications
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find latest free job alerts including government jobs,
          railway jobs, banking jobs, defence jobs and freshers jobs
          with official apply links.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">

            <span className="px-3 py-2 border rounded bg-blue-600 text-white">
              1
            </span>

            {Array.from(
              { length: Math.min(9, totalPages - 1) },
              (_, i) => i + 2
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/free-job-alert/page/${pageNumber}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                {pageNumber}
              </Link>
            ))}

            {totalPages > 1 && (
              <Link
                href="/free-job-alert/page/2"
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                Next »
              </Link>
            )}

          </div>
        )}

        <section className="mt-14 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Popular Job Categories
          </h2>

          <div className="flex flex-wrap gap-3">
            <Link href="/government-jobs" className="text-blue-600 underline">
              Government Jobs
            </Link>

            <Link href="/freshers-jobs" className="text-blue-600 underline">
              Freshers Jobs
            </Link>

            <Link href="/epfo-jobs" className="text-blue-600 underline">
              EPFO Jobs
            </Link>

            <Link href="/remote-jobs" className="text-blue-600 underline">
              Remote Jobs
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}

export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    let res = await fetch(
      `${siteUrl}/api/search?page=1&limit=10&q=government job`
    )

    let data = await res.json()

    if (!data.jobs || data.jobs.length === 0) {
      res = await fetch(
        `${siteUrl}/api/search?page=1&limit=10&q=railway`
      )
      data = await res.json()
    }

    if (!data.jobs || data.jobs.length === 0) {
      res = await fetch(
        `${siteUrl}/api/search?page=1&limit=10&q=banking`
      )
      data = await res.json()
    }

    if (!data.jobs || data.jobs.length === 0) {
      res = await fetch(
        `${siteUrl}/api/search?page=1&limit=10&q=recruitment`
      )
      data = await res.json()
    }

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