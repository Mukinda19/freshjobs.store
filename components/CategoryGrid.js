import Link from "next/link";

export default function CategoryGrid() {
  const categories = [
    // 🔹 Dynamic Category Pages
    { label: "IT Jobs", slug: "it", type: "dynamic" },
    { label: "Banking Jobs", slug: "banking", type: "dynamic" },
    { label: "BPO Jobs", slug: "bpo", type: "dynamic" },
    { label: "Government Jobs", slug: "govt-jobs", type: "dynamic" },
    { label: "Sales Jobs", slug: "sales", type: "dynamic" },
    { label: "Engineering Jobs", slug: "engineering", type: "dynamic" },

    // 🔹 High CPC / Static SEO Pages
    { label: "Work From Home Jobs", slug: "work-from-home", type: "dynamic" },
    { label: "AI Jobs", slug: "ai", type: "dynamic" },
    { label: "International Jobs", slug: "international", type: "dynamic" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const href =
          cat.type === "dynamic"
            ? `/jobs/${cat.slug}/india`
            : `/${cat.slug}`;

        return (
          <Link
            key={cat.slug}
            href={href}
            className="border p-4 text-center rounded bg-white hover:shadow-lg transition font-medium"
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}