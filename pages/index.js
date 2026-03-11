import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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

  /* -------- SEARCH -------- */

  const handleSearch = (e) => {

    e.preventDefault();

    const finalCategory = category || "all";
    const finalLocation = location || "india";

    const qParam = keyword
      ? `?q=${encodeURIComponent(keyword)}`
      : "";

    router.push(`/jobs/${finalCategory}/${finalLocation}${qParam}`);

  };

  /* -------- FILTER FETCH -------- */

  useEffect(() => {

    if (!category && !keyword) return;

    const fetchFilteredJobs = async () => {

      try {

        const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";

        const categoryParam =
          category && category !== "all"
            ? `&category=${encodeURIComponent(category)}`
            : "";

        const res = await fetch(
          `/api/search?page=1&limit=10${categoryParam}${qParam}`
        );

        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        const uniqueJobs = Array.from(
          new Map(
            (data.jobs || []).map(job => [
              job.slug || job.link,
              job
            ])
          ).values()
        );

        setFilteredJobs(uniqueJobs);
        setPage(1);

      } catch (error) {

        console.error("Search error:", error);
        setFilteredJobs([]);

      }

    };

    fetchFilteredJobs();

  }, [category, keyword]);

  /* -------- LOAD MORE -------- */

  const loadMore = async () => {

    if (loading) return;

    setLoading(true);

    const nextPage = page + 1;

    try {

      const qParam = keyword ? `&q=${encodeURIComponent(keyword)}` : "";

      const categoryParam =
        category && category !== "all"
          ? `&category=${encodeURIComponent(category)}`
          : "";

      const res = await fetch(
        `/api/search?page=${nextPage}&limit=10${categoryParam}${qParam}`
      );

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const newJobs = data.jobs || [];

      const combined = [...filteredJobs, ...newJobs];

      const uniqueJobs = Array.from(
        new Map(
          combined.map(job => [
            job.slug || job.link,
            job
          ])
        ).values()
      );

      setFilteredJobs(uniqueJobs);
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

        <title>Latest Jobs in India 2026 | FreshJobs</title>

        <meta
          name="description"
          content="Find latest jobs in India including IT jobs, banking jobs, BPO jobs, engineering jobs, government jobs and work from home jobs."
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://www.freshjobs.store/" />

        {/* Open Graph */}

        <meta property="og:title" content="Latest Jobs in India | FreshJobs" />

        <meta
          property="og:description"
          content="Explore thousands of latest job openings across IT, banking, BPO, engineering and government sectors."
        />

        <meta property="og:url" content="https://www.freshjobs.store/" />

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="FreshJobs" />

        <meta name="twitter:card" content="summary_large_image" />

      </Head>

      {/* HERO */}

      <section className="text-center my-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-3">

          Find Latest Jobs in India

        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">

          Discover the newest job openings across IT, banking, BPO,
          engineering, government and work from home categories.

        </p>

      </section>

      {/* CATEGORY GRID */}

      <section className="my-10">

        <h2 className="text-xl font-semibold mb-6 text-center">

          Popular Job Categories

        </h2>

        <CategoryGrid />

      </section>

      {/* SEARCH */}

      <section className="my-10">

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
            <option value="work-from-home">Work From Home</option>
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

          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">

            Search Jobs

          </button>

        </form>

      </section>

      {/* JOB LIST */}

      <section className="my-12">

        <h2 className="text-2xl font-semibold mb-6">

          Latest Job Openings

        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {filteredJobs.length > 0 ? (

            filteredJobs.map(job => (

              <JobCard key={job.slug || job.link} job={job} />

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

/* -------- STATIC PROPS -------- */

export async function getStaticProps() {

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.freshjobs.store";

  try {

    const res = await fetch(`${baseUrl}/api/search?page=1&limit=10`);

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    return {

      props: {
        initialJobs: data.jobs || [],
      },

      revalidate: 1800

    };

  } catch {

    return {

      props: {
        initialJobs: [],
      },

      revalidate: 600

    };

  }

}