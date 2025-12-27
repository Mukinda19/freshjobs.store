import Head from "next/head";
import Link from "next/link";

export default function JobSourcesPage() {
  const sources = [
    {
      name: "Indeed",
      url: "https://www.indeed.com",
      description:
        "Search millions of jobs from thousands of company websites and job boards.",
    },
    {
      name: "Naukri",
      url: "https://www.naukri.com",
      description:
        "India’s leading job portal for private, IT, and corporate jobs.",
    },
    {
      name: "Apna App",
      url: "https://apna.co",
      description:
        "Find local jobs, work from home jobs, and part-time jobs in India.",
    },
    {
      name: "WorkIndia",
      url: "https://www.workindia.in",
      description:
        "Trusted platform for blue-collar, office, delivery and field jobs.",
    },
    {
      name: "OLX Jobs",
      url: "https://www.olx.in/jobs_c760",
      description:
        "Browse local job listings posted directly by employers and recruiters.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 🔹 SEO */}
      <Head>
        <title>Trusted Job Sources in India | FreshJobs.Store</title>
        <meta
          name="description"
          content="Browse trusted job portals like Indeed, Naukri, Apna, WorkIndia and OLX Jobs. Find government, private, work from home and local jobs."
        />
        <link rel="canonical" href="https://freshjobs.store/job-sources" />
      </Head>

      {/* 🔹 Heading */}
      <h1 className="text-3xl font-bold mb-4">
        Trusted Job Sources in India
      </h1>

      <p className="text-gray-700 mb-8">
        FreshJobs.Store collects job information from reliable and publicly
        available sources. Below are some of the most trusted job portals where
        you can apply directly on the official websites.
      </p>

      {/* 🔹 Sources List */}
      <div className="grid md:grid-cols-2 gap-6">
        {sources.map((source, index) => (
          <div
            key={index}
            className="border rounded-lg p-5 bg-white hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {source.name}
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              {source.description}
            </p>

            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
            >
              Visit {source.name}
            </a>
          </div>
        ))}
      </div>

      {/* 🔹 Disclaimer */}
      <div className="mt-10 text-sm text-gray-500">
        <p>
          Disclaimer: FreshJobs.Store is not affiliated with the job portals
          listed above. We redirect users to official websites for job
          applications.
        </p>
      </div>

      {/* 🔹 Internal Link Boost */}
      <div className="mt-6">
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Latest Jobs
        </Link>
      </div>
    </div>
  );
}