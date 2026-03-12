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
    description:
      "Software developer, web developer, frontend developer, backend developer, full stack developer, React developer, Node.js developer, Python developer, Java developer, software engineer, IT support, tech lead and programming jobs.",
  },

  {
    label: "Banking Jobs",
    slug: "banking",
    icon: Landmark,
    description:
      "Bank jobs, banking careers, bank PO, bank clerk, relationship manager, loan officer, finance executive, credit officer, financial analyst and banking sector opportunities.",
  },

  {
    label: "BPO Jobs",
    slug: "bpo",
    icon: Headphones,
    description:
      "BPO jobs, call center jobs, customer support jobs, customer service jobs, voice process, non voice process, telecaller jobs, chat support and process associate roles.",
  },

  {
    label: "Government Jobs",
    slug: "govt-jobs",
    icon: ShieldCheck,
    description:
      "Latest government jobs in India including railway jobs, SSC jobs, UPSC recruitment, defence jobs, army jobs, navy jobs, air force jobs, PSU jobs and other public sector openings.",
  },

  {
    label: "Sales Jobs",
    slug: "sales",
    icon: TrendingUp,
    description:
      "Sales executive jobs, field sales jobs, business development jobs, marketing executive roles, relationship manager jobs, territory manager and sales officer careers.",
  },

  {
    label: "Engineering Jobs",
    slug: "engineering",
    icon: Briefcase,
    description:
      "Engineering jobs including mechanical engineer, civil engineer, electrical engineer, production engineer, design engineer, maintenance engineer and site engineer roles.",
  },

  {
    label: "Work From Home Jobs",
    slug: "work-from-home",
    icon: Home,
    description:
      "Remote jobs, work from home jobs, freelance jobs, home based jobs, remote support jobs, virtual assistant jobs and global remote job opportunities.",
  },

  {
    label: "AI Jobs",
    slug: "ai-jobs",
    icon: Bot,
    description:
      "Artificial intelligence jobs, machine learning engineer jobs, ML engineer roles, AI developer jobs, generative AI jobs, prompt engineer jobs, data scientist and deep learning careers.",
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

          /* SPECIAL CATEGORY */

          const isSpecial =
            cat.slug === "work-from-home" ||
            cat.slug === "ai-jobs";

          const link = isSpecial
            ? `/jobs/${cat.slug}`
            : `/jobs/${cat.slug}/india`;

          return (

            <Link
              key={cat.slug}
              href={link}
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