"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type CategoryTabsProps = {
  categories: string[]
  currentCategory?: string
}

export function CategoryTabs({
  categories,
  currentCategory,
}: CategoryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }

    params.delete("page") // Reset to page 1 when changing category

    const queryString = params.toString()
    router.push(`/blog${queryString ? `?${queryString}` : ""}`)
  }

  const allCategories = ["all", ...categories]

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const isActive =
          (category === "all" && !currentCategory) ||
          category === currentCategory

        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className="capitalize"
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}

