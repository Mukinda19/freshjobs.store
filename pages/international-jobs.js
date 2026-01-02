import Head from "next/head"
import Parser from "rss-parser"
import Link from "next/link"

const parser = new Parser()

const RSS_FEEDS = [
  "https://freejobalert.com/feed",
  "https://govtjobsalert.in/feed",
  "https://freshersnow.com/feed",
  "https://naukrinama.com/feed",
]

const INDIA_KEYWORDS = [
  "india", "mumbai", "pune", "delhi",
  "bangalore", "chennai", "hyderabad"
]

export async function getServerSideProps({ query }) {
  const page = parseInt(query.page || "1")
  const limit = 10
  let jobs = []

  for (const feed of RSS_FEEDS) {
    const data = await parser.parseURL(feed)

    data.items.forEach(item => {
      const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase()

      const isIndiaJob = INDIA_KEYWORDS.some(k => text.includes(k))

      if (!isIndiaJob) {
        jobs.push({
          title: item.title,
          link: item.link,
          location: "International / Overseas",
          type: text.includes("remote") ? "Remote" : "Onsite",
        })
      }
    })
  }

  const totalPages = Math.ceil(jobs.length / limit)
  const start = (page - 1) * limit

  return {
    props: {
      jobs: jobs.slice(start, start + limit),
      page,
      totalPages,
    },
  }
}

export default function InternationalJobs({ jobs, page, totalPages }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "International Jobs",
    description: "Latest international jobs for Indians including remote and overseas jobs.",
  }

  return (
    <>
      <Head>
        <title>International Jobs for Indians | Overseas & Remote Jobs</title>
        <meta
          name="description"
          content="Find latest international jobs, overseas jobs, remote and work from home opportunities for Indian candidates."
        />
        <link rel="canonical" href="https://freshjobs.store/international-jobs" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link> › International Jobs
        </nav>

        <h1 className="text-3xl font-bold mb-6">
          International Jobs
        </h1>

        {/* Jobs */}
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-500">
                {job.location} • {job.type}
              </p>

              <a
                href={job.link}
                target="_blank"
                rel="nofollow noopener"
                className="inline-block mt-3 text-blue-600 font-medium"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8">
          {page > 1 && (
            <Link
              href={`/international-jobs?page=${page - 1}`}
              className="px-4 py-2 border rounded"
            >
              Previous
            </Link>
          )}

          {page < totalPages && (
            <Link
              href={`/international-jobs?page=${page + 1}`}
              className="px-4 py-2 border rounded"
            >
              Next
            </Link>
          )}
        </div>
      </main>
    </>
  )
}