export default function JobCard({ job }) {
  // Apply link priority handling
  const applyLink = job.url || job.link || job.applyLink || "";

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition bg-white">
      {/* Job Title */}
      <h3 className="text-xl font-semibold">
        {job.title || "Job Title"}
      </h3>

      {/* Company + Location */}
      {(job.company || job.location) && (
        <p className="text-gray-700 mt-1">
          {job.company || "Company"}
          {job.location ? ` - ${job.location}` : ""}
        </p>
      )}

      {/* Salary */}
      {job.salary && (
        <p className="text-green-600 mt-1">{job.salary}</p>
      )}

      {/* Description / Snippet */}
      {job.snippet && (
        <p className="text-gray-600 mt-2">
          {job.snippet}
        </p>
      )}

      {/* Apply Button */}
      {applyLink ? (
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Now
        </a>
      ) : (
        <span className="mt-4 inline-block text-sm text-red-500">
          Apply link not available
        </span>
      )}
    </div>
  );
}