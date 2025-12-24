import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import JobCard from "../../../components/JobCard";

export default function CategoryLocationPage() {
  const router = useRouter();
  const { category, location, page = 1 } = router.query;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch jobs
  useEffect(() => {
    if (!category || !location) return;

    setLoading(true);

    fetch(
      `/api/search?category=${category}&location=${location}&page=${page}&limit=10`
    )
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, location, page]);

  // 🔹 Page change
  const goToPage = (p) => {
    router.push(`/jobs/${category}/${location}?page=${p}`);
  };

  // 🔹 SAFETY GUARD (🔥 MOST IMPORTANT)
  if (!category || !location) {
    return <p className="p-4">Loading page...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category.replace(/-/g, " ")} Jobs in {location.replace(/-/g, " ")}
      </h1>

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found for this category and location.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={job.id || index} job={job} />
        ))}
      </div>

      {/* 🔹 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex gap-2 mt-8 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                Number(page) === i + 1
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}