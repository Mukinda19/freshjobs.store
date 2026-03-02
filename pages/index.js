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
    const finalCategory = category || "";
    const finalLocation = location || "india";

    router.push(
      `/jobs/${finalCategory || "all"}/${finalLocation}?q=${encodeURIComponent(keyword)}`
    );
  };

  useEffect(() => {
    const fetchFilteredJobs = async () => {
      try {
        const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";
        const categoryParam = category ? `&category=${category}` : "";

        const res = await fetch(
          `/api/search?page=1&limit=10${categoryParam}${qParam}`
        );

        const data = await res.json();
        setFilteredJobs(data.jobs || []);
        setPage(1);
      } catch {
        setFilteredJobs([]);
      }
    };

    fetchFilteredJobs();
  }, [category, keyword]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";
      const categoryParam = category ? `&category=${category}` : "";

      const res = await fetch(
        `/api/search?page=${nextPage}&limit=10${categoryParam}${qParam}`
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

      {/* ===== Rest of your structure SAME ===== */}

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
            <option value="government-jobs">Government Jobs</option>
            <option value="work-from-home">Work From Home</option>
            <option value="international-jobs">International Jobs</option>
            <option value="ai-jobs">AI Jobs</option>
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

      {/* ===== Latest Jobs Section SAME ===== */}

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
    </>
  );
}

export async function getStaticProps() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.freshjobs.store";

  try {
    const res = await fetch(`${baseUrl}/api/search?page=1&limit=10`);
    const data = await res.json();

    return {
      props: {
        initialJobs: data.jobs || [],
      },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: {
        initialJobs: [],
      },
      revalidate: 3600,
    };
  }
}