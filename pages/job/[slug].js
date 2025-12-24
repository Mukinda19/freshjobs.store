import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function JobDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    fetch("/api/search?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        const jobs = data.jobs || [];

        const foundJob = jobs.find(
          (j) =>
            j.id === slug ||
            j.title?.toLowerCase().replace(/\s+/g, "-") === slug
        );

        setJob(foundJob || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-4">Loading job details...</p>;

  if (!job) return <p className="p-4">Job not found.</p>;

  const jobTitleSlug = job.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Head>
        <title>{job.title} Job | FreshJobs.Store</title>
        <meta
          name="description"
          content={`Apply for ${job.title} job at ${job.company}. Location: ${job.location}`}
        />
        <link
          rel="canonical"
          href={`https://freshjobs.store/job/${jobTitleSlug}`}
        />
      </Head>

      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-4">
        {job.company} • {job.location}
      </p>

      {job.salary && (
        <p className="text-green-600 font-semibold mb-4">
          Salary: {job.salary}
        </p>
      )}

      <div className="bg-white border rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {job.snippet || "No description provided."}
        </p>
      </div>

      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Apply Now
        </a>
      )}
    </div>
  );
}