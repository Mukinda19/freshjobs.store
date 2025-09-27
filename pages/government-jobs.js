
import { fetchGovtJobs } from "../utils/apiHelpers";
import JobCard from "../components/JobCard";

export default function GovtJobs({ jobs }) {
  return (
    <>
      
      <main className="max-w-6xl mx-auto px-4 my-8">
        <h1 className="text-3xl font-bold mb-6">Government Jobs</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </main>
      
    </>
  );
}

export async function getServerSideProps() {
  const jobs = await fetchGovtJobs();
  return { props: { jobs } };
}