import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import JobCard from "../../../components/JobCard";

export default function CategoryLocationPage() {
  const router = useRouter();
  const { category, location, page = 1, q = "" } = router.query;

  const currentPage = Number(page) || 1;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch jobs based on category, location & keyword
  useEffect(() => {
    if (!category || !location) return;

    setLoading(true);

    const fetchJobs = async () => {
      const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

      try {
        const res = await fetch(
          `/api/search?category=${category}&location=${location}${qParam}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category, location, currentPage, q]);

  // 🔹 Page change
  const goToPage = (p) => {
    const query = q ? `?page=${p}&q=${encodeURIComponent(q)}` : `?page=${p}`;
    router.push(`/jobs/${category}/${location}${query}`);
  };

  if (!category || !location) {
    return <p className="p-4">Loading page...</p>;
  }

  const readableCategory = category.replace(/-/g, " ");
  const readableLocation = location.replace(/-/g, " ");

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* 🔹 SEO */}
      <Head>
        <title>
          {readableCategory} Jobs in {readableLocation} | Page {currentPage}
        </title>
        <meta
          name="description"
          content={`Apply for latest ${readableCategory} jobs in ${readableLocation}. Page ${currentPage} job listings.`}
        />
        <link
          rel="canonical"
          href={`https://freshjobs.store/jobs/${category}/${location}?page=${currentPage}`}
        />
      </Head>

      {/* 🔹 Heading */}
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {readableCategory} Jobs in {readableLocation}
      </h1>

      {/* 🔹 Loading */}
      {loading && <p>Loading jobs...</p>}

      {/* 🔹 No jobs */}
      {!loading && jobs.length === 0 && (
        <p>No jobs found for this category and location.</p>
      )}

      {/* 🔹 Jobs Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={job.id || index} job={job} />
        ))}
      </div>

      {/* 🔹 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center gap-2 mt-8 flex-wrap">
          {currentPage > 1 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded"
            >
              Previous
            </button>
          )}

          {Array.from({ length: totalPages })
            .slice(Math.max(currentPage - 3, 0), currentPage + 2)
            .map((_, i) => {
              const pageNumber = Math.max(currentPage - 2, 1) + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === pageNumber
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

          {currentPage < totalPages && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}