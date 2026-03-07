export function getJobSeo({ category, location }) {

  const formatText = (text) =>
    (text || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const categoryText = formatText(category);
  const locationText = formatText(location || "India");

  /* ---------- SEO TITLE ---------- */

  const title =
    location
      ? `${categoryText} Jobs in ${locationText} | Latest ${categoryText} Job Openings`
      : `Latest ${categoryText} Jobs | ${categoryText} Vacancies Worldwide`;

  /* ---------- SEO DESCRIPTION ---------- */

  const description =
    location
      ? `Find the latest ${categoryText.toLowerCase()} jobs in ${locationText}. Explore government jobs, private jobs, remote jobs and work from home opportunities updated daily on FreshJobs.`
      : `Explore the latest ${categoryText.toLowerCase()} jobs worldwide. Discover remote jobs, international jobs, government jobs and private sector opportunities updated daily on FreshJobs.`;

  /* ---------- CANONICAL URL ---------- */

  const canonical = location
    ? `https://freshjobs.store/jobs/${category}/${location}`
    : `https://freshjobs.store/jobs/${category}`;

  /* ---------- KEYWORDS (SEO BOOST) ---------- */

  const keywords = [
    `${categoryText} jobs`,
    `${categoryText} jobs in ${locationText}`,
    `latest ${categoryText} jobs`,
    `${categoryText} vacancies`,
    `remote ${categoryText} jobs`,
    `work from home ${categoryText} jobs`,
    `international ${categoryText} jobs`
  ].join(", ");

  return {
    title,
    description,
    canonical,
    keywords
  };
}