export default function CategoryGrid() {
  const categories = [
    { label: "IT Jobs", slug: "it", type: "category" },
    { label: "Banking Jobs", slug: "banking", type: "category" },
    { label: "BPO Jobs", slug: "bpo", type: "category" },

    // 🔹 Work From Home = SEO Page (NOT category)
    {
      label: "Work From Home Jobs",
      slug: "work-from-home-jobs",
      type: "page",
    },

    { label: "Government Jobs", slug: "govt-jobs", type: "category" },
    { label: "Sales Jobs", slug: "sales", type: "category" },
    { label: "Engineering Jobs", slug: "engineering", type: "category" },
  ];

  const goToCategory = (cat) => {
    if (cat.type === "page") {
      window.location.href = `/${cat.slug}`;
    } else {
      window.location.href = `/jobs/${cat.slug}/india?page=1`;
    }
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