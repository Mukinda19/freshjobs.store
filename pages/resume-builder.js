// pages/resume-builder.js
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";

const ResumeBuilder = dynamic(() => import("../components/ResumeBuilder"), {
  ssr: false,
});

export default function ResumeBuilderPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this resume builder completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our resume builder is 100% free. You can create and download your resume without any registration or payment."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this resume for government jobs in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this resume format is suitable for government job applications in India as well as private sector jobs."
        }
      },
      {
        "@type": "Question",
        "name": "Is this resume builder suitable for international jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can use this resume for international job applications including USA, UAE, Canada and other countries."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Free Resume Builder Online (India & Worldwide) | FreshJobs</title>

        <meta
          name="description"
          content="Create a professional resume online for free. Perfect for government jobs in India, private jobs, work from home jobs and international job applications."
        />

        <meta
          name="keywords"
          content="free resume builder online, resume for government job, CV maker free, resume for work from home job, professional resume builder"
        />

        <link
          rel="canonical"
          href="https://freshjobs.store/resume-builder"
        />

        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <main style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
        <h1>Free Resume Builder for Government & International Jobs</h1>

        <p>
          Build a professional resume in minutes using our free online resume
          builder. Whether you are applying for government jobs in India,
          private sector roles, work from home opportunities, or international
          jobs in countries like USA, UAE, and Canada, our tool helps you
          create a clean, job-ready CV instantly.
        </p>

        <ResumeBuilder />

        <section style={{ marginTop: "40px" }}>
          <h2>Why Use Our Free Resume Builder?</h2>
          <ul>
            <li>No registration required</li>
            <li>100% free resume download</li>
            <li>Professional and simple format</li>
            <li>Suitable for government & private jobs</li>
            <li>Optimized for international job applications</li>
          </ul>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Explore Latest Job Opportunities</h2>
          <ul>
            <li>
              <Link href="/category/government/india">
                Government Jobs in India
              </Link>
            </li>
            <li>
              <Link href="/work-from-home">
                Remote & Work From Home Jobs
              </Link>
            </li>
            <li>
              <Link href="/ai-jobs">
                AI & Tech Jobs Worldwide
              </Link>
            </li>
            <li>
              <Link href="/international-jobs">
                International Job Opportunities
              </Link>
            </li>
          </ul>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Frequently Asked Questions</h2>

          <h3>Is this resume builder completely free?</h3>
          <p>
            Yes, our resume builder is 100% free. You can create and download
            your resume without paying any fees.
          </p>

          <h3>Can I use this resume for government jobs?</h3>
          <p>
            Yes, the resume format works for government, private, remote and
            international job applications.
          </p>

          <h3>Is this resume builder suitable for international jobs?</h3>
          <p>
            Absolutely. You can use this CV for job applications in India,
            USA, UAE, Canada and other countries.
          </p>
        </section>
      </main>
    </>
  );
}