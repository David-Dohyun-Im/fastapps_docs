import { notFound } from "next/navigation"
import Link from "next/link"
import { FiArrowLeft, FiCalendar, FiClock, FiUser } from "react-icons/fi"
import { Settings } from "@/types/settings"
import { getBlogPost, getBlogPosts, getRelatedPosts } from "@/lib/blog"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import { BlogCard } from "@/components/blog/blog-card"
import { components } from "@/lib/components"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrism from "rehype-prism-plus"
import remarkGfm from "remark-gfm"

type PageProps = {
  params: Promise<{ slug: string[] }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug = [] } = await params
  const pathName = slug.join("/")

  const post = await getBlogPost(pathName)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(pathName)

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Link href="/blog">
        <Button variant="ghost" size="sm" className="group mb-8">
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back to blog
        </Button>
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="size-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <FiClock className="size-4" />
                {post.readingTime}
              </span>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <p className="mb-6 text-lg text-muted-foreground">
            {post.description}
          </p>

          <div className="flex items-center gap-3">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name}
                className="size-12 rounded-full"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <FiUser className="size-6 text-primary" />
              </div>
            )}
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">Author</div>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <Separator className="mt-8" />
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 overflow-hidden rounded-lg border">
            <img
              src={post.image}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <Typography>
          <MDXRemote
            source={post.content || ""}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "wrap",
                      properties: {
                        className: ["anchor"],
                      },
                    },
                  ],
                  rehypePrism,
                ],
              },
            }}
          />
        </Typography>

        <Separator className="my-12" />

        {/* Author bio at bottom */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name}
                className="size-16 rounded-full"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <FiUser className="size-8 text-primary" />
              </div>
            )}
            <div>
              <h3 className="mb-1 text-lg font-semibold">
                Written by {post.author.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Author and contributor
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug = [] } = await params
  const pathName = slug.join("/")

  const post = await getBlogPost(pathName)

  if (!post) {
    return null
  }

  return {
    title: `${post.title} - ${Settings.title}`,
    description: post.description,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: `${post.title} - ${Settings.openGraph.title}`,
      description: post.description,
      url: `${Settings.metadataBase}/blog/${pathName}`,
      siteName: Settings.openGraph.siteName,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: post.image
        ? [
            {
              url: post.image.startsWith("http")
                ? post.image
                : `${Settings.metadataBase}${post.image}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : Settings.openGraph.images.map((image) => ({
            ...image,
            url: `${Settings.metadataBase}${image.url}`,
          })),
    },
    twitter: {
      title: `${post.title} - ${Settings.twitter.title}`,
      description: post.description,
      card: "summary_large_image",
      site: Settings.twitter.site,
      images: post.image
        ? [
            {
              url: post.image.startsWith("http")
                ? post.image
                : `${Settings.metadataBase}${post.image}`,
              alt: post.title,
            },
          ]
        : Settings.twitter.images.map((image) => ({
            ...image,
            url: `${Settings.metadataBase}${image.url}`,
          })),
    },
    alternates: {
      canonical: `${Settings.metadataBase}/blog/${pathName}`,
    },
  }
}

export function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }))
}

