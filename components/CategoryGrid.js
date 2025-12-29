export default function CategoryGrid() {
  const categories = [
    { label: "IT Jobs", slug: "it" },
    { label: "Banking Jobs", slug: "banking" },
    { label: "BPO Jobs", slug: "bpo" },

    // 🔹 NEW: Work From Home Jobs
    { label: "Work From Home Jobs", slug: "work-from-home" },

    { label: "Government Jobs", slug: "govt-jobs" },
    { label: "Sales Jobs", slug: "sales" },
    { label: "Engineering Jobs", slug: "engineering" },
  ];

  const goToCategory = (slug) => {
    window.location.href = `/jobs/${slug}/india?page=1`;
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => goToCategory(cat.slug)}
          className="border p-4 text-center rounded bg-white hover:shadow-lg transition font-medium"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}