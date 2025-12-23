import Link from "next/link";

export default function CategoryGrid() {
  const categories = [
    { name: "IT", slug: "it" },
    { name: "Banking", slug: "banking" },
    { name: "BPO", slug: "bpo" },
    { name: "Govt Jobs", slug: "govt" },
    { name: "Sales", slug: "sales" },
    { name: "Engineering", slug: "engineering" }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map(cat => (
        <Link key={cat.slug} href={`/jobs/${cat.slug}/india`}>
          <a className="border p-4 text-center rounded hover:shadow-lg hover:bg-gray-50 block">
            {cat.name}
          </a>
        </Link>
      ))}
    </div>
  );
}