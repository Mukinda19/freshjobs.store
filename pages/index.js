import Head from "next/head";
import CategoryGrid from "../components/CategoryGrid";
import JobCard from "../components/JobCard";
import { fetchJobs } from "../utils/apiHelpers";

export default function Home({ jobs }) {
  return (
    <>
      <Head>
        <title>FreshJobs.Store | Find Jobs in India</title>
        <meta
          name="description"
          content="Search latest jobs in India across IT, Govt, BPO, Banking and more. Free resume builder and job alerts."
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4">
        <section className="my-8">
          <h1 className="text-3xl font-bold mb-4">
            Search Jobs in India
          </h1>
          {/* Search Form later */}
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">
            Popular Categories
          </h2>
          <CategoryGrid />
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">
            Featured Jobs
          </h2>

          {jobs.length === 0 ? (
            <p className="text-gray-600">No jobs available right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job, index) => (
                <JobCard key={job.id || index} job={job} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    // 👇 IMPORTANT: empty string hata diya
    const jobs = await fetchJobs();

    return {
      props: {
        jobs: Array.isArray(jobs) ? jobs.slice(0, 10) : [],
      },
    };
  } catch (err) {
    console.error("Home fetch error:", err);
    return {
      props: { jobs: [] },
    };
  }
}