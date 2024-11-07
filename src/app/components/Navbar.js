// src/app/components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/posts" className="hover:underline">
          All Posts
        </Link>
        <Link href="/create-post" className="hover:underline">
          Create Post
        </Link>
      </div>
    </nav>
  );
}
