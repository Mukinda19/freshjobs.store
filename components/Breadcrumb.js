import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-sm text-gray-500"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition"
                  >
                    {item.label}
                  </Link>
                  <span className="mx-2 text-gray-400">›</span>
                </>
              ) : (
                <span className="text-gray-700 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}