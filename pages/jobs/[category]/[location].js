import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import JobCard from "../../../components/JobCard";

export default function CategoryLocationPage() {
  const router = useRouter();
  const { category, location, page = 1, q = "" } = router.query;

  const currentPage = Number(page) || 1;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch jobs
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
        setJobs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category, location, currentPage, q]);

  // 🔹 Pagination
  const goToPage = (p) => {
    const query = q ? `?page=${p}&q=${encodeURIComponent(q)}` : `?page=${p}`;
    router.push(`/jobs/${category}/${location}${query}`);
  };

  if (!category || !location) {
    return <p className="p-4">Loading page...</p>;
  }

  const readableCategory = category.replace(/-/g, " ");
  const readableLocation = location.replace(/-/g, " ");

  // 🔹 Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://freshjobs.store/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${readableCategory} Jobs`,
        item: `https://freshjobs.store/jobs/${category}/india`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${readableCategory} Jobs in ${readableLocation}`,
        item: `https://freshjobs.store/jobs/${category}/${location}`,
      },
    ],
  };

  // 🔹 Special SEO for Work From Home
  const isWFH = category.toLowerCase() === "work-from-home";

  const pageTitle = isWFH
    ? `Work From Home Jobs in ${readableLocation} | Page ${currentPage}`
    : `${readableCategory} Jobs in ${readableLocation} | Page ${currentPage}`;

  const pageDescription = isWFH
    ? `Explore latest remote and work from home jobs in ${readableLocation}. Apply online for verified remote job openings.`
    : `Latest ${readableCategory} jobs in ${readableLocation}. Apply online for government and private vacancies.`;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* 🔹 SEO */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link
          rel="canonical"
          href={`https://freshjobs.store/jobs/${category}/${location}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      {/* 🔹 Breadcrumb UI */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/jobs/${category}/india`}
          className="hover:underline capitalize"
        >
          {readableCategory} Jobs
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium capitalize">
          {readableLocation}
        </span>
      </nav>

      {/* 🔹 Heading */}
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {isWFH
          ? `Work From Home Jobs in ${readableLocation}`
          : `${readableCategory} Jobs in ${readableLocation}`}
      </h1>

      {/* 🔹 SEO TEXT BLOCK */}
      <section className="mb-8 text-gray-700 text-sm leading-relaxed">
        {isWFH ? (
          <p>
            Find verified <strong>remote and work from home jobs in {readableLocation}</strong>.
            FreshJobs.Store helps you discover legit WFH opportunities across various industries.
          </p>
        ) : (
          <>
            <p>
              Looking for the latest <strong>{readableCategory} jobs in {readableLocation}</strong>?
              FreshJobs.Store helps job seekers find updated government and private
              job openings across India. Explore verified vacancies,
              eligibility details, and direct apply links without registration.
            </p>
            <p className="mt-3">
              Jobs listed on this page are sourced from trusted portals and official
              notifications. Whether you are a fresher or experienced candidate,
              these <strong>{readableCategory} vacancies in {readableLocation}</strong>
              can help you take the next step in your career.
            </p>
          </>
        )}
      </section>

      {/* 🔹 Jobs */}
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
        <div className="flex items-center gap-2 mt-8 flex-wrap">
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