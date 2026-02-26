import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../../components/Breadcrumb"
import JobCard from "../../../components/JobCard"

export default function HighPayingWFHJobs({
  jobs,
  totalPages,
  siteUrl,
}) {
  const pageUrl = `${siteUrl}/work-from-home/high-paying`

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
        name: "Work From Home",
        item: `${siteUrl}/work-from-home`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "High Paying Jobs",
        item: pageUrl,
      },
    ],
  }

  /* ✅ Collection Schema */
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "High Paying Work From Home Jobs",
    description:
      "Top salary remote and high paying work from home jobs from verified companies worldwide.",
    url: pageUrl,
  }

  /* ✅ FAQ Schema */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these high paying work from home jobs verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we list verified high salary remote jobs from trusted and official sources.",
        },
      },
      {
        "@type": "Question",
        name: "Do high paying remote jobs require experience?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some roles require experience, but we also list premium remote jobs suitable for skilled freshers.",
        },
      },
    ],
  }

  return (
    <>
      <Head>
        <title>
          High Paying Work From Home Jobs 2026 | Best Remote Jobs with High Salary
        </title>

        <meta
          name="description"
          content="Explore high paying work from home jobs with top salary packages. Verified remote jobs and premium international opportunities updated daily."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="High Paying Work From Home Jobs 2026" />
        <meta
          property="og:description"
          content="Top paying remote and work from home jobs with premium salary packages."
        />
        <meta property="og:url" content={pageUrl} />

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

        {/* ✅ 1–10 Pagination */}
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
                href={`/work-from-home/high-paying/page/${pageNumber}`}
                className="px-3 py-2 border rounded hover:bg-gray-200"
              >
                {pageNumber}
              </Link>
            ))}

            {totalPages > 1 && (
              <Link
                href={`/work-from-home/high-paying/page/2`}
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

/* ✅ STATIC GENERATION */
export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://freshjobs.store"

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
      revalidate: 1800,
    }
  } catch {
    return {
      props: {
        jobs: [],
        totalPages: 1,
        siteUrl: "https://freshjobs.store",
      },
      revalidate: 1800,
    }
  }
}