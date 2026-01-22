import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import JobCard from "../../../components/JobCard";

export default function CategoryPage() {
  const router = useRouter();
  const { category, page = 1 } = router.query;

  const currentPage = Number(page) || 1;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- Fetch Jobs ---------------- */
  useEffect(() => {
    if (!category) return;

    setLoading(true);

    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `/api/search?category=${category}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        setJobs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category, currentPage]);

  if (!category) {
    return <p className="p-4">Loading...</p>;
  }

  /* ---------------- SEO SAFE VALUES ---------------- */
  const readableCategory = useMemo(
    () => String(category).replace(/-/g, " "),
    [category]
  );

  const pageTitle =
    `${readableCategory} Jobs in India` +
    (currentPage > 1 ? ` | Page ${currentPage}` : "");

  const pageDescription = `Find latest ${readableCategory} jobs in India. Apply online for verified private and government job openings with official application links.`;

  // 🔥 IMPORTANT: pagination canonical fix
  const canonicalUrl = `https://www.freshjobs.store/jobs/${category}`;

  /* ---------------- Breadcrumb Schema ---------------- */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.freshjobs.store/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jobs",
        item: "https://www.freshjobs.store/jobs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${readableCategory} Jobs`,
        item: canonicalUrl,
      },
    ],
  };

  /* ---------------- Pagination ---------------- */
  const goToPage = (p) => {
    router.push(`/jobs/${category}?page=${p}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* ---------------- SEO ---------------- */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      {/* ---------------- Breadcrumb UI ---------------- */}
      <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link href="/jobs" className="hover:underline">
          Jobs
        </Link>
        <span className="mx-2">›</span>
        <span className="capitalize font-medium text-gray-900">
          {readableCategory} Jobs
        </span>
      </nav>

      {/* ---------------- Heading ---------------- */}
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {readableCategory} Jobs in India
      </h1>

      {/* ---------------- SEO CONTENT (STRONG) ---------------- */}
      <section className="mb-10 text-gray-700 text-sm leading-relaxed">
        <p>
          Looking for the latest <strong>{readableCategory} jobs in India</strong>?
          FreshJobs.Store helps job seekers find verified openings from trusted
          private companies and government sources.
        </p>

        <p className="mt-3">
          This category includes opportunities suitable for freshers as well as
          experienced professionals. All job listings are regularly updated and
          include official application links to ensure safety and authenticity.
        </p>

        <p className="mt-3">
          Whether you are searching for full-time, part-time, or entry-level
          roles, these {readableCategory} job vacancies are available across
          multiple locations in India.
        </p>
      </section>

      {/* ---------------- Jobs ---------------- */}
      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found in this category.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={job.id || index} job={job} />
        ))}
      </div>

      {/* ---------------- Pagination ---------------- */}
      {!loading && totalPages > 1 && (
        <div className="flex gap-2 mt-8 flex-wrap">
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

      {/* ---------------- INTERNAL LINKS ---------------- */}
      <section className="mt-16 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">
          Explore More Job Categories
        </h2>

        <ul className="grid md:grid-cols-2 gap-3 text-blue-700 text-sm">
          <li><Link href="/jobs/it-jobs">IT Jobs in India</Link></li>
          <li><Link href="/jobs/banking-jobs">Banking Jobs in India</Link></li>
          <li><Link href="/jobs/bpo-jobs">BPO Jobs in India</Link></li>
          <li><Link href="/jobs/sales-jobs">Sales Jobs in India</Link></li>
          <li><Link href="/jobs/engineering-jobs">Engineering Jobs in India</Link></li>
          <li><Link href="/work-from-home">Work From Home Jobs</Link></li>
          <li><Link href="/government-jobs">Government Jobs</Link></li>
          <li><Link href="/international-jobs">International Jobs</Link></li>
        </ul>
      </section>
    </div>
  );
}