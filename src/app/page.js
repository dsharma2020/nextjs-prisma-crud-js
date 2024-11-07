// src/app/page.js
export default function HomePage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Blog App</h1>
      <p className="text-lg text-gray-700 mb-8">
        Create and view posts easily with our simple interface.
      </p>
      <div className="flex justify-center space-x-4">
        <a
          href="/create-post"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Create Post
        </a>
        <a
          href="/posts"
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
        >
          View All Posts
        </a>
      </div>
    </div>
  );
}
