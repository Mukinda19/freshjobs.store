import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import JobCard from "../../../components/JobCard";

export default function CategoryLocationPage({
  jobs,
  totalPages,
  category,
  location,
  currentPage,
}) {

  const router = useRouter();

  const readableCategory = decodeURIComponent(String(category || "")).replace(/-/g, " ");
  const readableLocation = decodeURIComponent(String(location || "")).replace(/-/g, " ");

  const normalizedCategory = String(category || "").toLowerCase().trim();

  const ignoreLocationCategories = ["work-from-home", "ai-jobs"];

  const ignoreLocation = ignoreLocationCategories.includes(normalizedCategory);

  const baseUrl = "https://www.freshjobs.store";

  const pageTitle =
    (ignoreLocation
      ? `${readableCategory} Jobs`
      : `${readableCategory} Jobs in ${readableLocation}`) +
    (currentPage > 1 ? ` | Page ${currentPage}` : "") +
    " | FreshJobs";

  const pageDescription = ignoreLocation
    ? `Find latest ${readableCategory} jobs updated daily with verified application links.`
    : `Find the latest ${readableCategory} jobs in ${readableLocation}. FreshJobs collects verified job openings from trusted sources and updates listings daily to help job seekers discover new opportunities quickly.`;

  const canonicalUrl =
    currentPage > 1
      ? `${baseUrl}/jobs/${category}/${location}?page=${currentPage}`
      : `${baseUrl}/jobs/${category}/${location}`;

  const prevUrl =
    currentPage > 1
      ? `${baseUrl}/jobs/${category}/${location}?page=${currentPage - 1}`
      : null;

  const nextUrl =
    currentPage < totalPages
      ? `${baseUrl}/jobs/${category}/${location}?page=${currentPage + 1}`
      : null;

  const goToPage = (page) => {
    router.push({
      pathname: `/jobs/${category}/${location}`,
      query: { page },
    });
  };

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
        name: `${readableCategory} Jobs`,
        item: `${baseUrl}/jobs/${category}`,
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
      url: `${baseUrl}/job/${job.slug}`,
      name: job.title,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto p-4">

      <Head>

        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        <link rel="canonical" href={canonicalUrl} />
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}

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

      <div className="text-sm mb-4 text-gray-600">

        <Link href="/">Home</Link> ›{" "}

        <Link href={`/jobs/${category}`}>
          {readableCategory}
        </Link>{" "}

        › <span className="font-medium">{readableLocation}</span>

      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">

        {ignoreLocation
          ? `${readableCategory} Jobs`
          : `${readableCategory} Jobs in ${readableLocation}`}

      </h1>

      {/* SEO Intro Content */}

      <p className="text-gray-600 mb-6">

        {ignoreLocation
          ? `Browse the latest ${readableCategory} opportunities on FreshJobs. Our platform gathers verified job listings from trusted sources and updates them regularly so job seekers can find new opportunities quickly.`
          : `Looking for the latest ${readableCategory} jobs in ${readableLocation}? FreshJobs brings you updated job openings collected from multiple trusted sources. Browse verified listings, explore new career opportunities and apply directly through official job links. New ${readableCategory} jobs in ${readableLocation} are added regularly to help job seekers find the best opportunities.`}

      </p>

      {/* 🔥 INTERNAL LINKING BOOST */}

      <div className="mb-8">

        <h2 className="text-lg font-semibold mb-3">
          Popular Searches
        </h2>

        <div className="flex flex-wrap gap-3 text-sm">

          <Link href="/jobs/title/software-developer" className="text-blue-600 hover:underline">Software Developer Jobs</Link>
          <Link href="/jobs/title/java-developer" className="text-blue-600 hover:underline">Java Developer Jobs</Link>
          <Link href="/jobs/title/python-developer" className="text-blue-600 hover:underline">Python Developer Jobs</Link>
          <Link href="/jobs/title/web-developer" className="text-blue-600 hover:underline">Web Developer Jobs</Link>

          <Link href="/jobs/title/data-entry" className="text-blue-600 hover:underline">Data Entry Jobs</Link>
          <Link href="/jobs/title/work-from-home" className="text-blue-600 hover:underline">Work From Home Jobs</Link>
          <Link href="/jobs/title/digital-marketing" className="text-blue-600 hover:underline">Digital Marketing Jobs</Link>
          <Link href="/jobs/title/accountant" className="text-blue-600 hover:underline">Accountant Jobs</Link>

        </div>

      </div>

      {jobs.length === 0 ? (
        <p>No jobs found for this category and location.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>
      )}

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

          <span className="text-sm">
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
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {

  const { params, query } = context;

  const { category, location } = params;

  const page = Number(query?.page || 1);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.freshjobs.store";

  try {

    const res = await fetch(
      `${baseUrl}/api/search?category=${category}&location=${location}&page=${page}&limit=10`
    );

    const data = await res.json();

    return {
      props: {
        jobs: data.jobs || [],
        totalPages: data.totalPages || 1,
        category,
        location,
        currentPage: page,
      },
      revalidate: 900,
    };

  } catch (error) {

    console.error("Fetch error:", error);

    return {
      props: {
        jobs: [],
        totalPages: 1,
        category,
        location,
        currentPage: page,
      },
      revalidate: 900,
    };

  }

}