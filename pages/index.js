import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CategoryGrid from "../components/CategoryGrid";
import JobCard from "../components/JobCard";

export default function Home({ initialJobs, totalPages }) {
  const router = useRouter();

  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Search states
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // 🔹 Filtered jobs for Featured Jobs section
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);

  // 🔹 Search submit
  const handleSearch = (e) => {
    e.preventDefault();

    const finalCategory = category || "all";
    const finalLocation = location || "india";

    router.push(
      `/jobs/${finalCategory}/${finalLocation}?q=${encodeURIComponent(keyword)}`
    );
  };

  // 🔹 Fetch filtered jobs when search params change
  useEffect(() => {
    const fetchFilteredJobs = async () => {
      const finalCategory = category || "all";
      const finalLocation = location || "india";
      const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";

      const res = await fetch(
        `/api/search?category=${finalCategory}&location=${finalLocation}${qParam}&page=1&limit=10`
      );
      const data = await res.json();
      setFilteredJobs(data.jobs || []);
      setPage(1);
    };

    fetchFilteredJobs();
  }, [category, location, keyword]);

  // 🔹 Load more jobs
  const loadMore = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    const finalCategory = category || "all";
    const finalLocation = location || "india";
    const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";

    const res = await fetch(
      `/api/search?category=${finalCategory}&location=${finalLocation}${qParam}&page=${nextPage}&limit=10`
    );
    const data = await res.json();

    setFilteredJobs((prev) => [...prev, ...data.jobs]);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>FreshJobs.Store | Find Jobs in India</title>
        <meta
          name="description"
          content="Search latest jobs in India across IT, Govt, BPO, Banking and more."
        />
      </Head>

      {/* 🔹 HERO + SEARCH */}
      <section className="my-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Search Jobs in India
        </h1>

        {/* 🔹 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="grid md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Job title, skills or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="bg-blue-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition"
          >
            Search Jobs
          </button>
        </form>
      </section>

      {/* 🔹 Popular Categories */}
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>
        <CategoryGrid />
      </section>

      {/* 🔹 Featured Jobs */}
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Jobs</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredJobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>

        {page < totalPages && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
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
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/search?page=1&limit=10`
  );
  const data = await res.json();

  return {
    props: {
      initialJobs: data.jobs || [],
      totalPages: data.totalPages || 1,
    },
  };
}