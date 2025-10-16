export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  author: {
    name: string
    image?: string
  }
  tags: string[]
  category: string
  image?: string
  content?: string
  readingTime?: string
}

export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  author: {
    name: string
    image?: string
  }
  tags: string[]
  category: string
  image?: string
  published?: boolean
}

