import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import JobCard from "../../../components/JobCard";

/* ================= PAGE COMPONENT ================= */

export default function CategoryLocationPage({
  jobs,
  totalPages,
  category,
  location,
  currentPage,
}) {
  const router = useRouter();

  const readableCategory = String(category || "").replace(/-/g, " ");
  const readableLocation = String(location || "").replace(/-/g, " ");

  const isWFH =
    String(category || "").toLowerCase() === "work-from-home";

  const baseUrl = "https://www.freshjobs.store";

  const pageTitle =
    (isWFH
      ? `Work From Home Jobs in ${readableLocation}`
      : `${readableCategory} Jobs in ${readableLocation}`) +
    (currentPage > 1 ? ` | Page ${currentPage}` : "") +
    " | FreshJobs";

  const pageDescription = isWFH
    ? `Find latest verified work from home jobs in ${readableLocation}. Apply online for remote and genuine WFH job opportunities.`
    : `Latest ${readableCategory} jobs in ${readableLocation}. Browse verified government and private job vacancies and apply online.`;

  const canonicalUrl =
    currentPage > 1
      ? `${baseUrl}/category/${category}/${location}?page=${currentPage}`
      : `${baseUrl}/category/${category}/${location}`;

  const prevUrl =
    currentPage > 1
      ? `${baseUrl}/category/${category}/${location}?page=${currentPage - 1}`
      : null;

  const nextUrl =
    currentPage < totalPages
      ? `${baseUrl}/category/${category}/${location}?page=${currentPage + 1}`
      : null;

  const goToPage = (page) => {
    router.push(`/category/${category}/${location}?page=${page}`);
  };

  /* ================= SCHEMA ================= */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: readableCategory + " Jobs",
        item: `${baseUrl}/category/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: readableLocation,
        item: canonicalUrl,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/jobs/${job.slug || job.id}`,
      name: job.title,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* ================= SEO ================= */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />
      </Head>

      {/* ================= BREADCRUMB UI ================= */}
      <div className="text-sm mb-4 text-gray-600">
        <Link href="/">Home</Link> ›{" "}
        <Link href={`/category/${category}`}>
          {readableCategory}
        </Link>{" "}
        › <span className="font-medium">{readableLocation}</span>
      </div>

      {/* ================= HEADING ================= */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        {isWFH
          ? `Work From Home Jobs in ${readableLocation}`
          : `${readableCategory} Jobs in ${readableLocation}`}
      </h1>

      {/* ================= SEO PARAGRAPH ================= */}
      <p className="text-gray-600 mb-6">
        Explore latest {readableCategory} job openings in{" "}
        {readableLocation}. Find verified job listings with official
        application links. Updated daily with fresh opportunities.
      </p>

      {/* ================= JOB LIST ================= */}
      {jobs.length === 0 ? (
        <p>No jobs found for this category and location.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          {currentPage > 1 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              ← Previous
            </button>
          )}

          <span>
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= STATIC GENERATION ================= */

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params, query }) {
  const { category, location } = params;
  const currentPage = parseInt(query?.page || "1");

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
      `${baseUrl}/api/search?category=${normalizedCategory}&location=${normalizedLocation}&page=${currentPage}&limit=10`
    );

    const data = await res.json();

    return {
      props: {
        jobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        category,
        location,
        currentPage,
      },
      revalidate: 1800,
    };
  } catch {
    return {
      props: {
        jobs: [],
        totalPages: 1,
        category,
        location,
        currentPage,
      },
      revalidate: 1800,
    };
  }
}