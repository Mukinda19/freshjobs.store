export default function CategoryGrid() {
  const categories = ["IT", "Banking", "BPO", "Govt Jobs", "Sales", "Engineering"];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map(cat => (
        <div key={cat} className="border p-4 text-center rounded hover:shadow-lg cursor-pointer">
          {cat}
        </div>
      ))}
    </div>
  );
}