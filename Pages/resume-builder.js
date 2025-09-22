// pages/resume-builder.js
import dynamic from "next/dynamic";
import Head from "next/head";

const ResumeBuilder = dynamic(() => import("../components/ResumeBuilder"), {
  ssr: false,
});

export default function ResumeBuilderPage() {
  return (
    <>
      <Head>
        <title>Stylish Resume Builder | FreshJobs</title>
      </Head>
      <ResumeBuilder />
    </>
  );
}
