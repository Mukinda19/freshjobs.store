import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../../components/Breadcrumb"

/* 🔹 SLUG NORMALIZER */
const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export default function WorkFromHomeJobs({ initialJobs, totalPages }) {
  const jobs = initialJobs

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these work from home jobs verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we list remote and work from home jobs from trusted and official sources."
        }
      },
      {
        "@type": "Question",
        name: "Can I apply for international remote jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, many listed jobs are open for global applicants including USA, UAE, Canada and other countries."
        }
      },
      {
        "@type": "Question",
        name: "Are work from home jobs available for freshers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we regularly update remote jobs suitable for both freshers and experienced candidates."
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
          href="https://www.freshjobs.store/work-from-home"
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
          companies.
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

        {/* ✅ Pagination Instead of Load More */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Link
              href="/work-from-home/page/2"
              className="px-4 py-2 border rounded hover:bg-gray-200"
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
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.freshjobs.store"

    const response = await fetch(
      `${baseUrl}/api/search?category=wfh&page=1&limit=10`
    )

    const data = await response.json()

    return {
      props: {
        initialJobs: data.jobs || [],
        totalPages: data.totalPages || 1,
      },
      revalidate: 300,
    }
  } catch {
    return {
      props: {
        initialJobs: [],
        totalPages: 1,
      },
      revalidate: 300,
    }
  }
}