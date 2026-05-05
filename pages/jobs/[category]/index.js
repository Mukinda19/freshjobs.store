import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import JobCard from "../../../components/JobCard";
import Breadcrumb from "../../../components/Breadcrumb";

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

  const readableCategory = category ? category.replace(/-/g, " ") : "";

  /* -------- SEO CONTENT MAP (PROFESSIONAL ENGLISH) -------- */

  const seoContent = {
    "it": {
      title: "Latest IT Jobs in India",
      content: "The IT sector in India is one of the fastest-growing industries, offering roles such as software developer, web developer, frontend and backend developer, full stack engineer, and IT support specialist. Companies actively seek candidates skilled in technologies like React, Node.js, Python, Java, and cloud platforms. Both freshers and experienced professionals can find excellent career opportunities with high growth potential."
    },
    "banking": {
      title: "Latest Banking Jobs in India",
      content: "Banking jobs in India include roles such as Probationary Officer (PO), Clerk, Relationship Manager, and Financial Analyst. Opportunities are available in both government and private sector banks. These roles offer stable career growth, competitive salaries, and long-term job security."
    },
    "bpo": {
      title: "Latest BPO Jobs in India",
      content: "BPO jobs include roles in customer support, call centers, voice and non-voice processes, and back-office operations. These jobs are ideal for freshers looking to start their careers, with a strong focus on communication skills and customer handling."
    },
    "govt-jobs": {
      title: "Latest Government Jobs in India",
      content: "Government jobs in India are considered one of the most secure career options. Opportunities are available through SSC, UPSC, रेलवे, defence services, and public sector undertakings (PSUs). These jobs offer stability, benefits, and long-term growth."
    },
    "sales": {
      title: "Latest Sales Jobs in India",
      content: "Sales jobs include roles such as Sales Executive, Business Development Executive, and Marketing Specialist. These positions offer high earning potential through incentives and commissions, along with strong career growth opportunities."
    },
    "engineering": {
      title: "Latest Engineering Jobs in India",
      content: "Engineering jobs cover multiple domains such as mechanical, civil, electrical, and production engineering. These roles are in high demand across industries like manufacturing, construction, and infrastructure development."
    },
    "work-from-home": {
      title: "Latest Work From Home Jobs",
      content: "Work from home jobs provide flexible remote opportunities in areas such as freelancing, customer support, virtual assistance, and online services. These roles allow professionals to work with companies globally while maintaining work-life balance."
    },
    "ai-jobs": {
      title: "Latest AI Jobs",
      content: "Artificial Intelligence jobs are among the fastest-growing career opportunities, including roles such as Machine Learning Engineer, Data Scientist, and AI Developer. Skills in Python, data analysis, and AI frameworks are highly in demand."
    }
  };

  const currentSEO = seoContent[category] || null;

  /* -------- Breadcrumb -------- */

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: `${readableCategory} Jobs`, href: `/jobs/${category}` }
  ];

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

  const pageTitle =
    `${readableCategory} Jobs` +
    (!isSpecialCategory ? " in India" : "") +
    (currentPage > 1 ? ` | Page ${currentPage}` : "") +
    " | FreshJobs";

  const pageDescription = isSpecialCategory
    ? `Browse latest ${readableCategory} jobs from global companies.`
    : `Find latest ${readableCategory} jobs in India. Apply online easily.`;

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
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Breadcrumb items={breadcrumbItems} />

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

      {/* ✅ SEO CONTENT */}
      {currentSEO && (
        <div className="mt-10 bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {currentSEO.title}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {currentSEO.content}
          </p>
        </div>
      )}

      {!loading && totalPages > 1 && (

        <div className="flex gap-2 mt-8 flex-wrap items-center">

          {currentPage > 1 && (
            <button onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100">
              Previous
            </button>
          )}

          <span className="px-3 py-1 border rounded bg-gray-50">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <button onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100">
              Next
            </button>
          )}

        </div>

      )}

    </div>

  );

}