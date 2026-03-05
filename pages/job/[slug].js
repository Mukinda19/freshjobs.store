import Head from "next/head"
import Link from "next/link"

/* ---------------- Helper ---------------- */

const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const cleanNumber = (value = "") =>
  String(value).replace(/[^\d]/g, "")

export default function JobDetailPage({ job, siteUrl }) {

  /* ---------------- EXPIRED JOB ---------------- */

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">

        <Head>
          <title>Job Expired | FreshJobs</title>
          <meta name="robots" content="noindex, follow" />
        </Head>

        <h1 className="text-2xl font-bold mb-4">
          This Job Has Expired
        </h1>

        <p className="mb-6">
          This job listing is no longer available. Explore the latest job openings below.
        </p>

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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

  const description =
    job.description ||
    job.snippet ||
    `Apply for ${title} at ${company}. Check eligibility, job location, salary details and official application process.`

  const canonicalSlug =
    job.slug ||
    normalizeSlug(`${job.title || ""} ${job.company || ""}`)

  const canonicalUrl = `${siteUrl}/job/${canonicalSlug}`

  const categorySlug = normalizeSlug(job.category || "jobs")

  const applyLink =
    job.url || job.link || job.applyLink || ""

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

    applicantLocationRequirements: {
      "@type": "Country",
      name: countryCode,
    },

    employmentType: employmentType,

    directApply: true,

    ...(salary && {
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
      job.date && !isNaN(new Date(job.date))
        ? new Date(job.date).toISOString()
        : new Date().toISOString(),

    dateModified: new Date().toISOString(),

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

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`${title} at ${company}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="FreshJobs" />

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

        <Link href="/" prefetch={false}>
          Home
        </Link>

        {" › "}

        <Link
          href={`/jobs/${categorySlug}/india`}
          prefetch={false}
        >
          {job.category || "Jobs"}
        </Link>

        {" › "}

        <span className="font-medium">
          {title}
        </span>

      </div>

      {/* Title */}

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {title}
      </h1>

      {/* Company */}

      <p className="text-gray-700 mb-3">
        {company} • {location}
      </p>

      {/* Salary */}

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
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Apply on Official Website →
        </a>

      )}

      {/* Internal SEO */}

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

/* ---------------- STATIC GENERATION ---------------- */

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.freshjobs.store"

  try {

    const res = await fetch(
      `${siteUrl}/api/search?slug=${params.slug}`
    )

    if (!res.ok) {
      return {
        props: { job: null, siteUrl },
        revalidate: 600,
      }
    }

    const data = await res.json()

    return {
      props: {
        job: data.job || null,
        siteUrl,
      },
      revalidate: 600,
    }

  } catch {

    return {
      props: { job: null, siteUrl },
      revalidate: 600,
    }

  }

}