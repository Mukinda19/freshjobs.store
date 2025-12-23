export default function CategoryGrid() {
  const categories = [
    { label: "IT", slug: "it" },
    { label: "Banking", slug: "banking" },
    { label: "BPO", slug: "bpo" },
    { label: "Govt Jobs", slug: "govt-jobs" },
    { label: "Sales", slug: "sales" },
    { label: "Engineering", slug: "engineering" },
  ];

  const goToCategory = (slug) => {
    window.location.href = `/jobs/${slug}/india`;
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => goToCategory(cat.slug)}
          className="border p-4 text-center rounded hover:shadow-lg cursor-pointer bg-white"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}