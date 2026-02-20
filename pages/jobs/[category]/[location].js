import Head from "next/head";
import JobCard from "../../../components/JobCard";

/* ================= PAGE COMPONENT ================= */

export default function CategoryLocationPage({
  jobs,
  totalPages,
  category,
  location,
  currentPage,
}) {
  const readableCategory = String(category || "").replace(/-/g, " ");
  const readableLocation = String(location || "").replace(/-/g, " ");

  const isWFH =
    String(category || "").toLowerCase() === "work-from-home";

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {jobs.length === 0 && (
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

/* ================= STATIC GENERATION ================= */

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { category, location } = params;

  /* ✅ CATEGORY MAPPING FIX */
  const categoryMap = {
    government: "govt-jobs",
    "work-from-home": "work-from-home",
    "high-paying": "high-paying",
    international: "international",
  };

  const normalizedCategory =
    categoryMap[category?.toLowerCase()] || category;

  const normalizedLocation = location?.toLowerCase();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://www.freshjobs.store";

  try {
    const res = await fetch(
      `${baseUrl}/api/search?category=${normalizedCategory}&location=${normalizedLocation}&page=1&limit=10`
    );

    const data = await res.json();

    return {
      props: {
        jobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        category,
        location,
        currentPage: 1,
      },
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Category Location Fetch Error:", error);

    return {
      props: {
        jobs: [],
        totalPages: 1,
        category,
        location,
        currentPage: 1,
      },
      revalidate: 1800,
    };
  }
}