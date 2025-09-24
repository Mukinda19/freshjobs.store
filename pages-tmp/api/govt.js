export default async function handler(req, res) {
  // Fetch Govt Jobs RSS feed and return
  res.status(200).json({ jobs: [] });
}