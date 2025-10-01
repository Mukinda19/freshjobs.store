export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left side - Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Mukund Jagtap. All Rights Reserved.
        </p>

        {/* Center - Important Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition">Terms & Conditions</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
        </div>

        {/* Right side - Tagline */}
        <p className="text-sm mt-4 md:mt-0 italic">
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  )
}
