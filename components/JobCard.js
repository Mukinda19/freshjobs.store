import Link from "next/link";

/* ---------------- HELPER: SEO SAFE SLUG ---------------- */

const generateSlug = (job = {}) => {

  if (job.slug) return job.slug;

  const base = `${job.title || "job"} ${job.company || ""} ${job.location || ""}`;

  return String(base)
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

/* ---------------- HELPER: SAFE TEXT ---------------- */

const safeText = (value, fallback = "") => {

  if (!value) return fallback;

  return String(value)
    .replace(/<[^>]*>?/gm, "")
    .trim();
};

/* ---------------- CATEGORY SLUG HELPER ---------------- */

const categoryToSlug = (category = "") => {
  return String(category)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function JobCard({ job }) {

  if (!job) return null;

  const title = safeText(job.title, "Latest Job Opening");
  const company = safeText(job.company, "Company");
  const location = safeText(job.location);
  const salary = safeText(job.salary);
  const snippet = safeText(job.snippet || job.description);

  const applyLink =
    job.applyLink ||
    job.url ||
    job.link ||
    "";

  const slug = generateSlug(job);

  const categorySlug = categoryToSlug(job.category || "jobs");

  return (

    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition duration-200 flex flex-col justify-between h-full">

      {/* JOB INFO */}

      <Link
        href={`/job/${slug}`}
        prefetch={false}
        className="block group"
      >

        <div>

          <h3 className="text-sm md:text-base font-semibold text-blue-700 leading-snug group-hover:underline">
            {title}
          </h3>

          {(company || location) && (
            <p className="text-xs text-gray-600 mt-1">
              <span className="font-medium">{company}</span>
              {location && ` • ${location}`}
            </p>
          )}

          {salary && (
            <p className="text-xs text-green-600 font-medium mt-1">
              💰 {salary}
            </p>
          )}

          {snippet && (
            <p className="text-xs text-gray-700 mt-2 line-clamp-2 leading-relaxed">
              {snippet}
            </p>
          )}

        </div>

      </Link>

      {/* APPLY BUTTON */}

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

      {/* 🔥 INTERNAL LINKING (SEO BOOST) */}

      <div className="mt-4 text-xs text-gray-600 flex flex-wrap gap-2">

        {/* Same Category */}
        <Link href={`/jobs/${categorySlug}`} className="hover:underline text-blue-600">
          More {safeText(job.category, "Jobs")}
        </Link>

        {/* Extra SEO Links */}
        <Link href="/jobs/work-from-home" className="hover:underline">
          Work From Home Jobs
        </Link>

        <Link href="/jobs/govt-jobs" className="hover:underline">
          Government Jobs
        </Link>

      </div>

    </div>

  );

}