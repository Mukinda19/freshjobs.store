import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | FreshJobs Store</title>
        <meta
          name="description"
          content="Read the terms and conditions of using FreshJobs Store – your trusted job search platform."
        />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <p className="mb-4 leading-relaxed">
          By using FreshJobs Store, you agree to the following terms and
          conditions. Please read them carefully before accessing our services.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Website</h2>
        <p className="mb-4 leading-relaxed">
          You may use our website only for lawful job search and career
          development purposes. Misuse of the platform is strictly prohibited.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Job Listings</h2>
        <p className="mb-4 leading-relaxed">
          We aggregate job postings from multiple trusted sources. While we
          strive for accuracy, we are not responsible for errors, expired
          listings, or third-party job details.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Limitation of Liability</h2>
        <p className="mb-4 leading-relaxed">
          FreshJobs Store will not be liable for any losses or damages resulting
          from the use of our website, job applications, or third-party links.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Changes to Terms</h2>
        <p className="leading-relaxed">
          We may update these terms at any time. Continued use of our website
          means you accept the updated terms and conditions.
        </p>
      </main>
      <Footer />
    </>
  );
}
