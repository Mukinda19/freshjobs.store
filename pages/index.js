import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import CategoryGrid from "../components/CategoryGrid";
import JobCard from "../components/JobCard";

export default function Home({ initialJobs }) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [filteredJobs, setFilteredJobs] = useState(initialJobs || []);

  const handleSearch = (e) => {
    e.preventDefault();
    const finalCategory = category || "all";
    const finalLocation = location || "india";

    router.push(
      `/jobs/${finalCategory}/${finalLocation}?q=${encodeURIComponent(keyword)}`
    );
  };

  useEffect(() => {
    const fetchFilteredJobs = async () => {
      try {
        const finalCategory = category || "all";
        const finalLocation = location || "india";
        const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";

        const res = await fetch(
          `/api/search?category=${finalCategory}&location=${finalLocation}${qParam}&page=1&limit=10`
        );
        const data = await res.json();
        setFilteredJobs(data.jobs || []);
        setPage(1);
      } catch {
        setFilteredJobs([]);
      }
    };

    fetchFilteredJobs();
  }, [category, location, keyword]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const finalCategory = category || "all";
      const finalLocation = location || "india";
      const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";

      const res = await fetch(
        `/api/search?category=${finalCategory}&location=${finalLocation}${qParam}&page=${nextPage}&limit=10`
      );
      const data = await res.json();
      setFilteredJobs((prev) => [...prev, ...(data.jobs || [])]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Latest Jobs in India | FreshJobs.Store</title>
        <meta
          name="description"
          content="Find latest IT jobs, BPO jobs, sales jobs, engineering jobs, government and work from home jobs in India. Apply on official company websites."
        />
        <link rel="canonical" href="https://www.freshjobs.store/" />
      </Head>

      {/* 🔹 SEO BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-medium">Jobs in India</li>
        </ol>
      </nav>

      {/* 🔹 SEO INTRO */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Latest Jobs in India
        </h1>
        <p className="text-gray-700 max-w-3xl">
          FreshJobs.Store is a trusted job search platform where you can explore
          IT jobs, BPO jobs, sales jobs, engineering roles, government vacancies,
          work from home and international job opportunities across India.
        </p>
      </section>

      {/* 🔹 SEARCH */}
      <section className="my-8">
        <form
          onSubmit={handleSearch}
          className="grid md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Job title, skills or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">All Categories</option>
            <option value="it-jobs">IT Jobs</option>
            <option value="banking-jobs">Banking Jobs</option>
            <option value="bpo-jobs">BPO Jobs</option>
            <option value="sales-jobs">Sales Jobs</option>
            <option value="engineering-jobs">Engineering Jobs</option>
            <option value="govt-jobs">Government Jobs</option>
            <option value="work-from-home">Work From Home</option>
            <option value="international">International Jobs</option>
            <option value="ai">AI Jobs</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">All India</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="pune">Pune</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
          </select>

          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            Search Jobs
          </button>
        </form>
      </section>

      {/* 🔹 CATEGORIES */}
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Job Categories</h2>
        <CategoryGrid />
      </section>

      {/* 🔹 JOB LIST */}
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Latest Job Openings</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <JobCard key={job.id || index} job={job} />
            ))
          ) : (
            <p className="text-gray-500">No jobs found.</p>
          )}
        </div>

        {filteredJobs.length >= 10 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Load More Jobs"}
            </button>
          </div>
        )}
      </section>

      {/* ✅ STEP 6 + STEP 9 – FINAL INTERNAL LINKS */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">
          Browse Jobs by Popular Categories in India
        </h2>

        <p className="text-gray-600 mb-4 max-w-3xl">
          These job categories receive the highest search demand in India.
          Explore verified job openings updated daily to apply directly on
          official company portals.
        </p>

        <ul className="grid md:grid-cols-2 gap-3 text-blue-700">
          <li><Link href="/jobs/it-jobs/india">IT Jobs in India</Link></li>
          <li><Link href="/jobs/banking-jobs/india">Banking Jobs in India</Link></li>
          <li><Link href="/jobs/bpo-jobs/india">BPO Jobs in India</Link></li>
          <li><Link href="/jobs/sales-jobs/india">Sales Jobs in India</Link></li>
          <li><Link href="/jobs/engineering-jobs/india">Engineering Jobs in India</Link></li>
          <li><Link href="/jobs/work-from-home/india">Work From Home Jobs</Link></li>
          <li><Link href="/jobs/international/india">International Jobs</Link></li>
        </ul>
      </section>
    </>
  );
}

export async function getServerSideProps() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/search?page=1&limit=10`);
  const data = await res.json();

  return {
    props: {
      initialJobs: data.jobs || [],
    },
  };
}