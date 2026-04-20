import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"
import JobCard from "../../components/JobCard"

export default function PrivateJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/private-jobs`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement": [
      {
        "@type": "ListItem",
        position": 1,
        name": "Home",
        item": siteUrl,
      },
      {
        "@type": "ListItem",
        position": 2,
        name": "Private Jobs",
        item": pageUrl,
      },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Latest Private Jobs 2026",
    description:
      "Daily updated private jobs in India for freshers and experienced candidates across IT, banking, sales, BPO and more sectors.",
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
          Latest Private Jobs 2026 | Company Jobs India
        </title>

        <meta
          name="description"
          content="Find latest Private Jobs 2026 in India. Explore company jobs for freshers and experienced candidates in IT, banking, BPO, sales and more sectors."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Latest Private Jobs 2026" />
        <meta
          property="og:description"
          content="Daily updated private company jobs across multiple sectors in India."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FreshJobs" />

        <meta name="twitter:card" content="summary_large_image" />

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
            { label: "Private Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">
          Private Jobs in India 2026 – Latest Company Openings
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore latest private jobs in India for freshers and experienced
          candidates. Verified company vacancies updated daily with apply links.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No private jobs available right now.
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
                href={`/private-jobs/page/${pageNumber}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href="/private-jobs/page/2"
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

    const res = await fetch(
      `${siteUrl}/api/search?category=private-jobs&page=1&limit=10`
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