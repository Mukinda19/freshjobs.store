import { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import JobCard from "../components/JobCard";
import dbConnect from "../lib/dbConnect";
import Job from "../models/Job";

export default function GovtJobs({ initialJobs, totalPages }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(
        `/api/search?category=govt-jobs&page=${nextPage}&limit=10`
      );
      const data = await res.json();
      setJobs((prev) => [...prev, ...(data.jobs || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Load More Error:", error);
    }

    setLoading(false);
  }, [loading, page, totalPages]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialJobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      url: `https://www.freshjobs.store/jobs/${job.slug}`,
    })),
  };

  return (
    <>
      <Head>
        <title>
          Latest Government Jobs 2026 | Sarkari Naukri Updates India
        </title>

        <meta
          name="description"
          content="Latest Government Jobs 2026 in India. Daily updated Sarkari Naukri for Banking, Railway, Defence, PSU and State Govt vacancies with official apply links."
        />

        <link
          rel="canonical"
          href="https://www.freshjobs.store/government-jobs"
        />

        <meta name="robots" content="index, follow" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 my-8">
        <nav className="text-sm mb-4 text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">
              Government Jobs
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold mb-4">
          Government Jobs in India 2026 – Latest Sarkari Naukri
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find latest Sarkari Naukri updates including Railway, Banking,
          Defence, PSU and State Government job vacancies. All listings are
          verified and updated daily with official apply links.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {page < totalPages && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Loading..." : "Load More Jobs"}
            </button>
          </div>
        )}
      </main>
    </>
  );
}

/* 🚀 ULTRA FAST ISR (Production Optimized) */
export async function getStaticProps() {
  try {
    await dbConnect();

    const limit = 10;

    const totalJobs = await Job.countDocuments({
      category: "govt-jobs",
    });

    const jobs = await Job.find({
      category: "govt-jobs",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      props: {
        initialJobs: JSON.parse(JSON.stringify(jobs)),
        totalPages: Math.ceil(totalJobs / limit),
      },
      revalidate: 300, // 5 minutes
    };
  } catch (error) {
    console.error("Government Jobs Fetch Error:", error);

    return {
      props: {
        initialJobs: [],
        totalPages: 1,
      },
      revalidate: 300,
    };
  }
}