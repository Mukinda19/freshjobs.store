import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

export default function EpfoJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/epfo-jobs`

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
        name: "EPFO Jobs",
        item: pageUrl,
      },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Latest EPFO Jobs 2026",
    description:
      "Daily updated EPFO jobs, provident fund vacancies, recruitment notifications and official apply links in India.",
    url: pageUrl,
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      url: `${siteUrl}/jobs/${job.slug}`,
    })),
  }

  return (
    <>
      <Head>
        <title>
          Latest EPFO Jobs 2026 | Provident Fund Recruitment India
        </title>

        <meta
          name="description"
          content="Find latest EPFO Jobs 2026 in India. Explore Provident Fund recruitment notifications, vacancies and official apply links updated daily."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Latest EPFO Jobs 2026" />
        <meta
          property="og:description"
          content="Daily updated EPFO recruitment and provident fund vacancies in India."
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
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "EPFO Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          EPFO Jobs 2026 – Latest Provident Fund Recruitment
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find latest EPFO jobs, provident fund recruitment notifications,
          vacancies and official apply links updated regularly across India.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No EPFO jobs available right now.
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
                href={`/epfo-jobs/page/${pageNumber}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href="/epfo-jobs/page/2"
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

export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    /* 🔹 First Search EPFO Jobs */
    let res = await fetch(
      `${siteUrl}/api/search?page=1&limit=10&q=epfo`
    )

    let data = await res.json()

    /* 🔹 Fallback to Govt Jobs */
    if (!data.jobs || data.jobs.length === 0) {
      res = await fetch(
        `${siteUrl}/api/search?category=govt-jobs&page=1&limit=10`
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