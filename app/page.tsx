"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { MemoHeader } from "@/components/memo-header"
import { MemoGrid } from "@/components/memo-grid"
import { MemoEditor } from "@/components/memo-editor"
import { CategoryFilter } from "@/components/category-filter"
import { useAuth } from "@/contexts/auth-context"
import { fetchMemos, insertMemo, updateMemo, deleteMemo } from "@/lib/memos-db"
import type { Memo, MemoColor } from "@/lib/memo-types"

const COLORS: MemoColor[] = ["yellow", "peach", "mint", "sky", "lavender"]

export default function MemoApp() {
  const { user } = useAuth()
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setMemos([])
      setLoading(false)
      return
    }
    fetchMemos(user.id)
      .then(setMemos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  const categories = useMemo(() => {
    const cats = new Set(memos.map((m) => m.category).filter(Boolean))
    return Array.from(cats).sort()
  }, [memos])

  const filteredMemos = useMemo(() => {
    let result = memos

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.content.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory) {
      result = result.filter((m) => m.category === selectedCategory)
    }

    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
  }, [memos, searchQuery, selectedCategory])

  const handleNewMemo = useCallback(() => {
    const newMemo: Memo = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      category: "",
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEditingMemo(newMemo)
  }, [])

  const handleSaveMemo = useCallback(
    async (memo: Memo) => {
      if (!user?.id) return
      if (!memo.title && !memo.content) return

      try {
        const existing = memos.find((m) => m.id === memo.id)
        if (existing) {
          const updated = await updateMemo(user.id, memo)
          setMemos((prev) =>
            prev.map((m) => (m.id === memo.id ? updated : m))
          )
        } else {
          const inserted = await insertMemo(user.id, memo)
          setMemos((prev) => [inserted, ...prev])
        }
      } catch (err) {
        console.error("메모 저장 실패:", err)
      }
    },
    [user?.id, memos]
  )

  const handleSelectMemo = useCallback(
    (id: string) => {
      const memo = memos.find((m) => m.id === id)
      if (memo) setEditingMemo(memo)
    },
    [memos]
  )

  const handleTogglePin = useCallback(
    async (id: string) => {
      if (!user?.id) return
      const memo = memos.find((m) => m.id === id)
      if (!memo) return

      const updated = { ...memo, pinned: !memo.pinned, updatedAt: new Date() }
      try {
        await updateMemo(user.id, updated)
        setMemos((prev) =>
          prev.map((m) => (m.id === id ? updated : m))
        )
      } catch (err) {
        console.error("고정 토글 실패:", err)
      }
    },
    [user?.id, memos]
  )

  const handleDeleteMemo = useCallback(
    async (id: string) => {
      if (!user?.id) return
      try {
        await deleteMemo(user.id, id)
        setMemos((prev) => prev.filter((m) => m.id !== id))
      } catch (err) {
        console.error("메모 삭제 실패:", err)
      }
    },
    [user?.id]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">메모 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MemoHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewMemo={handleNewMemo}
        memoCount={memos.length}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <MemoGrid
          memos={filteredMemos}
          onSelect={handleSelectMemo}
          onTogglePin={handleTogglePin}
          onDelete={handleDeleteMemo}
        />
      </main>

      {editingMemo && (
        <MemoEditor
          memo={editingMemo}
          onSave={handleSaveMemo}
          onClose={() => setEditingMemo(null)}
        />
      )}
    </div>
  )
}
