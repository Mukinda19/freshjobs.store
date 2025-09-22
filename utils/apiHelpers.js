export async function fetchJobs(query) {
  return [
    {
      id: "1",
      title: "Software Engineer",
      company: "ABC Tech",
      location: "Pune, India",
      snippet: "Looking for frontend developer...",
      salary: "3,50,000 5,00,000",
      url: "https://www.jooble.org/job/software-engineer-pune"
    }
  ];
}

export async function fetchGovtJobs() {
  return [
    {
      id: "101",
      title: "UPSC Civil Services",
      company: "Government of India",
      location: "All India",
      snippet: "Apply for UPSC CSE 2025",
      url: "https://www.upsc.gov.in"
    }
  ];
}