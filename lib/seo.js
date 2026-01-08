export function getJobSeo({ category, location }) {
  const categoryText = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const locationText = location
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const title = `${categoryText} Jobs in ${locationText} | Latest Vacancies – Fresh Jobs`;
  const description = `Apply for latest ${categoryText} jobs in ${locationText}. Daily updated job vacancies including private, government, and work from home jobs on FreshJobs.store.`;

  return {
    title,
    description,
    canonical: `https://freshjobs.store/jobs/${category}/${location}`,
  };
}