import { useState } from "react";
import Head from "next/head";
import CategoryGrid from "../components/CategoryGrid";
import JobCard from "../components/JobCard";

export default function Home({ initialJobs, totalPages }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    const res = await fetch(`/api/search?page=${nextPage}&limit=10`);
    const data = await res.json();

    setJobs(prev => [...prev, ...data.jobs]);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>FreshJobs.Store | Find Jobs in India</title>
        <meta
          name="description"
          content="Search latest jobs in India across IT, Govt, BPO, Banking and more."
        />
      </Head>

      <section className="my-8">
        <h1 className="text-3xl font-bold mb-4">Search Jobs in India</h1>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>
        <CategoryGrid />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Jobs</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>

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
      </section>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/search?page=1&limit=10`
  );
  const data = await res.json();

  return {
    props: {
      initialJobs: data.jobs || [],
      totalPages: data.totalPages || 1,
    },
  };
}