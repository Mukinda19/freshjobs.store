import Link from "next/link";

/* ---------------- Helper: SEO safe slug ---------------- */
const generateSlug = (job = {}) => {
  const base =
    job.slug ||
    `${job.title || "job"} ${job.company || ""}`;

  return String(base)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function JobCard({ job }) {
  if (!job) return null;

  const applyLink = job.url || job.link || job.applyLink || "";
  const slug = generateSlug(job);

  return (
    <div className="border rounded-md bg-white p-3 hover:shadow-md transition flex flex-col justify-between">
      
      {/* 🔹 Clickable Content → Detail Page */}
      <Link href={`/job/${slug}`} className="block">
        <div>
          {/* Job Title */}
          <h3 className="text-sm font-semibold text-[#1a73e8] leading-snug hover:underline">
            {job.title || "Job Title"}
          </h3>

          {/* Company + Location */}
          {(job.company || job.location) && (
            <p className="text-xs text-gray-600 mt-0.5">
              {job.company || "Company"}
              {job.location ? ` • ${job.location}` : ""}
            </p>
          )}

          {/* Salary */}
          {job.salary && (
            <p className="text-xs text-green-700 mt-1">
              {job.salary}
            </p>
          )}

          {/* Snippet */}
          {job.snippet && (
            <p className="text-xs text-gray-700 mt-2 line-clamp-2">
              {job.snippet}
            </p>
          )}
        </div>
      </Link>

      {/* 🔹 Apply Button (External Link) */}
      {applyLink && (
        <div className="mt-3">
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-block text-xs px-3 py-1.5 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Apply Now →
          </a>
        </div>
      )}
    </div>
  );
}