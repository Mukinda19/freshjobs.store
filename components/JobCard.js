// 🔹 Helper: SEO friendly slug generator (future safe)
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
  // 🔹 External apply link (RSS / source priority)
  const applyLink = job.url || job.link || job.applyLink || "";

  if (!applyLink) {
    return null;
  }

  return (
    <a
      href={applyLink}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block border p-4 rounded-lg bg-white hover:shadow-lg transition"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* 🔹 Job Title */}
          <h3 className="text-lg font-bold leading-snug text-[#1a73e8]">
            {job.title || "Job Title"}
          </h3>

          {/* 🔹 Company + Location */}
          {(job.company || job.location) && (
            <p className="text-sm text-[#333333] mt-1">
              {job.company || "Company"}
              {job.location ? ` • ${job.location}` : ""}
            </p>
          )}

          {/* 🔹 Salary */}
          {job.salary && (
            <p className="text-sm text-[#0a7b2e] mt-1">
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

        {/* 🔹 Apply CTA */}
        <div className="mt-4 text-right">
          <span className="inline-block bg-[#0056b3] text-white text-sm px-4 py-2 rounded font-bold hover:bg-blue-700">
            Apply Now
          </span>
        </div>
      </div>
    </a>
  );
}