import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo / Website Name */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
          FreshJobs Store
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition">Home</Link>
          <Link href="/about" className="hover:text-gray-300 transition">About</Link>
          <Link href="/government-jobs" className="hover:text-gray-300 transition">Government Jobs</Link>
          <Link href="/resume-builder" className="hover:text-gray-300 transition">Resume Builder</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition">Terms</Link>
          <Link href="/contact" className="hover:text-gray-300 transition">Contact</Link>
        </nav>

        {/* Mobile Menu (hamburger icon future ke liye) */}
        <div className="md:hidden">
          <button className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
