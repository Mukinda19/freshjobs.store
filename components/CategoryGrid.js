import { useRouter } from "next/router";

export default function CategoryGrid() {
  const router = useRouter();

  const categories = [
    { label: "IT Jobs", slug: "it" },
    { label: "Banking Jobs", slug: "banking" },
    { label: "BPO Jobs", slug: "bpo" },

    // ✅ Static SEO Pages
    { label: "Work From Home Jobs", slug: "work-from-home-jobs", type: "static" },
    { label: "AI Jobs", slug: "ai-jobs", type: "static" },

    { label: "Government Jobs", slug: "govt-jobs" },
    { label: "Sales Jobs", slug: "sales" },
    { label: "Engineering Jobs", slug: "engineering" },
  ];

  const goToCategory = (cat) => {
    if (cat.type === "static") {
      router.push(`/${cat.slug}`);
      return;
    }

    router.push(`/jobs/${cat.slug}/india?page=1`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => goToCategory(cat)}
          className="border p-4 text-center rounded bg-white hover:shadow-lg transition font-medium"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}