import Head from "next/head"
import Link from "next/link"

const cleanText = (text = "") =>
  text.replace(/<[^>]*>?/gm, "").trim()

export default function WorkFromHomeJobDetail({ job, baseUrl }) {
  if (!job) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Job not found
        </h1>
        <Link href="/work-from-home" className="text-blue-600 underline">
          ← Back to Work From Home Jobs
        </Link>
      </main>
    )
  }

  const postedDate = job.pubDate
    ? new Date(job.pubDate).toISOString()
    : new Date().toISOString()

  const validThrough = new Date()
  validThrough.setDate(validThrough.getDate() + 30)

  const cleanDescription = cleanText(job.description || "")

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
      sameAs: baseUrl,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    identifier: {
      "@type": "PropertyValue",
      name: "FreshJobs.Store",
      value: job.slug || job.link || "wfh-job",
    },
    url: `${baseUrl}/work-from-home/${job.slug}`,
  }

  return (
    <>
      <Head>
        <title>
          {job.title
            ? `${job.title} – Work From Home Job | FreshJobs.Store`
            : "Work From Home Job | FreshJobs.Store"}
        </title>

        <meta
          name="description"
          content={
            cleanDescription
              ? cleanDescription.slice(0, 160)
              : "Latest remote and work from home job opportunity."
          }
        />

        <link
          rel="canonical"
          href={`${baseUrl}/work-from-home/${job.slug}`}
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
            {job.title}
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Source: {job.source || "Verified Portal"}
          </p>

          {cleanDescription && (
            <div className="text-gray-800 leading-relaxed mb-6 whitespace-pre-line">
              {cleanDescription}
            </div>
          )}

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

/* ✅ SUPER SAFE SSR */
export async function getServerSideProps({ params }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://freshjobs.store"

    const res = await fetch(
      `${baseUrl}/api/search?category=work-from-home&limit=300`
    )

    if (!res.ok) {
      return { notFound: true }
    }

    const data = await res.json()

    // Handle every possible structure
    let jobsArray = []

    if (Array.isArray(data)) {
      jobsArray = data
    } else if (Array.isArray(data.jobs)) {
      jobsArray = data.jobs
    } else if (Array.isArray(data.results)) {
      jobsArray = data.results
    }

    const job = jobsArray.find(
      (j) =>
        j.slug === params.slug ||
        j.link?.includes(params.slug)
    )

    if (!job) {
      return { notFound: true }
    }

    return {
      props: {
        job,
        baseUrl,
      },
    }
  } catch (error) {
    return { notFound: true }
  }
}