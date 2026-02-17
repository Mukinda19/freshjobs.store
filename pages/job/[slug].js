import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";

/* ---------------- Helper ---------------- */
const normalizeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function JobDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Job ---------------- */
  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    fetch("/api/search?limit=2000")
      .then((res) => res.json())
      .then((data) => {
        const jobs = data.jobs || [];

        const foundJob = jobs.find((j) => {
          const jobSlug =
            j.slug ||
            normalizeSlug(`${j.title || ""} ${j.company || ""}`);
          return jobSlug === slug || String(j.id) === String(slug);
        });

        setJob(foundJob || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  /* ---------------- Safe Computed Values (ALL HOOKS BEFORE RETURN) ---------------- */

  const title = job?.title || "Latest Job Opening";
  const company = job?.company || "Company";
  const location = job?.location || "India";
  const salary = job?.salary || "";
  const description =
    job?.snippet ||
    "Check eligibility, job details, and apply using the official link.";

  const canonicalSlug =
    job?.slug ||
    normalizeSlug(`${job?.title || ""} ${job?.company || ""}`);

  const canonicalUrl = `https://freshjobs.store/job/${canonicalSlug}`;

  const categorySlug = normalizeSlug(job?.category || "jobs");

  const readableCategory = useMemo(() => {
    return categorySlug.replace(/-/g, " ");
  }, [categorySlug]);

  const locationSlug = normalizeSlug(location) || "india";
  const applyLink = job?.url || job?.link || job?.applyLink || "";

  /* ---------------- Breadcrumb Schema ---------------- */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://freshjobs.store/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${readableCategory} Jobs`,
        item: `https://freshjobs.store/jobs/${categorySlug}/india`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  /* ---------------- RETURNS AFTER ALL HOOKS ---------------- */

  if (loading) {
    return <p className="p-4">Loading job details...</p>;
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Head>
          <title>Job Not Found | FreshJobs.Store</title>
          <meta
            name="description"
            content="The job you are looking for is no longer available. Browse latest jobs on FreshJobs.Store."
          />
          <link rel="canonical" href="https://freshjobs.store/" />
        </Head>

        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-gray-600">
          This job listing may have expired. Please browse other latest jobs.
        </p>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Head>
        <title>
          {title} at {company} | Jobs in {location}
        </title>

        <meta
          name="description"
          content={`Apply for ${title} job at ${company} in ${location}. Check eligibility, salary, and official apply link.`}
        />

        <link rel="canonical" href={canonicalUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <nav className="text-sm mb-4 text-gray-600 overflow-x-auto whitespace-nowrap">
        <a href="/" className="hover:underline text-blue-600">
          Home
        </a>{" "}
        /{" "}
        <a
          href={`/jobs/${categorySlug}/india`}
          className="hover:underline text-blue-600 capitalize"
        >
          {readableCategory} Jobs
        </a>{" "}
        / <span className="text-gray-800 font-medium">{title}</span>
      </nav>

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

      <div className="mt-10 border-t pt-6">
        <h3 className="font-semibold mb-3 text-lg">
          Explore More Jobs
        </h3>

        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>
            <a
              href={`/jobs/${categorySlug}/india`}
              className="hover:underline"
            >
              More {readableCategory} Jobs in India
            </a>
          </li>

          <li>
            <a
              href={`/jobs/${categorySlug}/${locationSlug}`}
              className="hover:underline"
            >
              More Jobs in {location}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}