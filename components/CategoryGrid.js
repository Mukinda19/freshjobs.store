export default function CategoryGrid() {
  const categories = [
    { label: "IT Jobs", slug: "it" },
    { label: "Banking Jobs", slug: "banking" },
    { label: "BPO Jobs", slug: "bpo" },
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
          className="border p-4 text-center rounded bg-white hover:shadow-lg transition"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}