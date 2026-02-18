import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
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

  /* ---------------- SAFE COMPUTED VALUES (ALL HOOKS FIRST) ---------------- */

  const readableCategory = useMemo(
    () => String(category || "").replace(/-/g, " "),
    [category]
  );

  const readableLocation = useMemo(
    () => String(location || "").replace(/-/g, " "),
    [location]
  );

  const isWFH =
    String(category || "").toLowerCase() === "work-from-home";

  /* ---------------- Fetch Jobs ---------------- */
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
      } catch {
        setJobs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category, location, currentPage, q]);

  /* ---------------- Pagination ---------------- */
  const goToPage = (p) => {
    const query = q
      ? `?page=${p}&q=${encodeURIComponent(q)}`
      : `?page=${p}`;
    router.push(`/jobs/${category}/${location}${query}`);
  };

  /* ---------------- SEO SAFE VALUES ---------------- */

  const pageTitle =
    (isWFH
      ? `Work From Home Jobs in ${readableLocation}`
      : `${readableCategory} Jobs in ${readableLocation}`) +
    (currentPage > 1 ? ` | Page ${currentPage}` : "");

  const pageDescription = isWFH
    ? `Explore latest verified remote and work from home jobs in ${readableLocation}. Apply online for genuine WFH opportunities.`
    : `Latest ${readableCategory} jobs in ${readableLocation}. Apply online for government and private vacancies with official links.`;

  const canonicalUrl =
    currentPage > 1
      ? `https://www.freshjobs.store/jobs/${category}/${location}?page=${currentPage}`
      : `https://www.freshjobs.store/jobs/${category}/${location}`;

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
        name: `${readableCategory} Jobs`,
        item: `https://www.freshjobs.store/jobs/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${readableCategory} Jobs in ${readableLocation}`,
        item: canonicalUrl,
      },
    ],
  };

  /* ---------------- CONDITIONAL RETURN AFTER HOOKS ---------------- */

  if (!category || !location) {
    return <p className="p-4">Loading page...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
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

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found for this category and location.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={job.id || index} job={job} />
        ))}
      </div>
    </div>
  );
}