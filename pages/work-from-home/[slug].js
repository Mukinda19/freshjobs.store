import Head from "next/head"
import Link from "next/link"

export default function WorkFromHomeJobDetail(props) {
  const job = props?.job || null
  const baseUrl =
    props?.baseUrl || "https://freshjobs.store"

  if (!job || typeof job !== "object") {
    return (
      <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
        <h1>Job not available</h1>
        <Link href="/work-from-home">
          ← Back to Jobs
        </Link>
      </div>
    )
  }

  const title = job?.title || "Work From Home Job"
  const description =
    (job?.description || "")
      .replace(/<[^>]*>?/gm, "")
      .slice(0, 300) || "Remote job opportunity"

  return (
    <>
      <Head>
        <title>{title} | FreshJobs.Store</title>
        <meta name="description" content={description} />
      </Head>

      <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
        <h1>{title}</h1>

        <p style={{ marginTop: "10px", color: "#666" }}>
          Source: {job?.source || "Verified Portal"}
        </p>

        <div style={{ marginTop: "20px" }}>
          {description}
        </div>

        {job?.link && (
          <div style={{ marginTop: "30px" }}>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "green",
                color: "white",
                padding: "12px 20px",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              Apply Now
            </a>
          </div>
        )}

        <div style={{ marginTop: "40px" }}>
          <Link href="/work-from-home">
            ← Back to Work From Home Jobs
          </Link>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://freshjobs.store"

    const res = await fetch(
      `${baseUrl}/api/search?category=work-from-home&limit=200`
    )

    const data = await res.json()

    let jobs = []

    if (Array.isArray(data)) jobs = data
    else if (Array.isArray(data?.jobs)) jobs = data.jobs
    else if (Array.isArray(data?.results)) jobs = data.results

    const job = jobs.find(
      (j) =>
        j?.slug === params?.slug ||
        j?.link?.includes(params?.slug)
    )

    return {
      props: {
        job: job || null,
        baseUrl,
      },
    }
  } catch (e) {
    return {
      props: {
        job: null,
      },
    }
  }
}