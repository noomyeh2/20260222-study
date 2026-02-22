"use client"

import type { MemoColor } from "@/lib/memo-types"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="카테고리 필터">
      <button
        onClick={() => onSelectCategory("")}
        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
          selectedCategory === ""
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === cat
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  )
}
