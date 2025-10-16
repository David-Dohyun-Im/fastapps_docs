import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { BlogPost, BlogFrontmatter } from "@/types/blog"

const BLOG_PATH = path.join(process.cwd(), "contents/blog")

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_PATH)) {
    return []
  }

  const posts: BlogPost[] = []
  const categories = fs.readdirSync(BLOG_PATH)

  for (const category of categories) {
    const categoryPath = path.join(BLOG_PATH, category)
    const stat = fs.statSync(categoryPath)

    if (stat.isDirectory()) {
      const files = fs.readdirSync(categoryPath).filter((file) =>
        file.endsWith(".mdx")
      )

      for (const file of files) {
        const filePath = path.join(categoryPath, file)
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContents)
        const frontmatter = data as BlogFrontmatter

        // Skip unpublished posts
        if (frontmatter.published === false) {
          continue
        }

        const slug = file.replace(/\.mdx$/, "")
        const readingTime = calculateReadingTime(fileContents)

        posts.push({
          slug: `${category}/${slug}`,
          title: frontmatter.title,
          description: frontmatter.description,
          date: frontmatter.date,
          author: frontmatter.author,
          tags: frontmatter.tags || [],
          category: frontmatter.category || category,
          image: frontmatter.image,
          readingTime,
        })
      }
    }
  }

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getBlogPost(slug: string) {
  const filePath = path.join(BLOG_PATH, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)
  const frontmatter = data as BlogFrontmatter

  const readingTime = calculateReadingTime(fileContents)

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    author: frontmatter.author,
    tags: frontmatter.tags || [],
    category: frontmatter.category,
    image: frontmatter.image,
    content,
    readingTime,
  }
}

export function getBlogCategories(): string[] {
  if (!fs.existsSync(BLOG_PATH)) {
    return []
  }

  const categories = fs.readdirSync(BLOG_PATH).filter((file) => {
    const stat = fs.statSync(path.join(BLOG_PATH, file))
    return stat.isDirectory()
  })

  return categories
}

export function getBlogTags(): string[] {
  const posts = getBlogPosts()
  const tagsSet = new Set<string>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet).sort()
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const allPosts = getBlogPosts()
  const currentPost = allPosts.find((post) => post.slug === currentSlug)

  if (!currentPost) return []

  // Find posts with matching tags or category
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0

      // Same category gets high score
      if (post.category === currentPost.category) {
        score += 3
      }

      // Matching tags get points
      const matchingTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      )
      score += matchingTags.length

      return { post, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)

  return relatedPosts
}

