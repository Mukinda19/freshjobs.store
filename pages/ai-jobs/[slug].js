import Head from "next/head"
import Link from "next/link"

export default function AIJobDetail({ job }) {
  if (!job) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Job not found
        </h1>
        <Link href="/ai-jobs" className="text-blue-600 underline">
          ← Back to AI Jobs
        </Link>
      </main>
    )
  }

  // ✅ SAFE DATE HANDLING
  const postedDate = job.pubDate
    ? new Date(job.pubDate).toISOString()
    : new Date().toISOString()

  const validThrough = new Date()
  validThrough.setDate(validThrough.getDate() + 30)

  /* ✅ GOOGLE JOBS OPTIMIZED SCHEMA */
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title || "AI Job Opening",
    description:
      job.description ||
      "Latest Artificial Intelligence and Machine Learning job opening.",
    datePosted: postedDate,
    validThrough: validThrough.toISOString(),
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.source || "FreshJobs.Store",
      sameAs: "https://freshjobs.store",
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    identifier: {
      "@type": "PropertyValue",
      name: "FreshJobs.Store",
      value: job.slug,
    },
    url: job.link || `https://freshjobs.store/ai-jobs/${job.slug}`,
  }

  return (
    <>
      <Head>
        <title>
          {job.title
            ? `${job.title} – AI Job | FreshJobs.Store`
            : "AI Job Opening | FreshJobs.Store"}
        </title>

        <meta
          name="description"
          content={
            job.description
              ? job.description.slice(0, 160)
              : "Latest AI and Artificial Intelligence job opening."
          }
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={`https://freshjobs.store/ai-jobs/${job.slug}`}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobSchema),
          }}
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <article className="border rounded-lg p-6 bg-white shadow-sm">
          <h1 className="text-2xl font-bold mb-3">
            {job.title || "AI Job Opening"}
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Source: {job.source || "Verified Portal"}
          </p>

          {job.description && (
            <div className="text-gray-800 leading-relaxed mb-6 whitespace-pre-line">
              {job.description}
            </div>
          )}

          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
            >
              Apply Now →
            </a>
          )}

          <div className="mt-8">
            <Link href="/ai-jobs" className="text-blue-600 hover:underline">
              ← Back to AI Jobs
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/* ✅ SSR */
export async function getServerSideProps({ params }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=ai-jobs&limit=300`
    )

    const data = await res.json()

    const job = (data.jobs || []).find(
      (j) => j.slug === params.slug
    )

    if (!job) {
      return { notFound: true }
    }

    return {
      props: {
        job,
      },
    }
  } catch (error) {
    return { notFound: true }
  }
}