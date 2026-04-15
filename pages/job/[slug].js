import Head from "next/head"
import Link from "next/link"

/* ---------------- Helper Functions ---------------- */

const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const stripHtml = (text = "") =>
  String(text).replace(/<[^>]*>?/gm, "")

const extractSalaryNumber = (value = "") =>
  String(value).replace(/[^\d]/g, "")

/* ---------------- Page ---------------- */

export default function JobDetailPage({ job, siteUrl, relatedJobs = [] }) {

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">

        <Head>
          <title>Job Expired | FreshJobs</title>
          <meta name="robots" content="noindex, follow" />
        </Head>

        <h1 className="text-2xl font-bold mb-4">
          This Job Is No Longer Available
        </h1>

        <p className="mb-6">
          This job listing may have expired or been removed.
        </p>

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Browse Latest Jobs
        </Link>

      </div>
    )
  }

  const title = job.title || "Latest Job Opening"
  const company = job.company || "Company"
  const location = job.location || "India"
  const salary = job.salary || ""

  const description = stripHtml(
    job.description ||
      `Apply for ${title} job at ${company}.`
  ).slice(0, 500)

  const canonicalSlug =
    job.slug || normalizeSlug(`${job.title} ${job.company}`)

  // ✅ REMOVE TRAILING SLASH
  const cleanSlug = canonicalSlug.replace(/\/$/, "")

  const canonicalUrl = `${siteUrl}/job/${cleanSlug}`

  const categorySlug = normalizeSlug(job.category || "jobs")

  const applyLink = job.link || job.applyLink || ""

  const salaryNumber = extractSalaryNumber(salary)

  /* ---------------- Schema ---------------- */

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",

    title: title,
    description: description,
    identifier: {
      "@type": "PropertyValue",
      name: company,
      value: cleanSlug,
    },

    datePosted: job.datePosted || new Date().toISOString(),
    validThrough:
      job.validThrough ||
      new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString(),

    employmentType: job.type || "FULL_TIME",

    hiringOrganization: {
      "@type": "Organization",
      name: company,
      sameAs: siteUrl,
    },

    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Not Available",
        addressLocality: location,
        addressRegion: location,
        postalCode: "000000",
        addressCountry: "IN",
      },
    },

    directApply: true,
    url: canonicalUrl,

    ...(applyLink && {
      applicationContact: {
        "@type": "ContactPoint",
        url: applyLink,
      },
    }),

    ...(salaryNumber && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          value: Number(salaryNumber),
          unitText: "MONTH",
        },
      },
    }),
  }

  return (
    <div className="max-w-4xl mx-auto p-4">

      <Head>

        <title>
          {title} at {company} ({location}) | FreshJobs
        </title>

        <meta
          name="description"
          content={`Apply for ${title} job at ${company} in ${location}.`}
        />

        {/* ✅ FIX INDEXING */}
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`${title} at ${company}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingSchema),
          }}
        />

      </Head>

      {/* Breadcrumb */}
      <div className="text-sm mb-5 text-gray-600">
        <Link href="/">Home</Link>
        {" › "}
        <Link href={`/jobs/${categorySlug}/india`}>
          {job.category || "Jobs"}
        </Link>
        {" › "}
        <span className="font-medium">{title}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {title}
      </h1>

      <p className="text-gray-700 mb-3">
        {company} • {location}
      </p>

      {salary && (
        <p className="text-green-700 font-semibold mb-4">
          💰 Salary: {salary}
        </p>
      )}

      {/* Description */}
      <div className="bg-white border rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3 text-lg">
          Job Description
        </h2>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>

      {/* Apply */}
      {applyLink && (
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Apply on Official Website →
        </a>
      )}

      {/* ✅ NEW: SIMILAR JOBS (VERY IMPORTANT FOR INDEXING) */}
      {relatedJobs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">
            Similar Jobs
          </h2>

          <div className="grid gap-3">
            {relatedJobs.slice(0, 5).map((item, i) => (
              <Link
                key={i}
                href={`/job/${item.slug}`}
                className="block border p-3 rounded hover:bg-gray-50"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

/* ---------------- SERVER FETCH ---------------- */

export async function getServerSideProps({ params }) {

  const slug = params.slug

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.freshjobs.store"

  try {

    const res = await fetch(
      `${siteUrl}/api/search?slug=${slug}`
    )

    const data = await res.json()

    return {
      props: {
        job: data.job || null,
        relatedJobs: data.relatedJobs || [], // ✅ IMPORTANT
        siteUrl,
      },
    }

  } catch {

    return {
      props: {
        job: null,
        relatedJobs: [],
        siteUrl,
      },
    }

  }

}