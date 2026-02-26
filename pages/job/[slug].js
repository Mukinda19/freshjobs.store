import Head from "next/head"
import Link from "next/link"

/* ---------------- Helper ---------------- */
const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export default function JobDetailPage({ job, siteUrl }) {
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Head>
          <title>Job Not Found | FreshJobs</title>
          <meta name="robots" content="noindex" />
        </Head>
        <h1 className="text-2xl font-bold">Job Not Found</h1>
      </div>
    )
  }

  const title = job.title || "Latest Job Opening"
  const company = job.company || "Company"
  const location = job.location || "Worldwide"
  const salary = job.salary || ""
  const description =
    job.snippet ||
    job.description ||
    "Check eligibility, job details, and apply using the official link."

  const canonicalSlug =
    job.slug ||
    normalizeSlug(`${job.title || ""} ${job.company || ""}`)

  /* ✅ FIXED URL STRUCTURE */
  const canonicalUrl = `${siteUrl}/jobs/${canonicalSlug}`

  const categorySlug = normalizeSlug(job.category || "jobs")
  const applyLink = job.url || job.link || job.applyLink || ""

  /* -------- Country Detection -------- */
  const lowerLocation = location.toLowerCase()

  const isInternational =
    lowerLocation.includes("usa") ||
    lowerLocation.includes("uae") ||
    lowerLocation.includes("canada") ||
    lowerLocation.includes("uk") ||
    lowerLocation.includes("australia")

  const countryCode = isInternational ? "US" : "IN"
  const currency = isInternational ? "USD" : "INR"

  /* ================= SCHEMA ================= */

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
        item: `${siteUrl}/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  }

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: title,
    description: description,
    hiringOrganization: {
      "@type": "Organization",
      name: company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: countryCode,
      },
    },
    employmentType: job.employmentType || "FULL_TIME",
    directApply: true,
    baseSalary: salary
      ? {
          "@type": "MonetaryAmount",
          currency: currency,
          value: {
            "@type": "QuantitativeValue",
            value: salary,
          },
        }
      : undefined,
    datePosted: job.date || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    validThrough:
      job.validThrough ||
      new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Head>
        <title>
          {title} at {company} ({location}) | FreshJobs
        </title>

        <meta
          name="description"
          content={`Apply for ${title} at ${company} in ${location}. Check eligibility, salary details and official apply link.`}
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} at ${company}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="FreshJobs" />

        <meta name="twitter:card" content="summary_large_image" />

        {/* Structured Data */}
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

      {/* Breadcrumb UI */}
      <div className="text-sm mb-4 text-gray-600">
        <Link href="/" prefetch={false}>Home</Link> ›{" "}
        <Link href={`/${categorySlug}`} prefetch={false}>
          {job.category || "Jobs"}
        </Link>{" "}
        › <span className="font-medium">{title}</span>
      </div>

      {/* Main Content */}
      <h1 className="text-3xl font-bold mb-2">{title}</h1>

      <p className="text-gray-700 mb-3">
        {company} • {location}
      </p>

      {salary && (
        <p className="text-green-700 font-semibold mb-4">
          Salary: {salary}
        </p>
      )}

      <div className="bg-white border rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {description}
        </p>
      </div>

      {applyLink && (
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700"
        >
          Apply on Official Website
        </a>
      )}

      {/* Internal Linking Boost */}
      <div className="mt-10 border-t pt-6">
        <h3 className="font-semibold mb-3">Explore More Jobs</h3>
        <ul className="list-disc pl-5 text-blue-700 space-y-2">
          <li><Link href="/government-jobs">Government Jobs</Link></li>
          <li><Link href="/work-from-home">Work From Home Jobs</Link></li>
          <li><Link href="/international-jobs">International Jobs</Link></li>
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
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.freshjobs.store"

    const res = await fetch(
      `${siteUrl}/api/search?slug=${params.slug}`
    )

    if (!res.ok) return { notFound: true }

    const data = await res.json()

    if (!data.job) return { notFound: true }

    return {
      props: {
        job: data.job,
        siteUrl,
      },
      revalidate: 1800,
    }
  } catch {
    return { notFound: true }
  }
}