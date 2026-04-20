import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

export default function FreshersJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/freshers-jobs`

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
        name: "Freshers Jobs",
        item: pageUrl,
      },
    ],
  }

  /* ✅ Collection Schema */
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Latest Freshers Jobs 2026",
    description:
      "Daily updated freshers jobs for graduates, diploma holders and entry level candidates across India.",
    url: pageUrl,
  }

  /* ✅ ItemList Schema */
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
          Latest Freshers Jobs 2026 | Entry Level Jobs India
        </title>

        <meta
          name="description"
          content="Find latest Freshers Jobs 2026 in India. Explore entry level jobs for graduates, diploma holders, 12th pass and beginners with official apply links."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Latest Freshers Jobs 2026" />
        <meta
          property="og:description"
          content="Daily updated freshers jobs for graduates, diploma and entry level candidates."
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Freshers Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          Freshers Jobs in India 2026 – Latest Entry Level Openings
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find latest freshers jobs for graduates, diploma holders,
          12th pass and beginners. Verified entry level vacancies
          updated daily with official apply links.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No freshers jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* ✅ Pagination */}
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
                href={`/freshers-jobs/page/${pageNumber}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href="/freshers-jobs/page/2"
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

/* ✅ STATIC GENERATION */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=freshers&page=1&limit=10`
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