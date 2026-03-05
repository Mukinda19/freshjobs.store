import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            FreshJobs
          </h3>

          <p className="text-sm text-gray-400">
            FreshJobs helps you discover the latest job openings across India.
            Find IT jobs, banking jobs, BPO jobs, engineering jobs and work from
            home opportunities.
          </p>
        </div>

        {/* Job Categories */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Job Categories
          </h4>

          <ul className="space-y-2 text-sm">

            <li>
              <Link href="/jobs/it/india" className="hover:text-white">
                IT Jobs
              </Link>
            </li>

            <li>
              <Link href="/jobs/banking/india" className="hover:text-white">
                Banking Jobs
              </Link>
            </li>

            <li>
              <Link href="/jobs/bpo/india" className="hover:text-white">
                BPO Jobs
              </Link>
            </li>

            <li>
              <Link href="/jobs/sales/india" className="hover:text-white">
                Sales Jobs
              </Link>
            </li>

            <li>
              <Link href="/jobs/engineering/india" className="hover:text-white">
                Engineering Jobs
              </Link>
            </li>

            <li>
              <Link href="/jobs/govt-jobs/india" className="hover:text-white">
                Government Jobs
              </Link>
            </li>

          </ul>
        </div>

        {/* Popular Locations */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Popular Locations
          </h4>

          <ul className="space-y-2 text-sm">

            <li>
              <Link href="/jobs/all/mumbai" className="hover:text-white">
                Jobs in Mumbai
              </Link>
            </li>

            <li>
              <Link href="/jobs/all/delhi" className="hover:text-white">
                Jobs in Delhi
              </Link>
            </li>

            <li>
              <Link href="/jobs/all/pune" className="hover:text-white">
                Jobs in Pune
              </Link>
            </li>

            <li>
              <Link href="/jobs/all/bangalore" className="hover:text-white">
                Jobs in Bangalore
              </Link>
            </li>

            <li>
              <Link href="/jobs/all/hyderabad" className="hover:text-white">
                Jobs in Hyderabad
              </Link>
            </li>

          </ul>
        </div>

        {/* Important Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Important
          </h4>

          <ul className="space-y-2 text-sm">

            <li>
              <Link href="/resume-builder" className="hover:text-white">
                Free Resume Builder
              </Link>
            </li>

            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>

          </ul>
        </div>

      </div>

      {/* Bottom Bar */}

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">

        © {new Date().getFullYear()} FreshJobs.Store — All Rights Reserved

      </div>

    </footer>
  );
}