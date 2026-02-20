import { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import JobCard from "../components/JobCard";

export default function GovtJobs({ initialJobs, totalPages }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(
        `/api/search?category=govt-jobs&page=${nextPage}&limit=10`
      );
      const data = await res.json();
      setJobs((prev) => [...prev, ...(data.jobs || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Load More Government Jobs Error:", error);
    }

    setLoading(false);
  }, [loading, page, totalPages]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I apply for government jobs in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can apply through the official website link provided in each job listing. Always check eligibility and official notification before applying."
        }
      },
      {
        "@type": "Question",
        name: "Are these Sarkari Naukri updates daily?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we update latest government job notifications daily from official and trusted sources."
        }
      },
      {
        "@type": "Question",
        name: "Do you provide state wise government jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we list central as well as state government job vacancies including banking, railway, defence and PSU jobs."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>
          Latest Government Jobs in India 2026 | Sarkari Naukri Updates
        </title>

        <meta
          name="description"
          content="Find latest Government Jobs in India 2026. Get daily Sarkari Naukri updates for Banking, Railway, Defence, PSU and State Government vacancies with official apply links."
        />

        <link
          rel="canonical"
          href="https://freshjobs.store/government-jobs"
        />

        <meta name="robots" content="index, follow" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 my-8">
        <nav className="text-sm mb-4 text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:underline text-blue-600" prefetch={false}>
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
          Government Jobs in India – Sarkari Naukri 2026
        </h1>

        <p className="text-gray-600 mb-6 max-w-3xl">
          Explore the latest <strong>Sarkari Naukri</strong>, PSU, Banking,
          Railway, Defence and State Government job vacancies across India.
          All listings are updated daily with official application links.
          Stay ahead with real-time government job alerts.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>

        {page < totalPages && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Jobs"}
            </button>
          </div>
        )}

        {/* Internal Linking Boost */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Explore More Career Options
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <Link href="/resume-builder" prefetch={false}>
                Free Resume Builder
              </Link>
            </li>
            <li>
              <Link href="/work-from-home" prefetch={false}>
                Remote & Work From Home Jobs
              </Link>
            </li>
            <li>
              <Link href="/ai-jobs" prefetch={false}>
                AI & Tech Jobs
              </Link>
            </li>
            <li>
              <Link href="/international-jobs" prefetch={false}>
                International Job Opportunities
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}

/* ✅ Faster SSR with Cache */
export async function getServerSideProps({ res }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://freshjobs.store";

  try {
    const response = await fetch(
      `${baseUrl}/api/search?category=govt-jobs&page=1&limit=10`
    );

    const data = await response.json();

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=300"
    );

    return {
      props: {
        initialJobs: data.jobs || [],
        totalPages: data.totalPages || 1,
      },
    };
  } catch (error) {
    console.error("Government Jobs Fetch Error:", error);

    return {
      props: {
        initialJobs: [],
        totalPages: 1,
      },
    };
  }
}