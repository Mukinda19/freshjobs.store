export default function CategoryGrid() {
  const categories = [
    { name: "IT", slug: "it" },
    { name: "Banking", slug: "banking" },
    { name: "BPO", slug: "bpo" },
    { name: "Govt Jobs", slug: "govt" },
    { name: "Sales", slug: "sales" },
    { name: "Engineering", slug: "engineering" }
  ];

  const goToPage = (slug) => {
    window.location.href = `/jobs/${slug}/india`;
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map(cat => (
        <div
          key={cat.slug}
          onClick={() => goToPage(cat.slug)}
          className="border p-4 rounded text-center hover:shadow-lg cursor-pointer"
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
}