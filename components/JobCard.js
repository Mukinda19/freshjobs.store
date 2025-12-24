// 🔹 Helper: SEO friendly slug generator (future use safe)
const generateSlug = (job) => {
  const base =
    job.slug ||
    `${job.title || "job"} ${job.company || ""}`;

  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function JobCard({ job }) {
  // 🔹 External apply link (priority safe)
  const applyLink = job.url || job.link || job.applyLink || "";

  return (
    <div className="border p-4 rounded-lg bg-white hover:shadow-lg transition flex flex-col justify-between">
      <div>
        {/* 🔹 Job Title (NO internal link now) */}
        <h3 className="text-lg font-semibold leading-snug text-gray-900">
          {job.title || "Job Title"}
        </h3>

        {/* 🔹 Company + Location */}
        {(job.company || job.location) && (
          <p className="text-sm text-gray-600 mt-1">
            {job.company || "Company"}
            {job.location ? ` • ${job.location}` : ""}
          </p>
        )}

        {/* 🔹 Salary */}
        {job.salary && (
          <p className="text-sm text-green-600 mt-1">
            {job.salary}
          </p>
        )}

        {/* 🔹 Snippet */}
        {job.snippet && (
          <p className="text-gray-700 text-sm mt-3 line-clamp-3">
            {job.snippet}
          </p>
        )}
      </div>

      {/* 🔹 Actions */}
      <div className="mt-4 flex items-center justify-end">
        {applyLink ? (
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply on Company Site
          </a>
        ) : (
          <span className="text-xs text-red-500">
            Apply link not available
          </span>
        )}
      </div>
    </div>
  );
}