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

  const handleClick = (slug) => {
    router.push(`/jobs/${slug}/india`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map(cat => (
        <div
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className="border p-4 text-center rounded hover:shadow-lg hover:bg-gray-50 cursor-pointer"
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
}