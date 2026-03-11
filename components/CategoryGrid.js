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

/* -------- CATEGORY MASTER LIST -------- */

export const categories = [
  {
    label: "IT Jobs",
    slug: "it",
    icon: Cpu,
    description: "Software development, programming and IT support jobs",
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
      "software engineer",
      "tech lead"
    ],
  },

  {
    label: "Banking Jobs",
    slug: "banking",
    icon: Landmark,
    description: "Banking, finance and financial services jobs",
    keywords: [
      "bank",
      "banking",
      "loan officer",
      "relationship manager",
      "credit officer",
      "finance executive",
      "account officer",
      "bank po",
      "bank clerk",
      "financial analyst"
    ],
  },

  {
    label: "BPO Jobs",
    slug: "bpo",
    icon: Headphones,
    description: "Call center, customer support and BPO jobs",
    keywords: [
      "bpo",
      "call center",
      "customer support",
      "customer service",
      "voice process",
      "non voice",
      "telecaller",
      "process associate",
      "chat support"
    ],
  },

  {
    label: "Government Jobs",
    slug: "govt-jobs",
    icon: ShieldCheck,
    description: "Latest government sector jobs in India",
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
      "psu"
    ],
  },

  {
    label: "Sales Jobs",
    slug: "sales",
    icon: TrendingUp,
    description: "Sales, marketing and business development jobs",
    keywords: [
      "sales",
      "sales executive",
      "field sales",
      "business development",
      "marketing executive",
      "relationship manager",
      "sales officer",
      "territory manager"
    ],
  },

  {
    label: "Engineering Jobs",
    slug: "engineering",
    icon: Briefcase,
    description: "Mechanical, civil, electrical and engineering jobs",
    keywords: [
      "engineer",
      "mechanical engineer",
      "civil engineer",
      "electrical engineer",
      "production engineer",
      "site engineer",
      "design engineer",
      "maintenance engineer"
    ],
  },

  {
    label: "Work From Home Jobs",
    slug: "work-from-home",
    icon: Home,
    description: "Remote and work from home job opportunities",
    keywords: [
      "work from home",
      "remote job",
      "remote work",
      "home based job",
      "online job",
      "freelance",
      "remote support",
      "virtual assistant"
    ],
  },

  {
    label: "AI Jobs",
    slug: "ai",
    icon: Bot,
    description: "Artificial intelligence and machine learning jobs",
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml engineer",
      "ai developer",
      "chatgpt",
      "prompt engineer",
      "data scientist",
      "deep learning"
    ],
  },
];

/* -------- CATEGORY GRID UI -------- */

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
              title={cat.label}
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