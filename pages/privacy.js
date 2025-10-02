import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | FreshJobs Store</title>
        <meta
          name="description"
          content="Read FreshJobs Store's privacy policy to understand how we protect your data and maintain your trust."
        />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4 leading-relaxed">
          At FreshJobs Store, your privacy is our priority. This Privacy Policy
          explains how we collect, use, and protect your personal information
          when you use our website.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc list-inside mb-4 leading-relaxed">
          <li>Basic personal details you may provide (e.g., name, email).</li>
          <li>
            Data collected automatically such as IP address, browser type, and
            usage activity.
          </li>
          <li>
            Job-related information if you choose to create or share your
            resume.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
        <p className="mb-4 leading-relaxed">
          We use your information only to improve your experience, provide
          relevant job updates, and maintain website security. We do not sell or
          rent your personal data to any third party.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Your Control</h2>
        <p className="leading-relaxed">
          You have full control over your personal data. If you wish to delete
          or modify your details, you can contact us anytime.
        </p>
      </main>
      <Footer />
    </>
  );
}
