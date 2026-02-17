import Head from "next/head"
import Link from "next/link"

export default function JobDetailPage({ job, categorySlug }) {

  const safeJob = job || {}

  const readableCategory = categorySlug
    ? categorySlug.replace(/-/g, " ")
    : "jobs"

  const title = safeJob.title || "Work From Home Job"

  const description = safeJob.description
    ? safeJob.description.replace(/<[^>]*>?/gm, "").slice(0, 300)
    : "Remote job opportunity"

  if (!job) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Job Not Found</h1>
        <Link href="/work-from-home">
          ← Back to {readableCategory}
        </Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{title} | FreshJobs.Store</title>
        <meta name="description" content={description} />
      </Head>

      <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
        <h1>{title}</h1>

        {safeJob.source && (
          <p style={{ color: "#666" }}>
            Source: {safeJob.source}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          {description}
        </div>

        {safeJob.link && (
          <div style={{ marginTop: "30px" }}>
            <a
              href={safeJob.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "green",
                color: "white",
                padding: "12px 20px",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Apply Now
            </a>
          </div>
        )}

        <div style={{ marginTop: "40px" }}>
          <Link href="/work-from-home">
            ← Back to {readableCategory}
          </Link>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(
      `${baseUrl}/api/search?category=work-from-home&limit=200`
    )

    const data = await res.json()

    const jobs =
      Array.isArray(data)
        ? data
        : data?.jobs || data?.results || []

    const job =
      jobs.find(j => j?.slug === params?.slug) || null

    return {
      props: {
        job,
        categorySlug: "work-from-home"
      }
    }
  } catch (error) {
    return {
      props: {
        job: null,
        categorySlug: "work-from-home"
      }
    }
  }
}