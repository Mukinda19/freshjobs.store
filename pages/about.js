import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | FreshJobs Store</title>
        <meta
          name="description"
          content="Know more about FreshJobs Store – our mission, vision, and how we help job seekers find daily job opportunities."
        />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">About FreshJobs Store</h1>
        <p className="mb-4 leading-relaxed">
          FreshJobs Store is a professional job portal designed to help job
          seekers connect with the latest opportunities across government and
          private sectors. Our mission is simple – to make job searching easier,
          faster, and more reliable.
        </p>
        <p className="mb-4 leading-relaxed">
          Unlike traditional job boards, we bring you updated listings from top
          job portals like Naukri, Shine, Indeed, and government websites – all
          in one place. You no longer need to waste hours browsing multiple
          websites; we deliver everything directly here.
        </p>
        <p className="leading-relaxed">
          We are committed to helping every individual build a brighter career.
          Whether you are a fresher or an experienced professional, FreshJobs
          Store ensures that you never miss an opportunity.
        </p>
      </main>
      <Footer />
    </>
  );
}
