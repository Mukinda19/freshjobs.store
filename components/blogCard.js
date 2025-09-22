// components/BlogCard.js
import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
      <p className="text-gray-700 mb-3">{blog.excerpt}</p>
      <p className="text-sm text-gray-500 mb-2">By {blog.author} | {blog.date}</p>
      <Link href={`/blog/${blog.slug}`}>
        <a className="text-blue-600 hover:underline">Read More</a>
      </Link>
    </div>
  );
}