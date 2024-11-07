# Next.js CRUD Application with Prisma API Walkthrough

This guide will walk you through building a **CRUD** application using **Next.js** with **Prisma** as the ORM for managing a **PostgreSQL** database. We'll focus on implementing basic CRUD operations such as **creating**, **reading**, and **deleting** posts.

### Table of Contents
1. Project Setup
2. Creating API Routes
3. Creating Frontend Components
4. Implementing CRUD Features
5. Testing the Application

## 1. Project Setup
### 1.1 Installing Dependencies

First, we need to set up our Next.js project and install the necessary dependencies.

- Create a Next.js project by running the command:
  ```bash
  npx create-next-app@latest nextjs-crud-app
  ```
- Navigate into your project directory:
  ```bash
  cd nextjs-crud-app
  ```
- Install Prisma and its required dependencies:
  ```bash
  npm install @prisma/client
  npm install prisma --save-dev
  ```
- Initialize Prisma in your project:
  ```bash
  npx prisma init
  ```
  This will create a `prisma` folder containing `schema.prisma`. 

- Configure `schema.prisma` to point to your PostgreSQL database.

### 1.2 Configuring the Prisma Schema

Update your **Prisma schema** in `prisma/schema.prisma` to define the `Post` model.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- Migrate your schema to the database by running:
  ```bash
  npx prisma migrate dev --name init
  ```

### 1.3 Create a Prisma Client
Create a `lib/prisma.js` file to initialize the **Prisma client**.

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

This file will be used to access the database in your API routes.

## 2. Creating API Routes

### 2.1 Creating an API to Handle CRUD Operations
In this example, we create API routes for handling **GET**, **POST**, and **DELETE** requests for the posts.

#### `/src/app/api/posts/route.js`

```javascript
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Make sure the import path is correct

// GET request to fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST request to create a new post
export async function POST(request) {
  try {
    const body = await request.json();
    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// DELETE request to delete all posts
export async function DELETE() {
  try {
    await prisma.post.deleteMany(); // Delete all posts from the database
    return NextResponse.json({ message: 'All posts deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete all posts' }, { status: 500 });
  }
}
```

### Explanation
- **GET Method**: Fetches all posts from the database using Prisma's `findMany()` method.
- **POST Method**: Adds a new post to the database by extracting the title and content from the request body.
- **DELETE Method**: Deletes all posts from the database using `deleteMany()`.

## 3. Creating Frontend Components

### 3.1 Creating the Create Post Form Component
The **CreatePostForm** component will allow users to add new posts.

#### `/src/app/components/CreatePostForm.js`
```jsx
'use client';

import { useState } from 'react';

export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        alert('Post created successfully!');
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create New Post</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
      >
        Create Post
      </button>
    </form>
  );
}
```

### Explanation
- **Form State Management**: Using React hooks (`useState`) to manage the form's `title` and `content` fields.
- **Form Submission**: On form submit, a `POST` request is sent to `/api/posts` to create a new post. If successful, the form is cleared.

## 4. Implementing CRUD Features

### 4.1 Displaying and Deleting Posts
The **All Posts** page will display all posts and allow the user to delete individual posts or delete all posts.

#### `/src/app/posts/page.js`
```jsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Are you sure you want to delete ALL posts?');
    if (confirmed) {
      try {
        const response = await fetch('/api/posts', {
          method: 'DELETE',
        });
        if (response.ok) {
          setPosts([]);
          alert('All posts have been deleted successfully');
        } else {
          alert('Failed to delete all posts');
        }
      } catch (error) {
        console.error('Failed to delete all posts', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-6">All Posts</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDeleteAll}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
        >
          Delete All Posts
        </button>
      </div>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 bg-white shadow-md rounded-md">
            <div className="flex justify-between items-center">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-2xl font-semibold text-indigo-600 hover:underline cursor-pointer">
                  {post.title}
                </h2>
              </Link>
            </div>
            <p className="text-gray-700 mt-2">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Explanation
- **Fetching Posts**: Posts are fetched from `/api/posts` and displayed in a list.
- **Deleting All Posts**: A button is provided to delete all posts, with a confirmation dialog to avoid accidental deletion.

## 5. Testing the Application
1. **Run the Development Server**:
   ```bash
   npm run dev
   ```
2. **Navigate to Pages**:
   - `/create-post`: To create a new post.
   - `/posts`: To view all posts, delete individual posts, or delete all posts.
3. **Verify CRUD Functionality**:
   - Create a post, check the list, and verify that posts are being fetched and deleted correctly.

## Conclusion
This guide walked you through setting up a **Next.js** application with **Prisma** and **PostgreSQL** for managing CRUD operations. You learned to create API routes, build interactive front-end components, and implement full CRUD features. Let me know if you have any questions or need further assistance!
