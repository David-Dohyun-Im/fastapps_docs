"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { FiSearch } from "react-icons/fi"

export function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    params.delete("page") // Reset to page 1 when searching

    const queryString = params.toString()
    const timeoutId = setTimeout(() => {
      router.push(`/blog${queryString ? `?${queryString}` : ""}`)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, router, searchParams])

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search blog posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}

