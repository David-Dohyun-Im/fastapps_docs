import { getBlogPosts, getBlogPost } from "@/lib/blog"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (slug) {
    const post = await getBlogPost(slug)
    return NextResponse.json({ slug, post })
  }

  const posts = getBlogPosts()
  return NextResponse.json({
    count: posts.length,
    posts: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
    })),
  })
}

