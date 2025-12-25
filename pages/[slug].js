import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import JobCard from "../components/JobCard";
import { parseSeoSlug } from "../utils/seoSlug";

export default function SeoJobsPage() {
  const router = useRouter();
  const { slug, page = 1 } = router.query;

  const currentPage = Number(page) || 1;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  if (!slug) return null;

  const { category, location } = parseSeoSlug(slug);

  if (!category || !location) {
    return <p className="p-4">Invalid page</p>;
  }

  useEffect(() => {
    setLoading(true);

    fetch(
      `/api/search?category=${category}&location=${location}&page=${currentPage}&limit=10`
    )
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, location, currentPage]);

  const readableCategory = category.replace(/-/g, " ");
  const readableLocation = location.replace(/-/g, " ");

  const goToPage = (p) => {
    router.push(`/${slug}?page=${p}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Head>
        <title>
          {readableCategory} Jobs in {readableLocation} | Page {currentPage}
        </title>
        <meta
          name="description"
          content={`Apply latest ${readableCategory} jobs in ${readableLocation}. Page ${currentPage}`}
        />
      </Head>

      <h1 className="text-2xl font-bold mb-6 capitalize">
        {readableCategory} Jobs in {readableLocation}
      </h1>

      {loading && <p>Loading jobs...</p>}
      {!loading && jobs.length === 0 && <p>No jobs found.</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, i) => (
          <JobCard key={job.id || i} job={job} />
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex gap-2 mt-8 flex-wrap">
          {currentPage > 1 && (
            <button onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded">
              Previous
            </button>
          )}

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNo = i + 1;
            return (
              <button
                key={pageNo}
                onClick={() => goToPage(pageNo)}
                className={`px-3 py-1 border rounded ${
                  pageNo === currentPage ? "bg-black text-white" : ""
                }`}
              >
                {pageNo}
              </button>
            );
          })}

          {currentPage < totalPages && (
            <button onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded">
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}