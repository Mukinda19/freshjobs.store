import Head from "next/head";

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
          <title>Job Not Found | FreshJobs.Store</title>
        </Head>
        <h1 className="text-2xl font-bold">Job Not Found</h1>
      </div>
    );
  }

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

  const canonicalUrl = `https://freshjobs.store/job/${canonicalSlug}`;

  const applyLink = job.url || job.link || job.applyLink || "";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Head>
        <title>
          {title} at {company} | Jobs in {location}
        </title>
        <meta
          name="description"
          content={`Apply for ${title} job at ${company} in ${location}.`}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

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
    paths: [], // 👈 pre-build me kuch generate nahi karega
    fallback: "blocking", // first visit pe generate karega
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
  } catch (error) {
    return { notFound: true };
  }
}