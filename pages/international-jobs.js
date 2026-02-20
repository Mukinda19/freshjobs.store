import { useState, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../components/Breadcrumb"
import JobCard from "../components/JobCard"

export default function InternationalJobs({ initialJobs }) {
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
        `/api/search?category=international&page=${nextPage}&limit=10`
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
      console.error("International Load More Error:", err)
    }

    setLoading(false)
  }, [loading, hasMore, page])

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
        <title>
          International Jobs 2026 | USA, UAE, Canada & Global Careers
        </title>

        <meta
          name="description"
          content="Find latest international jobs in USA, UAE, Canada, UK and other countries. Explore overseas and remote global career opportunities with verified apply links."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://freshjobs.store/international-jobs"
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
            { label: "International Jobs" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-3">
          International Jobs & Global Career Opportunities
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore verified <strong>international job opportunities</strong>
          including onsite and remote roles from global companies in
          USA, UAE, Canada, UK and other countries. Updated daily with
          trusted application links.
        </p>

        {jobs.length === 0 && (
          <p className="text-red-500">
            Currently no international jobs available.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
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
            Explore More Job Categories
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <Link href="/resume-builder" prefetch={false}>
                Free Resume Builder
              </Link>
            </li>
            <li>
              <Link href="/work-from-home" prefetch={false}>
                Remote & Work From Home Jobs
              </Link>
            </li>
            <li>
              <Link href="/ai-jobs" prefetch={false}>
                AI & Tech Jobs
              </Link>
            </li>
            <li>
              <Link href="/government-jobs" prefetch={false}>
                Government Jobs in India
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  )
}

/* ✅ Faster SSR with Cache */
export async function getServerSideProps({ res }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://freshjobs.store"

    const response = await fetch(
      `${baseUrl}/api/search?category=international&page=1&limit=10`
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