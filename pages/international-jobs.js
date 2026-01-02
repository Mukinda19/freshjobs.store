import Head from "next/head"
import Link from "next/link"

export default function InternationalJobs() {
  return (
    <>
      <Head>
        <title>International Jobs | FreshJobs Store</title>
        <meta
          name="description"
          content="Latest international jobs including onsite and remote opportunities outside India."
        />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link> / International Jobs
        </nav>

        <h1 className="text-2xl font-bold mb-6">
          International Jobs (Outside India)
        </h1>

        <p className="text-gray-600 mb-8">
          This page lists jobs located outside India, including onsite and remote roles.
        </p>

        <div className="bg-white shadow rounded p-6">
          <p className="text-gray-700">
            International jobs feed integration coming next.
          </p>
        </div>
      </main>
    </>
  )
}