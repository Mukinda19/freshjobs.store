import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-5 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            FreshJobs
          </h3>

          <p className="text-sm text-gray-400">
            FreshJobs helps you discover the latest job openings across India and globally.
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

            <li><Link href="/jobs/all/mumbai" className="hover:text-white">Jobs in Mumbai</Link></li>
            <li><Link href="/jobs/all/delhi" className="hover:text-white">Jobs in Delhi</Link></li>
            <li><Link href="/jobs/all/pune" className="hover:text-white">Jobs in Pune</Link></li>
            <li><Link href="/jobs/all/bangalore" className="hover:text-white">Jobs in Bangalore</Link></li>
            <li><Link href="/jobs/all/hyderabad" className="hover:text-white">Jobs in Hyderabad</Link></li>
            <li><Link href="/jobs/all/chennai" className="hover:text-white">Jobs in Chennai</Link></li>
            <li><Link href="/jobs/all/kolkata" className="hover:text-white">Jobs in Kolkata</Link></li>
            <li><Link href="/jobs/all/ahmedabad" className="hover:text-white">Jobs in Ahmedabad</Link></li>
            <li><Link href="/jobs/all/noida" className="hover:text-white">Jobs in Noida</Link></li>
            <li><Link href="/jobs/all/gurgaon" className="hover:text-white">Jobs in Gurgaon</Link></li>

          </ul>
        </div>

        {/* Popular Job Searches */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Popular Job Searches
          </h4>

          <ul className="space-y-2 text-sm">

            <li><Link href="/jobs/title/software-developer" className="hover:text-white">Software Developer Jobs</Link></li>
            <li><Link href="/jobs/title/java-developer" className="hover:text-white">Java Developer Jobs</Link></li>
            <li><Link href="/jobs/title/python-developer" className="hover:text-white">Python Developer Jobs</Link></li>
            <li><Link href="/jobs/title/full-stack-developer" className="hover:text-white">Full Stack Developer Jobs</Link></li>
            <li><Link href="/jobs/title/web-developer" className="hover:text-white">Web Developer Jobs</Link></li>
            <li><Link href="/jobs/title/data-entry" className="hover:text-white">Data Entry Jobs</Link></li>
            <li><Link href="/jobs/title/work-from-home" className="hover:text-white">Work From Home Jobs</Link></li>
            <li><Link href="/jobs/title/remote" className="hover:text-white">Remote Jobs</Link></li>
            <li><Link href="/jobs/title/digital-marketing" className="hover:text-white">Digital Marketing Jobs</Link></li>
            <li><Link href="/jobs/title/graphic-designer" className="hover:text-white">Graphic Designer Jobs</Link></li>
            <li><Link href="/jobs/title/hr" className="hover:text-white">HR Jobs</Link></li>
            <li><Link href="/jobs/title/accountant" className="hover:text-white">Accountant Jobs</Link></li>
            <li><Link href="/jobs/title/back-office" className="hover:text-white">Back Office Jobs</Link></li>
            <li><Link href="/jobs/title/computer-operator" className="hover:text-white">Computer Operator Jobs</Link></li>
            <li><Link href="/jobs/title/customer-support" className="hover:text-white">Customer Support Jobs</Link></li>
            <li><Link href="/jobs/title/call-center" className="hover:text-white">Call Center Jobs</Link></li>
            <li><Link href="/jobs/title/project-manager" className="hover:text-white">Project Manager Jobs</Link></li>
            <li><Link href="/jobs/title/business-analyst" className="hover:text-white">Business Analyst Jobs</Link></li>
            <li><Link href="/jobs/title/data-analyst" className="hover:text-white">Data Analyst Jobs</Link></li>
            <li><Link href="/jobs/title/mechanical-engineer" className="hover:text-white">Mechanical Engineer Jobs</Link></li>
            <li><Link href="/jobs/title/civil-engineer" className="hover:text-white">Civil Engineer Jobs</Link></li>

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