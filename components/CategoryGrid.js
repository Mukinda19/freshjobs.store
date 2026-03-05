import Link from "next/link";
import {
  Briefcase,
  Landmark,
  Headphones,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Home,
  Bot,
} from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    {
      label: "IT Jobs",
      slug: "it",
      icon: Cpu,
    },
    {
      label: "Banking Jobs",
      slug: "banking",
      icon: Landmark,
    },
    {
      label: "BPO Jobs",
      slug: "bpo",
      icon: Headphones,
    },
    {
      label: "Government Jobs",
      slug: "govt-jobs",
      icon: ShieldCheck,
    },
    {
      label: "Sales Jobs",
      slug: "sales",
      icon: TrendingUp,
    },
    {
      label: "Engineering Jobs",
      slug: "engineering",
      icon: Briefcase,
    },
    {
      label: "Work From Home Jobs",
      slug: "work-from-home",
      icon: Home,
    },
    {
      label: "AI Jobs",
      slug: "ai",
      icon: Bot,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Browse Jobs by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <Link
              key={cat.slug}
              href={`/jobs/${cat.slug}/india`}
              className="flex flex-col items-center justify-center bg-white border rounded-xl p-5 hover:shadow-xl hover:border-blue-500 transition group"
            >
              <Icon
                size={32}
                className="text-blue-600 mb-2 group-hover:scale-110 transition"
              />

              <span className="font-semibold text-gray-800 text-center">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}