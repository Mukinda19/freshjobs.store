// pages/jobs/[category]/[location].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import JobCard from "../../../components/JobCard";

export default function JobCategoryPage() {
  const router = useRouter();
  const { category, location } = router.query;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category && location) {
      fetch(`/api/search?category=${category}&location=${location}`)
        .then((res) => res.json())
        .then((data) => {
          setJobs(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [category, location]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">
        Jobs in {category} at {location}
      </h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, index) => (
            <JobCard key={job.id || index} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-gray-700">
          No jobs found for this category and location.
        </p>
      )}
    </>
  );
}