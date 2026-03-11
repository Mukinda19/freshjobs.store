import Head from "next/head"
import Link from "next/link"

/* ---------------- Helper ---------------- */

const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const cleanNumber = (value = "") =>
  String(value).replace(/[^\d]/g, "")

const stripHtml = (text = "") =>
  String(text).replace(/<[^>]*>?/gm, "")

/* ---------------- Page ---------------- */

export default function JobDetailPage({ job, siteUrl }) {

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
          This job listing may have expired or been removed by the employer.
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
    `Apply for ${title} at ${company}. Check eligibility, salary details and official application process.`
  ).slice(0,800)

  const canonicalSlug =
    job.slug ||
    normalizeSlug(`${job.title || ""} ${job.company || ""}`)

  const canonicalUrl = `${siteUrl}/job/${canonicalSlug}`

  const categorySlug = normalizeSlug(job.category || "jobs")

  const applyLink =
    job.link || job.applyLink || ""

  const lowerLocation = location.toLowerCase()

  const isRemote =
    lowerLocation.includes("remote") ||
    lowerLocation.includes("work from home") ||
    lowerLocation.includes("wfh")

  const isInternational =
    lowerLocation.includes("usa") ||
    lowerLocation.includes("uae") ||
    lowerLocation.includes("canada") ||
    lowerLocation.includes("uk") ||
    lowerLocation.includes("australia")

  const countryCode = isInternational ? "US" : "IN"
  const currency = isInternational ? "USD" : "INR"

  const employmentType =
    job.employmentType?.toUpperCase() || "FULL_TIME"

  /* ---------------- Breadcrumb Schema ---------------- */

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
        name: job.category || "Jobs",
        item: `${siteUrl}/jobs/${categorySlug}/india`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  }

  /* ---------------- JobPosting Schema ---------------- */

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",

    title: title,
    description: description,
    url: canonicalUrl,

    identifier: {
      "@type": "PropertyValue",
      name: "FreshJobs",
      value: canonicalSlug,
    },

    hiringOrganization: {
      "@type": "Organization",
      name: company,
      sameAs: siteUrl,
    },

    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: countryCode,
      },
    },

    ...(isRemote && {
      jobLocationType: "TELECOMMUTE",
    }),

    employmentType: employmentType,

    directApply: true,

    ...(salary &&
      cleanNumber(salary) && {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: currency,
          value: {
            "@type": "QuantitativeValue",
            value: cleanNumber(salary),
            unitText: "MONTH",
          },
        },
      }),

    datePosted:
      job.datePosted && !isNaN(new Date(job.datePosted))
        ? new Date(job.datePosted).toISOString()
        : new Date().toISOString(),

    validThrough:
      job.validThrough ||
      new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString(),
  }

  return (

    <div className="max-w-4xl mx-auto p-4">

      <Head>

        <title>
          {title} at {company} ({location}) | FreshJobs
        </title>

        <meta
          name="description"
          content={`Apply for ${title} job at ${company} in ${location}. Check eligibility, salary details and official apply link.`}
        />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`${title} at ${company}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

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

        <span className="font-medium">
          {title}
        </span>

      </div>

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

      <div className="bg-white border rounded-lg p-5 mb-6">

        <h2 className="font-semibold mb-3 text-lg">
          Job Description
        </h2>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {description}
        </p>

      </div>

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

      <div className="mt-12 border-t pt-6">

        <h3 className="font-semibold mb-3 text-lg">
          Explore More Jobs
        </h3>

        <ul className="list-disc pl-5 text-blue-700 space-y-2">

          <li>
            <Link href="/jobs/govt-jobs/india">
              Government Jobs
            </Link>
          </li>

          <li>
            <Link href="/jobs/work-from-home/india">
              Work From Home Jobs
            </Link>
          </li>

          <li>
            <Link href="/jobs/it/india">
              IT Jobs
            </Link>
          </li>

        </ul>

      </div>

    </div>
  )
}