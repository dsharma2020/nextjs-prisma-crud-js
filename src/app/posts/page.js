"use client"; // This allows client-side rendering for interactive operations

import Link from "next/link";
import { useState, useEffect } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  // Fetch all posts on page load
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  // Delete individual post by ID
  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmed) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== postId));
        } else {
          console.error("Failed to delete post");
        }
      } catch (error) {
        console.error("Failed to delete post", error);
      }
    }
  };

  // Delete all posts
  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL posts? This action cannot be undone."
    );

    if (confirmed) {
      try {
        const response = await fetch("/api/posts", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setPosts([]); // Clear all posts from UI state after deletion
          alert("All posts have been deleted successfully");
        } else {
          console.error("Failed to delete all posts");
          alert("Failed to delete all posts");
        }
      } catch (error) {
        console.error("Failed to delete all posts", error);
        alert("An error occurred while deleting all posts");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-6">All Posts</h1>

      {/* Delete All Posts Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDeleteAll}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
        >
          Delete All Posts
        </button>
      </div>

      {/* Display Posts List */}
      <div className="mt-8">
        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="p-4 bg-white shadow-md rounded-md">
                <div className="flex justify-between items-center">
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-2xl font-semibold text-indigo-600 hover:underline cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700 mt-2">{post.content}</p>
                <small className="text-gray-500 mt-4 block">
                  Published: {post.published ? "Yes" : "No"}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
