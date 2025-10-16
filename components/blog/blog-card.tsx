import Link from "next/link"
import { BlogPost } from "@/types/blog"
import { Button } from "@/components/ui/button"
import { FiArrowRight, FiCalendar, FiClock, FiUser } from "react-icons/fi"

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="overflow-hidden">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <FiCalendar className="size-3" />
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <FiClock className="size-3" />
              {post.readingTime}
            </span>
          )}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="group-hover:text-primary"
        >
          <h3 className="mb-2 text-xl font-semibold transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
          {post.description}
        </p>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name}
                className="size-8 rounded-full"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <FiUser className="size-4 text-primary" />
              </div>
            )}
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>

          <Link href={`/blog/${post.slug}`}>
            <Button variant="ghost" size="sm" className="group/btn">
              Read more
              <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

