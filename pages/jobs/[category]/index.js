import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import JobCard from "../../../components/JobCard";

export default function CategoryPage() {

  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const isReady = router.isReady;

  const category = useMemo(() => {
    if (!isReady) return null;
    return String(router.query.category || "")
      .toLowerCase()
      .trim();
  }, [router.query.category, isReady]);

  const currentPage = useMemo(() => {
    if (!isReady) return 1;
    return Math.max(parseInt(router.query.page) || 1, 1);
  }, [router.query.page, isReady]);

  const specialCategories = ["work-from-home", "ai-jobs"];

  const isSpecialCategory = useMemo(() => {
    if (!category) return false;
    return specialCategories.includes(category);
  }, [category]);

  useEffect(() => {

    if (!isReady || !category) return;

    let ignore = false;

    const fetchJobs = async () => {

      try {

        setLoading(true);

        let url =
          `/api/search?category=${encodeURIComponent(category)}&page=${currentPage}&limit=10&_=${Date.now()}`;

        if (!isSpecialCategory) {
          url =
            `/api/search?category=${encodeURIComponent(category)}&location=india&page=${currentPage}&limit=10&_=${Date.now()}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!ignore) {

          setJobs(Array.isArray(data.jobs) ? data.jobs : []);
          setTotalPages(Number(data.totalPages) || 1);

        }

      } catch {

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

  }, [category, currentPage, isReady, isSpecialCategory]);

  if (!isReady || !category) {
    return <p className="p-4">Loading...</p>;
  }

  const readableCategory = category.replace(/-/g, " ");

  const pageTitle =
    `${readableCategory} Jobs` +
    (!isSpecialCategory ? " in India" : "") +
    (currentPage > 1 ? ` | Page ${currentPage}` : "") +
    " | FreshJobs";

  const pageDescription = isSpecialCategory
    ? `Browse latest ${readableCategory} jobs from global companies. Updated daily with verified remote opportunities.`
    : `Find latest ${readableCategory} jobs in India. Apply online for verified private and government job openings with official application links.`;

  const canonicalUrl =
    currentPage > 1
      ? `https://www.freshjobs.store/jobs/${category}?page=${currentPage}`
      : `https://www.freshjobs.store/jobs/${category}`;

  const goToPage = (p) => {

    if (p < 1 || p > totalPages) return;

    router.push(
      {
        pathname: `/jobs/${category}`,
        query: { page: p }
      },
      undefined,
      { shallow: true }
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
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
        {readableCategory} Jobs {!isSpecialCategory && "in India"}
      </h1>

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found in this category.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">

        {jobs.map((job, index) => (
          <JobCard
            key={job.slug || job.id || index}
            job={job}
          />
        ))}

      </div>

      {!loading && totalPages > 1 && (

        <div className="flex gap-2 mt-8 flex-wrap items-center">

          {currentPage > 1 && (

            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Previous
            </button>

          )}

          <span className="px-3 py-1 border rounded bg-gray-50">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (

            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </button>

          )}

        </div>

      )}

    </div>

  );

}