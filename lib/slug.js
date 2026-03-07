export function createJobSlug(title = "", company = "") {

  const clean = (text) =>
    text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const base = `${clean(title)} ${clean(company)}`;

  const slug = base
    .split(" ")
    .filter(Boolean)
    .slice(0, 10)
    .join("-");

  return slug;

}