import Head from "next/head";
import Link from "next/link";
import JobCard from "../../../components/JobCard";

export default function WorkFromHomePage({ jobs, currentPage, totalPages }) {
  return (
    <>
      <Head>
        <title>
          Work From Home Jobs – Page {currentPage} | FreshJobs
        </title>

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={
            currentPage === 1
              ? "https://www.freshjobs.store/work-from-home"
              : `https://www.freshjobs.store/work-from-home/page/${currentPage}`
          }
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 my-8">
        <h1 className="text-3xl font-bold mb-6">
          Work From Home Jobs – Page {currentPage}
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.slug || index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {currentPage > 1 && (
            <Link
              href={
                currentPage === 2
                  ? "/work-from-home"
                  : `/work-from-home/page/${currentPage - 1}`
              }
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              « Prev
            </Link>
          )}

          <span className="px-4 py-2 border rounded bg-blue-600 text-white">
            {currentPage}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`/work-from-home/page/${currentPage + 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Next »
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps({ params }) {
  const page = Number(params.page) || 1;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.freshjobs.store";

  try {
    const res = await fetch(
      `${baseUrl}/api/search?category=wfh&page=${page}&limit=10`
    );

    const data = await res.json();

    if (!data.jobs || data.jobs.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        jobs: data.jobs,
        currentPage: page,
        totalPages: data.totalPages || 1,
      },
      revalidate: 300,
    };
  } catch (error) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}