import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"

export default function AIJobs({ initialJobs, totalPages, siteUrl }) {
  const jobs = initialJobs
  const pageUrl = `${siteUrl}/ai-jobs`

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
        name: "AI Jobs",
        item: pageUrl,
      },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Jobs & Artificial Intelligence Careers",
    description:
      "Latest AI jobs, machine learning jobs, data science roles and artificial intelligence careers worldwide.",
    url: pageUrl,
    inLanguage: "en",
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What qualifications are required for AI jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most AI jobs require knowledge of machine learning, Python, data science, or artificial intelligence frameworks."
        }
      },
      {
        "@type": "Question",
        name: "Are AI jobs available remotely?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, many AI and machine learning roles are available as remote or hybrid positions globally."
        }
      },
      {
        "@type": "Question",
        name: "Do AI jobs offer high salary packages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI and data science roles are among the highest paying tech jobs worldwide."
        }
      }
    ]
  }

  return (
    <>
      <Head>
        <title>
          AI Jobs 2026 | Machine Learning & Data Science Careers Worldwide
        </title>

        <meta
          name="description"
          content="Find latest AI jobs, Machine Learning roles, Data Science and Artificial Intelligence careers worldwide. High-paying remote and global tech opportunities."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="AI Jobs 2026 | Machine Learning Careers" />
        <meta property="og:description" content="Latest AI, Machine Learning & Data Science job openings worldwide." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Jobs 2026" />
        <meta name="twitter:description" content="Explore latest AI & ML job openings worldwide." />

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
            { label: "AI Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          AI Jobs & Artificial Intelligence Careers
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore latest <strong>AI jobs, Machine Learning roles,
          Data Science careers</strong> and artificial intelligence
          opportunities from global tech companies.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            Currently no AI job openings found.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <article
              key={job.slug || job.link || index}
              className="border rounded-lg p-4 bg-white hover:shadow-lg transition"
            >
              <h2 className="font-semibold mb-1">
                {job.slug ? (
                  <Link
                    href={`/job/${job.slug}`}
                    prefetch={false}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {job.title || "AI Job Opening"}
                  </Link>
                ) : (
                  <span className="text-blue-600">
                    {job.title || "AI Job Opening"}
                  </span>
                )}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Source: {job.source || "Verified Portal"}
              </p>

              {job.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {job.description.slice(0, 150)}...
                </p>
              )}

              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-block mt-2 bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
                >
                  Apply Now →
                </a>
              )}
            </article>
          ))}
        </div>

        {/* ✅ 1–10 Pagination + Next */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2 flex-wrap">
            <span className="px-4 py-2 border rounded bg-blue-600 text-white">
              1
            </span>

            {Array.from({ length: Math.min(9, totalPages - 1) }, (_, i) => i + 2)
              .map((page) => (
                <Link
                  key={page}
                  href={`/ai-jobs/page/${page}`}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  {page}
                </Link>
              ))}

            {totalPages > 1 && (
              <Link
                href={`/ai-jobs/page/2`}
                className="px-4 py-2 border rounded hover:bg-gray-200"
              >
                Next »
              </Link>
            )}
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Explore More Career Options
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <Link href="/international-jobs" prefetch={false}>
                International Jobs
              </Link>
            </li>
            <li>
              <Link href="/work-from-home" prefetch={false}>
                Remote & Work From Home Jobs
              </Link>
            </li>
            <li>
              <Link href="/government-jobs" prefetch={false}>
                Government Jobs
              </Link>
            </li>
            <li>
              <Link href="/resume-builder" prefetch={false}>
                Free Resume Builder
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=ai-jobs&page=1&limit=10`
    )

    const data = await res.json()

    return {
      props: {
        initialJobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        siteUrl,
      },
      revalidate: 1800, // 30 min ISR
    }
  } catch {
    return {
      props: {
        initialJobs: [],
        totalPages: 1,
        siteUrl: "https://freshjobs.store",
      },
      revalidate: 1800,
    }
  }
}