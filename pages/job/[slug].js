import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

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

const slugToTitle = (slug = "") =>
  String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

/* ---------------- Page ---------------- */

export default function JobDetailPage({ job, siteUrl, relatedJobs = [] }) {
  const [similarJobs, setSimilarJobs] = useState([])

  useEffect(() => {
    if (!job?.category) return

    fetch(`/api/search?category=${job.category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) {
          const filtered = data.jobs
            .filter((j) => j.slug !== job.slug)
            .slice(0, 5)

          setSimilarJobs(filtered)
        }
      })
  }, [job])

  /* ---------------- EXPIRED PAGE ---------------- */

  if (!job) {
    const currentSlug =
      typeof window !== "undefined"
        ? window.location.pathname.split("/job/")[1] || ""
        : ""

    const readableTitle = slugToTitle(currentSlug)

    return (
      <div className="max-w-4xl mx-auto p-6">

        <Head>
          <title>{readableTitle || "Job Expired"} | FreshJobs</title>

          <meta
            name="description"
            content="This job has expired. Browse latest live jobs, government jobs, private jobs and work from home jobs."
          />

          <meta name="robots" content="index, follow" />

          <link
            rel="canonical"
            href={`${siteUrl}/job/${currentSlug}`}
          />
        </Head>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-8">
          <p className="text-sm font-semibold text-red-600 mb-2">
            This job has expired.
          </p>

          <h1 className="text-3xl font-bold mb-4">
            {readableTitle || "Previously Listed Job"}
          </h1>

          <div className="space-y-2 text-gray-700">
            <p><strong>Company Name:</strong> Not Available</p>
            <p><strong>Location:</strong> India</p>
            <p><strong>Last Apply Date:</strong> Closed</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Related Live Jobs</h2>

          <div className="grid gap-3">
            <Link href="/" className="block border p-3 rounded">Latest Jobs</Link>
            <Link href="/private-jobs" className="block border p-3 rounded">Private Jobs</Link>
            <Link href="/government-jobs" className="block border p-3 rounded">Government Jobs</Link>
          </div>
        </div>

      </div>
    )
  }

  /* ---------------- LIVE JOB PAGE ---------------- */

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

  const cleanSlug = canonicalSlug.replace(/\/$/, "")

  const canonicalUrl = `${siteUrl}/job/${cleanSlug}`

  const applyLink = job.link || job.applyLink || ""

  const salaryNumber = extractSalaryNumber(salary)

  /* 🔥 FINAL OPTIMIZED SCHEMA */

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",

    title,
    description,

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

    ...(job.category === "work-from-home" && {
      jobLocationType: "TELECOMMUTE",
    }),

    directApply: true,

    url: canonicalUrl,
  }

  return (
    <div className="max-w-4xl mx-auto p-4">

      <Head>
        <title>{title} at {company} ({location}) | FreshJobs</title>

        <meta
          name="description"
          content={`Apply for ${title} job at ${company} in ${location}.`}
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={canonicalUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingSchema),
          }}
        />
      </Head>

      <h1 className="text-2xl font-bold mb-2">{title}</h1>

      <p className="text-gray-700 mb-3">
        {company} • {location}
      </p>

      {salary && (
        <p className="text-green-700 font-semibold mb-4">
          💰 Salary: {salary}
        </p>
      )}

      <div className="bg-white border rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3 text-lg">Job Description</h2>

        <p className="text-gray-700 whitespace-pre-line">
          {description}
        </p>
      </div>

      {applyLink && (
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Apply →
        </a>
      )}

    </div>
  )
}

/* ---------------- SERVER ---------------- */

export async function getServerSideProps({ params }) {
  const slug = params.slug

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.freshjobs.store"

  try {
    const res = await fetch(`${siteUrl}/api/search?slug=${slug}`)
    const data = await res.json()

    return {
      props: {
        job: data.job || null,
        relatedJobs: data.relatedJobs || [],
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