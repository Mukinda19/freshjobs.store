export function getJobSeo({ category, location }) {

  const formatText = (text) =>
    (text || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const categoryText = formatText(category);
  const locationText = formatText(location || "India");

  /* SEO TITLE */

  const title = `${categoryText} Jobs in ${locationText} | Latest ${categoryText} Vacancies 2025`;

  /* SEO DESCRIPTION */

  const description = `Find the latest ${categoryText.toLowerCase()} jobs in ${locationText}. Browse fresh job openings including government jobs, private sector jobs, remote jobs and work from home opportunities updated daily on FreshJobs.store.`;

  /* CANONICAL URL */

  const canonical = location
    ? `https://freshjobs.store/jobs/${category}/${location}`
    : `https://freshjobs.store/jobs/${category}`;

  return {
    title,
    description,
    canonical,
  };
}