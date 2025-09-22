import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/"><h1 className="text-2xl font-bold">FreshJobs.Store</h1></Link>
      <nav className="space-x-4">
        <Link href="/government-jobs">Govt Jobs</Link>
        <Link href="/resume-builder">Resume Builder</Link>
        <Link href="/blog">Blog</Link>
      </nav>
    </header>
  );
}