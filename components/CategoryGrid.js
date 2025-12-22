import Link from "next/link";

export default function CategoryGrid() {
  const categories = ["IT", "Banking", "BPO", "Govt Jobs", "Sales", "Engineering"];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map(cat => (
        <Link
          key={cat}
          href={`/jobs/${encodeURIComponent(cat.toLowerCase())}/india`}
        >
          <div className="border p-4 text-center rounded hover:shadow-lg cursor-pointer">
            {cat}
          </div>
        </Link>
      ))}
    </div>
  );
}