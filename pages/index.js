import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CategoryGrid from "../components/CategoryGrid";
import JobCard from "../components/JobCard";

export default function Home({ initialJobs }) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Search states
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [filteredJobs, setFilteredJobs] = useState(initialJobs || []);

  // 🔹 Search submit (redirect SEO pages)
  const handleSearch = (e) => {
    e.preventDefault();

    const finalCategory = category || "all";
    const finalLocation = location || "india";

    router.push(
      `/jobs/${finalCategory}/${finalLocation}?q=${encodeURIComponent(keyword)}`
    );
  };

  // 🔹 Fetch jobs on filter change
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
      } catch (error) {
        console.error("Job fetch error:", error);
        setFilteredJobs([]);
      }
    };

    fetchFilteredJobs();
  }, [category, location, keyword]);

  // 🔹 Load more
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
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>FreshJobs.Store | Latest Jobs in India</title>
        <meta
          name="description"
          content="Find latest IT, Government, Work From Home, AI and International jobs in India."
        />
      </Head>

      {/* 🔹 HERO SEARCH */}
      <section className="my-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Search Jobs in India
        </h1>

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
            <option value="it">IT Jobs</option>
            <option value="banking">Banking Jobs</option>
            <option value="bpo">BPO Jobs</option>
            <option value="sales">Sales Jobs</option>
            <option value="engineering">Engineering Jobs</option>
            <option value="govt-jobs">Government Jobs</option>

            {/* 🔹 High CPC */}
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

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Search Jobs
          </button>
        </form>
      </section>

      {/* 🔹 Categories */}
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>
        <CategoryGrid />
      </section>

      {/* 🔹 Popular Searches */}
      <section className="my-12">
        <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
        <div className="flex flex-wrap gap-3">
          {[
            ["IT Jobs in Mumbai", "/jobs/it/mumbai"],
            ["Govt Jobs in India", "/jobs/govt-jobs/india"],
            ["Work From Home Jobs", "/jobs/work-from-home/india"],
            ["International Jobs", "/jobs/international/india"],
            ["AI Jobs", "/jobs/ai/india"],
          ].map(([label, link]) => (
            <a
              key={link}
              href={link}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* 🔹 Featured Jobs */}
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Latest Jobs</h2>

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