export default function JobCard({ job }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-gray-700">{job.company} - {job.location}</p>
      {job.salary && <p className="text-green-600">{job.salary}</p>}
      <p className="text-gray-600 mt-2">{job.snippet}</p>
      <a href={job.url} target="_blank" rel="noopener noreferrer"
         className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Apply Now
      </a>
    </div>
  );
}