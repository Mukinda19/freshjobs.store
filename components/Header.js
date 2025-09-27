import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Government Jobs", path: "/government-jobs" },
    { name: "Resume Builder", path: "/resume-builder" },
    { name: "Privacy", path: "/privacy" },
    { name: "Terms", path: "/terms" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-700 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand / Logo */}
        <Link href="/" className="text-4xl font-extrabold tracking-wider text-white hover:text-yellow-300 transition-colors">
          FreshJobs Store
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-lg font-semibold text-white">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="hover:text-yellow-300 hover:underline underline-offset-4 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col space-y-1.5 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <span className="w-7 h-0.5 bg-white"></span>
          <span className="w-7 h-0.5 bg-white"></span>
          <span className="w-7 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-indigo-800 px-6 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="block py-2 text-white text-lg font-medium hover:text-yellow-300 hover:underline underline-offset-4"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
