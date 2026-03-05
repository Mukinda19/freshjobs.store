import Link from "next/link";

/* ---------------- Helper: SEO Safe Slug ---------------- */
const generateSlug = (job = {}) => {
  const base =
    job.slug ||
    `${job.title || "job"} ${job.company || ""}`;

  return String(base)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function JobCard({ job }) {
  if (!job) return null;

  const applyLink = job.url || job.link || job.applyLink || "";
  const slug = generateSlug(job);

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-lg transition duration-200 flex flex-col justify-between h-full">
      
      {/* 🔹 Clickable Job Info */}
      <Link href={`/job/${slug}`} className="block">
        <div>

          {/* Job Title */}
          <h3 className="text-sm md:text-base font-semibold text-blue-700 leading-snug hover:underline">
            {job.title || "Job Opening"}
          </h3>

          {/* Company + Location */}
          {(job.company || job.location) && (
            <p className="text-xs text-gray-600 mt-1">
              <span className="font-medium">
                {job.company || "Company"}
              </span>
              {job.location && ` • ${job.location}`}
            </p>
          )}

          {/* Salary */}
          {job.salary && (
            <p className="text-xs text-green-600 font-medium mt-1">
              💰 {job.salary}
            </p>
          )}

          {/* Description Snippet */}
          {job.snippet && (
            <p className="text-xs text-gray-700 mt-2 line-clamp-2 leading-relaxed">
              {job.snippet}
            </p>
          )}

        </div>
      </Link>

      {/* 🔹 Apply Button */}
      {applyLink && (
        <div className="mt-4">
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-block text-xs md:text-sm px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Apply Now →
          </a>
        </div>
      )}

    </div>
  );
}