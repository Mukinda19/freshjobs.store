import Head from "next/head"
import Link from "next/link"

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer | FreshJobs</title>
        <meta
          name="description"
          content="Disclaimer for FreshJobs regarding job information, third-party links and website usage."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.freshjobs.store/disclaimer" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

        <p className="mb-4">
          Welcome to FreshJobs. The information available on this website is
          provided for general informational purposes only.
        </p>

        <p className="mb-4">
          We are not a government organization, recruitment agency, or employer.
          We only share job-related information collected from public sources,
          company career pages, and official websites.
        </p>

        <p className="mb-4">
          Users are advised to verify all job details such as eligibility,
          dates, salary, and application process from the official website
          before applying.
        </p>

        <p className="mb-4">
          FreshJobs is not responsible for errors, omissions, expired vacancies,
          or any losses arising from the use of this information.
        </p>

        <p className="mb-4">
          Our website may contain links to third-party websites. We do not
          control or guarantee the accuracy of content on external websites.
        </p>

        <p className="mb-4">
          If you find any incorrect information or have concerns, please contact
          us through our Contact page.
        </p>

        <Link href="/contact" className="text-blue-600 underline">
          Contact Us
        </Link>
      </main>
    </>
  )
}