// src/app/create-post/page.js
"use client";

import CreatePostForm from "../components/CreatePostForm";

export default function CreatePostPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-6">Create a New Post</h1>
      <CreatePostForm />
    </div>
  );
}
