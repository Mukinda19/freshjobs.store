import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import JobCard from "../../../components/JobCard";

export default function CategoryPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- Router Safe Values ---------------- */
  const isReady = router.isReady;

  const category = useMemo(() => {
    if (!isReady) return null;
    return String(router.query.category || "").toLowerCase();
  }, [router.query.category, isReady]);

  const currentPage = useMemo(() => {
    if (!isReady) return 1;
    return Number(router.query.page) || 1;
  }, [router.query.page, isReady]);

  /* ---------------- Fetch Jobs (FINAL FIX) ---------------- */
  useEffect(() => {
    if (!isReady || !category) return;

    let ignore = false;

    const fetchJobs = async () => {
      try {
        setLoading(true);

        // 🔥 cache bust parameter added
        const res = await fetch(
          `/api/search?category=${encodeURIComponent(
            category
          )}&page=${currentPage}&limit=10&_=${Date.now()}`
        );

        const data = await res.json();

        if (!ignore) {
          setJobs(Array.isArray(data.jobs) ? data.jobs : []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        if (!ignore) {
          setJobs([]);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      ignore = true;
    };
  }, [category, currentPage, isReady]);

  /* ---------------- Loading Guard ---------------- */
  if (!isReady || !category) {
    return <p className="p-4">Loading...</p>;
  }

  /* ---------------- SEO Values ---------------- */
  const readableCategory = category.replace(/-/g, " ");

  const pageTitle =
    `${readableCategory} Jobs in India` +
    (currentPage > 1 ? ` | Page ${currentPage}` : "");

  const pageDescription = `Find latest ${readableCategory} jobs in India. Apply online for verified private and government job openings with official application links.`;

  const canonicalUrl = `https://www.freshjobs.store/jobs/${category}`;

  /* ---------------- Pagination ---------------- */
  const goToPage = (p) => {
    router.push({
      pathname: `/jobs/${category}`,
      query: { page: p },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <h1 className="text-2xl font-bold mb-6 capitalize">
        {readableCategory} Jobs in India
      </h1>

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found in this category.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={job.slug || job.id || index} job={job} />
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex gap-2 mt-8">
          {currentPage > 1 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded"
            >
              Previous
            </button>
          )}

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