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

export const categories = [
  {
    label: "IT Jobs",
    slug: "it",
    icon: Cpu,
    keywords: [
      "software",
      "developer",
      "programmer",
      "web developer",
      "frontend",
      "backend",
      "full stack",
      "react",
      "node",
      "python",
      "java",
      "it support",
      "data analyst",
    ],
  },

  {
    label: "Banking Jobs",
    slug: "banking",
    icon: Landmark,
    keywords: [
      "bank",
      "banking",
      "loan officer",
      "relationship manager",
      "credit officer",
      "finance executive",
      "account officer",
    ],
  },

  {
    label: "BPO Jobs",
    slug: "bpo",
    icon: Headphones,
    keywords: [
      "bpo",
      "call center",
      "customer support",
      "customer service",
      "voice process",
      "non voice",
      "telecaller",
    ],
  },

  {
    label: "Government Jobs",
    slug: "govt-jobs",
    icon: ShieldCheck,
    keywords: [
      "government",
      "govt",
      "railway",
      "ssc",
      "upsc",
      "bank po",
      "bank clerk",
      "defence",
      "army",
      "navy",
      "air force",
      "public sector",
    ],
  },

  {
    label: "Sales Jobs",
    slug: "sales",
    icon: TrendingUp,
    keywords: [
      "sales",
      "sales executive",
      "field sales",
      "business development",
      "marketing executive",
      "relationship manager",
    ],
  },

  {
    label: "Engineering Jobs",
    slug: "engineering",
    icon: Briefcase,
    keywords: [
      "engineer",
      "mechanical engineer",
      "civil engineer",
      "electrical engineer",
      "production engineer",
      "site engineer",
    ],
  },

  {
    label: "Work From Home Jobs",
    slug: "work-from-home",
    icon: Home,
    keywords: [
      "work from home",
      "remote job",
      "remote work",
      "home based job",
      "online job",
      "freelance",
    ],
  },

  {
    label: "AI Jobs",
    slug: "ai",
    icon: Bot,
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml engineer",
      "ai developer",
      "chatgpt",
      "prompt engineer",
      "data scientist",
    ],
  },
];

export default function CategoryGrid() {
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