import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Ensure this path is correct

// GET request to fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// DELETE request to delete all posts
export async function DELETE() {
  try {
    await prisma.post.deleteMany(); // Delete all posts from the database
    return NextResponse.json(
      { message: "All posts deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete all posts" },
      { status: 500 }
    );
  }
}
