import { useState, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"

/* 🔹 SLUG NORMALIZER */
const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export default function WorkFromHomeJobs({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialJobs.length === 10)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const nextPage = page + 1

      const res = await fetch(
        `/api/search?category=work-from-home&page=${nextPage}&limit=10`
      )

      const data = await res.json()

      if (!data.jobs || data.jobs.length === 0) {
        setHasMore(false)
      } else {
        setJobs((prev) => [...prev, ...data.jobs])
        setPage(nextPage)
        if (data.jobs.length < 10) setHasMore(false)
      }
    } catch (err) {
      console.error("Load more error:", err)
    }

    setLoading(false)
  }, [loading, hasMore, page])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are these work from home jobs verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we list remote and work from home jobs from trusted and official sources."
        }
      },
      {
        "@type": "Question",
        "name": "Can I apply for international remote jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, many listed jobs are open for global applicants including USA, UAE, Canada and other countries."
        }
      },
      {
        "@type": "Question",
        "name": "Are work from home jobs available for freshers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we regularly update remote jobs suitable for both freshers and experienced candidates."
        }
      }
    ]
  }

  return (
    <>
      <Head>
        <title>
          Remote & Work From Home Jobs Worldwide 2026 | FreshJobs
        </title>

        <meta
          name="description"
          content="Find latest remote and work from home jobs from global companies. Updated daily with verified listings for freshers and experienced candidates."
        />

        <link
          rel="canonical"
          href="https://freshjobs.store/work-from-home"
        />

        <meta name="robots" content="index, follow" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work From Home Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          Remote & Work From Home Jobs Worldwide
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore the latest <strong>remote jobs</strong>, work from home
          opportunities, online jobs and flexible careers from global
          companies. Whether you are from India, USA, UAE or anywhere in
          the world, find verified remote job listings updated daily.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            No work from home jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => {
            const slug =
              job.slug ||
              normalizeSlug(`${job.title || ""} ${job.company || ""}`)

            return (
              <article
                key={job.link || slug || index}
                className="border rounded-lg p-4 bg-white hover:shadow-md transition"
              >
                <h2 className="font-semibold mb-1">
                  <Link
                    href={`/job/${slug}`}
                    prefetch={false}
                    className="text-blue-700 hover:underline"
                  >
                    {job.title || "Remote Job Opportunity"}
                  </Link>
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  Source: {job.source || "Verified Portal"}
                </p>

                {job.description && (
                  <p className="text-sm text-gray-700 mb-3">
                    {job.description.slice(0, 140)}...
                  </p>
                )}

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-block mt-2 bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
                  >
                    Apply on Official Site →
                  </a>
                )}
              </article>
            )
          })}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Load More Jobs"}
            </button>
          </div>
        )}

        {/* Internal Linking Boost */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Explore More Opportunities
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <Link href="/resume-builder" prefetch={false}>
                Free Resume Builder
              </Link>
            </li>
            <li>
              <Link href="/ai-jobs" prefetch={false}>
                AI & Tech Jobs
              </Link>
            </li>
            <li>
              <Link href="/international-jobs" prefetch={false}>
                International Job Listings
              </Link>
            </li>
            <li>
              <Link href="/category/government/india" prefetch={false}>
                Government Jobs in India
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  )
}

/* ✅ Faster SSR */
export async function getServerSideProps({ res }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://freshjobs.store"

    const response = await fetch(
      `${baseUrl}/api/search?category=work-from-home&page=1&limit=10`
    )

    const data = await response.json()

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=300"
    )

    return {
      props: {
        initialJobs: data.jobs || [],
      },
    }
  } catch {
    return {
      props: {
        initialJobs: [],
      },
    }
  }
}