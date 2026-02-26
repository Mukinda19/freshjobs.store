import Head from "next/head"
import Link from "next/link"

/* 🔹 CLEAN HTML */
const cleanText = (text = "") =>
  text.replace(/<[^>]*>?/gm, "").trim()

export default function WorkFromHomeJobDetail({ job, siteUrl }) {
  if (!job) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Job Not Found
        </h1>
        <Link href="/work-from-home" className="text-blue-600 underline">
          ← Back to Work From Home Jobs
        </Link>
      </main>
    )
  }

  const cleanDescription = cleanText(job.description || "")

  const postedDate = job.pubDate
    ? new Date(job.pubDate).toISOString()
    : new Date().toISOString()

  const validThrough = new Date()
  validThrough.setDate(validThrough.getDate() + 30)

  const pageUrl = `${siteUrl}/work-from-home/${job.slug}`

  /* ✅ GOOGLE JOBS SCHEMA */
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title || "Work From Home Job",
    description:
      cleanDescription ||
      "Latest remote and work from home job opportunity.",
    datePosted: postedDate,
    validThrough: validThrough.toISOString(),
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.source || "FreshJobs.Store",
      sameAs: siteUrl,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    identifier: {
      "@type": "PropertyValue",
      name: "FreshJobs.Store",
      value: job.slug || job.link,
    },
    url: job.link || pageUrl,
  }

  return (
    <>
      <Head>
        <title>
          {job.title
            ? `${job.title} | Work From Home Job | FreshJobs`
            : "Work From Home Job | FreshJobs"}
        </title>

        <meta
          name="description"
          content={
            cleanDescription
              ? cleanDescription.slice(0, 160)
              : "Latest remote job opportunity."
          }
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={job.title} />
        <meta
          property="og:description"
          content={cleanDescription.slice(0, 160)}
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />

        {/* JobPosting Schema */}
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
            {job.title}
          </h1>

          {job.source && (
            <p className="text-sm text-gray-500 mb-4">
              Source: {job.source}
            </p>
          )}

          <div className="text-gray-800 leading-relaxed mb-6 whitespace-pre-line">
            {cleanDescription}
          </div>

          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
            >
              Apply Now →
            </a>
          )}

          <div className="mt-8">
            <Link
              href="/work-from-home"
              className="text-blue-600 hover:underline"
            >
              ← Back to Work From Home Jobs
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/* ✅ STATIC GENERATION */
export async function getStaticProps({ params }) {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?category=wfh&limit=500`
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
        siteUrl,
      },
      revalidate: 1800,
    }
  } catch {
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}