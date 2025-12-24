import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryLocationPage() {
  const router = useRouter();
  const { category, location, page = 1 } = router.query;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch jobs on category/location/page change
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

  // 🔹 Pagination handler
  const goToPage = (p) => {
    router.push(`/jobs/${category}/${location}?page=${p}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {category.replace("-", " ")} Jobs in {location.replace("-", " ")}
      </h1>

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found for this category and location.</p>
      )}

      {!loading &&
        jobs.map((job, i) => (
          <div
            key={i}
            className="border rounded p-4 mb-4 bg-white hover:shadow"
          >
            <h2 className="font-semibold text-lg">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.company} • {job.location}
            </p>

            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                Apply Now →
              </a>
            )}
          </div>
        ))}

      {/* 🔹 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex gap-2 mt-6 flex-wrap">
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