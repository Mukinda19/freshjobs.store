import Head from "next/head";
import Link from "next/link";

/* ---------------- Helper ---------------- */
const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function JobDetailPage({ job }) {
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Head>
          <title>Job Not Found | FreshJobs</title>
        </Head>
        <h1 className="text-2xl font-bold">Job Not Found</h1>
      </div>
    );
  }

  const baseUrl = "https://freshjobs.store";

  const title = job.title || "Latest Job Opening";
  const company = job.company || "Company";
  const location = job.location || "India";
  const salary = job.salary || "";
  const description =
    job.snippet ||
    "Check eligibility, job details, and apply using the official link.";

  const canonicalSlug =
    job.slug ||
    normalizeSlug(`${job.title || ""} ${job.company || ""}`);

  const canonicalUrl = `${baseUrl}/jobs/${canonicalSlug}`;

  const categorySlug = normalizeSlug(job.category || "jobs");
  const locationSlug = normalizeSlug(location);

  const applyLink = job.url || job.link || job.applyLink || "";

  /* ================= SCHEMA ================= */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: job.category || "Jobs",
        item: `${baseUrl}/category/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

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
        addressCountry: "IN",
      },
    },
    employmentType: "FULL_TIME",
    baseSalary: salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: salary,
          },
        }
      : undefined,
    datePosted: job.date || new Date().toISOString(),
    validThrough: job.validThrough || new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    ).toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      <Head>
        <title>
          {title} at {company} in {location} | FreshJobs
        </title>

        <meta
          name="description"
          content={`Apply for ${title} at ${company} in ${location}. Check eligibility, salary, and official apply link.`}
        />

        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} at ${company}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        {/* Schema */}
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

      {/* ================= BREADCRUMB UI ================= */}
      <div className="text-sm mb-4 text-gray-600">
        <Link href="/">Home</Link> ›{" "}
        <Link href={`/category/${categorySlug}`}>
          {job.category || "Jobs"}
        </Link>{" "}
        › <span className="font-medium">{title}</span>
      </div>

      {/* ================= MAIN CONTENT ================= */}
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
    </div>
  );
}

/* ---------------- STATIC GENERATION ---------------- */

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(
      `https://freshjobs.store/api/search?limit=2000`
    );
    const data = await res.json();
    const jobs = data.jobs || [];

    const job = jobs.find((j) => {
      const jobSlug =
        j.slug ||
        normalizeSlug(`${j.title || ""} ${j.company || ""}`);
      return jobSlug === params.slug;
    });

    if (!job) {
      return { notFound: true };
    }

    return {
      props: { job },
      revalidate: 3600,
    };
  } catch {
    return { notFound: true };
  }
}