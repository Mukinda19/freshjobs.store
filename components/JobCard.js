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
  if (!applyLink) return null;

  const slug = generateSlug(job);

  return (
    <div className="border p-4 rounded-lg bg-white hover:shadow-lg transition flex flex-col justify-between">
      <div>
        {/* 🔹 Job Title (Internal SEO Link) */}
        <h3 className="text-lg font-bold leading-snug text-[#1a73e8] mb-1">
          <Link
            href={`/job/${slug}`}
            className="hover:underline"
          >
            {job.title || "Job Title"}
          </Link>
        </h3>

        {/* 🔹 Company + Location */}
        {(job.company || job.location) && (
          <p className="text-sm text-[#333333]">
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

      {/* 🔹 CTA Area */}
      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/job/${slug}`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View Details →
        </Link>

        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block bg-[#0056b3] text-white text-sm px-4 py-2 rounded font-bold hover:bg-blue-700"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}