"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Head from "next/head"

export default function Header() {
  const pathname = usePathname()

  const [isSticky, setIsSticky] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  /* ================= Sticky + Animation ================= */
  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 30)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ================= Active Menu ================= */
  const isActive = (path) =>
    pathname === path
      ? "text-green-400 font-semibold"
      : "hover:text-gray-300"

  /* ================= Breadcrumb SEO ================= */
  const pageNameMap = {
    "/": "Home",
    "/work-from-home": "Work From Home",
    "/work-from-home/high-paying": "High Paying WFH",
    "/ai-jobs": "AI Jobs",
    "/international-jobs": "International Jobs",
    "/government-jobs": "Government Jobs",
    "/resume-builder": "Resume Builder",
  }

  const breadcrumbName = pageNameMap[pathname]

  const breadcrumbSchema = breadcrumbName
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://freshjobs.store/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbName,
            item: `https://freshjobs.store${pathname}`,
          },
        ],
      }
    : null

  return (
    <>
      {/* SEO Breadcrumb */}
      {breadcrumbSchema && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />
        </Head>
      )}

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isSticky
            ? "bg-gray-900 shadow-xl translate-y-0"
            : "bg-gray-900/95"
        }`}
      >
        <div className="container mx-auto px-5 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide text-white"
          >
            FreshJobs Store
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 text-sm text-white">
            <Link href="/" className={isActive("/")}>Home</Link>

            <Link
              href="/work-from-home"
              className={isActive("/work-from-home")}
            >
              Work From Home
            </Link>

            <Link
              href="/work-from-home/high-paying"
              className="text-green-400 font-semibold hover:text-green-300"
            >
              High Paying WFH
            </Link>

            <Link href="/ai-jobs" className={isActive("/ai-jobs")}>
              AI Jobs
            </Link>

            <Link
              href="/international-jobs"
              className={isActive("/international-jobs")}
            >
              International Jobs
            </Link>

            <Link
              href="/government-jobs"
              className={isActive("/government-jobs")}
            >
              Government Jobs
            </Link>

            <Link
              href="/resume-builder"
              className={isActive("/resume-builder")}
            >
              Resume Builder
            </Link>

            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button className="hover:text-yellow-300">
                More ▾
              </button>

              {moreOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden text-sm animate-fade">
                  {[
                    ["Job Sources", "/job-sources"],
                    ["About", "/about"],
                    ["Contact", "/contact"],
                    ["Privacy", "/privacy"],
                    ["Terms", "/terms"],
                  ].map(([label, link]) => (
                    <Link
                      key={link}
                      href={link}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-gray-800 text-white px-6 py-5 space-y-4 text-sm transform transition-all duration-300 ${
            mobileOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {[
            ["Home", "/"],
            ["Work From Home", "/work-from-home"],
            ["High Paying WFH", "/work-from-home/high-paying"],
            ["AI Jobs", "/ai-jobs"],
            ["International Jobs", "/international-jobs"],
            ["Government Jobs", "/government-jobs"],
            ["Resume Builder", "/resume-builder"],
          ].map(([label, link]) => (
            <Link
              key={link}
              href={link}
              onClick={() => setMobileOpen(false)}
              className="block"
            >
              {label}
            </Link>
          ))}

          <hr className="border-gray-600" />

          {[
            ["Job Sources", "/job-sources"],
            ["About", "/about"],
            ["Contact", "/contact"],
            ["Privacy", "/privacy"],
            ["Terms", "/terms"],
          ].map(([label, link]) => (
            <Link
              key={link}
              href={link}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-300"
            >
              {label}
            </Link>
          ))}
        </div>
      </header>

      {/* Header height spacer */}
      <div className="h-[80px]" />
    </>
  )
}