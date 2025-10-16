import { Suspense } from "react"
import { Settings } from "@/types/settings"
import {
  getBlogPosts,
  getBlogCategories,
  getBlogTags,
} from "@/lib/blog"
import { BlogHeader } from "@/components/blog/blog-header"
import { BlogGrid } from "@/components/blog/blog-grid"
import { CategoryTabs } from "@/components/blog/category-tabs"
import { BlogSearch } from "@/components/blog/blog-search"

type PageProps = {
  searchParams: Promise<{
    category?: string
    search?: string
    tag?: string
  }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { category, search, tag } = params

  let posts = getBlogPosts()
  const categories = getBlogCategories()
  const tags = getBlogTags()

  // Filter by category
  if (category) {
    posts = posts.filter((post) => post.category === category)
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.tags.some((t) => t.toLowerCase().includes(searchLower))
    )
  }

  // Filter by tag
  if (tag) {
    posts = posts.filter((post) => post.tags.includes(tag))
  }

  return (
    <div className="container mx-auto max-w-7xl py-12">
      <BlogHeader />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-md bg-muted" />}>
            <BlogSearch />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        ))}
      </div>}>
        <CategoryTabs categories={categories} currentCategory={category} />
      </Suspense>

      {tag && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filtering by tag:
          </span>
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
            #{tag}
          </span>
        </div>
      )}

      <BlogGrid posts={posts} />

      {posts.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {posts.length} {posts.length === 1 ? "post" : "posts"}
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams
  const { category, search } = params

  let title = "Blog"
  let description = "Insights, tutorials, and updates from our team"

  if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Blog`
    description = `Browse ${category} posts and articles`
  }

  if (search) {
    title = `Search: ${search} - Blog`
    description = `Search results for "${search}"`
  }

  return {
    title: `${title} - ${Settings.title}`,
    description,
    openGraph: {
      title: `${title} - ${Settings.openGraph.title}`,
      description,
      url: `${Settings.metadataBase}/blog`,
      siteName: Settings.openGraph.siteName,
      type: "website",
      images: Settings.openGraph.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    twitter: {
      title: `${title} - ${Settings.twitter.title}`,
      description,
      card: Settings.twitter.card,
      site: Settings.twitter.site,
      images: Settings.twitter.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    alternates: {
      canonical: `${Settings.metadataBase}/blog`,
    },
  }
}

