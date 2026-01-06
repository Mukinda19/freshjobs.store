import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left – Copyright */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} FreshJobs.Store. All Rights Reserved.
        </p>

        {/* Center – Footer Links */}
        <nav className="flex flex-wrap justify-center gap-5 text-sm">
          <Link href="/resume-builder" className="hover:text-white transition">
            Resume Builder
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms & Conditions
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </nav>

        {/* Right – Tagline */}
        <p className="text-sm italic text-center md:text-right">
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  )
}