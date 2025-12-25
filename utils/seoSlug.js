// utils/seoSlug.js

export function parseSeoSlug(slug) {
  // example: engineer-jobs-in-mumbai
  const parts = slug.split("-jobs-in-");

  if (parts.length !== 2) {
    return { category: null, location: null };
  }

  return {
    category: parts[0],
    location: parts[1],
  };
}