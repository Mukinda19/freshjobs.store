// pages/jobs/[category]/[location].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JobCard from "../../../components/JobCard";

export default function JobCategoryPage() {
  const router = useRouter();
  const { category, location } = router.query;

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (category && location) {
      // Fetch jobs from API
      fetch(`/api/search?category=${category}&location=${location}`)
        .then((res) => res.json())
        .then((data) => setJobs(data))
        .catch((err) => console.error(err));
    }
  }, [category, location]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Jobs in {category} at {location}
        </h1>
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No jobs found for this category and location.</p>
        )}
      </main>
      <Footer />
    </>
  );
}