import Head from "next/head";
import Link from "next/link";
import JobCard from "../../components/JobCard";

export default function GovtJobs({ initialJobs, totalPages }) {
  const jobs = initialJobs;
  const currentPage = 1;

  /* 🔥 SEO SCHEMA */
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      url: `https://www.freshjobs.store/jobs/${job.slug}`,
    })),
  };

  return (
    <>
      <Head>
        <title>
          Latest Government Jobs 2026 | Sarkari Naukri Updates India
        </title>

        <meta
          name="description"
          content="Latest Government Jobs 2026 in India. Daily updated Sarkari Naukri for Banking, Railway, Defence, PSU and State Govt vacancies with official apply links."
        />

        <link
          rel="canonical"
          href="https://www.freshjobs.store/government-jobs"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Latest Government Jobs 2026 | FreshJobs" />
        <meta
          property="og:description"
          content="Daily updated Sarkari Naukri listings for Railway, Banking, Defence & PSU."
        />
        <meta
          property="og:url"
          content="https://www.freshjobs.store/government-jobs"
        />
        <meta property="og:type" content="website" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 my-8">
        <nav className="text-sm mb-4 text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">
              Government Jobs
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold mb-4">
          Government Jobs in India 2026 – Latest Sarkari Naukri
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Find latest Sarkari Naukri updates including Railway, Banking,
          Defence, PSU and State Government job vacancies. All listings are
          verified and updated daily with official apply links.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* 🔥 Professional Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            <span className="px-4 py-2 border rounded bg-blue-600 text-white">
              1
            </span>

            {Array.from({ length: totalPages - 1 }, (_, i) => (
              <Link
                key={i}
                href={`/government-jobs/page/${i + 2}`}
                className="px-4 py-2 border rounded hover:bg-gray-200"
              >
                {i + 2}
              </Link>
            ))}

            <Link
              href="/government-jobs/page/2"
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Next »
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

/* 🚀 PRODUCTION ISR */
export async function getStaticProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.freshjobs.store";

    const res = await fetch(
      `${baseUrl}/api/search?category=govt-jobs&page=1&limit=10`
    );

    const data = await res.json();

    return {
      props: {
        initialJobs: data.jobs || [],
        totalPages: data.totalPages || 1,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Government Jobs Fetch Error:", error);

    return {
      props: {
        initialJobs: [],
        totalPages: 1,
      },
      revalidate: 300,
    };
  }
}