import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import JobCard from "../components/JobCard";

export default function GovtJobs({ initialJobs, totalPages }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Load more govt jobs
  const loadMore = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    const res = await fetch(
      `/api/search?category=govt-jobs&page=${nextPage}&limit=10`
    );
    const data = await res.json();

    setJobs((prev) => [...prev, ...(data.jobs || [])]);
    setPage(nextPage);
    setLoading(false);
  };

  /* ✅ BASIC JOB POSTING SCHEMA (SAFE) */
  const jobSchema = jobs.slice(0, 10).map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title || "Government Job Vacancy",
    description:
      job.description ||
      "Latest government job vacancy. Check eligibility and apply online.",
    hiringOrganization: {
      "@type": "Organization",
      name: job.source || "Government of India",
    },
    employmentType: "FULL_TIME",
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    url: job.slug
      ? `https://freshjobs.store/job/${job.slug}`
      : "https://freshjobs.store/government-jobs",
  }));

  return (
    <>
      {/* 🔹 SEO */}
      <Head>
        <title>
          Government Jobs in India | Sarkari Naukri – FreshJobs.Store
        </title>

        <meta
          name="description"
          content="Latest Government Jobs in India. Find Sarkari Naukri, PSU, Banking, Railway, Defence and State Government vacancies."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://freshjobs.store/government-jobs"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobSchema),
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 my-8">
        {/* 🔹 Breadcrumbs */}
        <nav className="text-sm mb-4 text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:underline text-blue-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">
              Government Jobs
            </li>
          </ol>
        </nav>

        {/* 🔹 Heading */}
        <h1 className="text-3xl font-bold mb-4">
          Government Jobs in India
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore latest <strong>Sarkari Naukri</strong>, PSU, Banking,
          Railway, Defence and State Government job vacancies.
          Updated daily with official links.
        </p>

        {/* 🔹 Jobs Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>

        {/* 🔹 Load More Button */}
        {page < totalPages && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Jobs"}
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/search?category=govt-jobs&page=1&limit=10`
  );

  const data = await res.json();

  return {
    props: {
      initialJobs: data.jobs || [],
      totalPages: data.totalPages || 1,
    },
  };
}