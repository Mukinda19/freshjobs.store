export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left – Copyright */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} FreshJobs Store. All Rights Reserved.
        </p>

        {/* Center – Important Links */}
        <div className="flex flex-wrap justify-center gap-5 text-sm">
          <a href="/resume-builder" className="hover:text-white transition">
            Resume Builder
          </a>
          <a href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition">
            Terms & Conditions
          </a>
          <a href="/contact" className="hover:text-white transition">
            Contact
          </a>
        </div>

        {/* Right – Tagline */}
        <p className="text-sm italic text-center md:text-right">
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  )
}