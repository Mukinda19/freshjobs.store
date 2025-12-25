import { useState } from "react";
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

  return (
    <main className="max-w-6xl mx-auto px-4 my-8">
      <h1 className="text-3xl font-bold mb-6">Government Jobs</h1>

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