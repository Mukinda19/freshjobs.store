export default function CategoryGrid() {
  const categories = [
    { label: "IT Jobs", slug: "it" },
    { label: "Banking Jobs", slug: "banking" },
    { label: "BPO Jobs", slug: "bpo" },

    // ✅ Work From Home (STATIC PAGE)
    { label: "Work From Home Jobs", slug: "work-from-home-jobs", type: "static" },

    { label: "Government Jobs", slug: "govt-jobs" },
    { label: "Sales Jobs", slug: "sales" },
    { label: "Engineering Jobs", slug: "engineering" },
  ];

  const goToCategory = (cat) => {
    // 🔹 Static SEO pages
    if (cat.type === "static") {
      window.location.href = `/${cat.slug}`;
      return;
    }

    // 🔹 Dynamic category pages
    window.location.href = `/jobs/${cat.slug}/india?page=1`;
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