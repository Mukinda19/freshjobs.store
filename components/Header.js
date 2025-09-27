// components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">
          <Link href="/">FreshJobs Store</Link>
        </h1>
        <nav className="flex space-x-6 text-lg">
          <Link href="/" className="hover:text-yellow-300">Home</Link>
          <Link href="/about" className="hover:text-yellow-300">About</Link>
          <Link href="/contact" className="hover:text-yellow-300">Contact</Link>
          <Link href="/government-jobs" className="hover:text-yellow-300">Government Jobs</Link>
          <Link href="/resume-biildee" className="hover:text-yellow-300">Resume Builder</Link>
          <Link href="/privacy" className="hover:text-yellow-300">Privacy</Link>
          <Link href="/terms" className="hover:text-yellow-300">Terms</Link>
        </nav>
      </div>
    </header>
  );
}
