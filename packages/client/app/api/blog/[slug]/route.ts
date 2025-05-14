import { NextResponse } from "next/server";
import { getPostBySlug } from "../../../../lib/mdx";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const post = getPostBySlug(slug);

  if (!post) {
    return new NextResponse(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.json(post);
}
