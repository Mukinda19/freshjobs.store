import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"

export default function AIJobs({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialJobs.length === 10)

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const nextPage = page + 1
    const res = await fetch(
      `/api/search?category=ai-jobs&page=${nextPage}&limit=10`
    )
    const data = await res.json()

    if (!data.jobs || data.jobs.length === 0) {
      setHasMore(false)
    } else {
      setJobs((prev) => [...prev, ...data.jobs])
      setPage(nextPage)
      if (data.jobs.length < 10) setHasMore(false)
    }

    setLoading(false)
  }

  /* ---------------- SEO SCHEMAS ---------------- */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://freshjobs.store/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Jobs",
        item: "https://freshjobs.store/ai-jobs",
      },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Jobs & Artificial Intelligence Jobs",
    description:
      "Latest AI jobs, machine learning jobs, and artificial intelligence job openings.",
    url: "https://freshjobs.store/ai-jobs",
  }

  const jobSchema = jobs.slice(0, 5).map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title || "AI Job Opening",
    description:
      job.description ||
      "AI and Machine Learning related job opportunity.",
    hiringOrganization: {
      "@type": "Organization",
      name: job.source || "FreshJobs.Store",
    },
    employmentType: "FULL_TIME",
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    url: job.slug
      ? `https://freshjobs.store/ai-jobs/${job.slug}`
      : "https://freshjobs.store/ai-jobs",
  }))

  return (
    <>
      <Head>
        <title>AI Jobs & Artificial Intelligence Jobs | FreshJobs.Store</title>

        <meta
          name="description"
          content="Find latest AI jobs, Machine Learning roles, Data Science and Artificial Intelligence job openings. Apply from verified sources."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://freshjobs.store/ai-jobs" />

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
            __html: JSON.stringify(jobSchema),
          }}
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
          AI Jobs & Artificial Intelligence Jobs
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore latest{" "}
          <strong>
            AI jobs, Machine Learning roles, Data Science careers
          </strong>{" "}
          including Indian and international opportunities.
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
                    href={`/ai-jobs/${job.slug}`}
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

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Load More AI Jobs"}
            </button>
          </div>
        )}
      </main>
    </>
  )
}

/* ---------------- SSR ---------------- */
export async function getServerSideProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=ai-jobs&page=1&limit=10`
    )
    const data = await res.json()

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