import { useRouter } from "next/router";

export default function CategoryGrid() {
  const router = useRouter();

  const categories = [
    { name: "IT", slug: "it" },
    { name: "Banking", slug: "banking" },
    { name: "BPO", slug: "bpo" },
    { name: "Govt Jobs", slug: "govt" },
    { name: "Sales", slug: "sales" },
    { name: "Engineering", slug: "engineering" }
  ];

  const handleClick = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    router.replace(`/jobs/${slug}/india`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map(cat => (
        <button
          key={cat.slug}
          type="button"
          onClick={(e) => handleClick(e, cat.slug)}
          className="border p-4 rounded text-center hover:shadow-lg hover:bg-gray-50"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}