import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// DELETE request to delete all posts
export async function DELETE() {
  try {
    await prisma.post.deleteMany(); // Delete all posts
    return NextResponse.json(
      { message: "All posts deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete posts" },
      { status: 500 }
    );
  }
}
