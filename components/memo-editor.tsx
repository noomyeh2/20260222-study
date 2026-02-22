"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Check, Palette, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Memo, MemoColor } from "@/lib/memo-types"

interface MemoEditorProps {
  memo: Memo
  onSave: (memo: Memo) => void
  onClose: () => void
}

const COLORS: { value: MemoColor; label: string; className: string }[] = [
  { value: "yellow", label: "노란색", className: "bg-memo-yellow" },
  { value: "peach", label: "복숭아", className: "bg-memo-peach" },
  { value: "mint", label: "민트", className: "bg-memo-mint" },
  { value: "sky", label: "하늘", className: "bg-memo-sky" },
  { value: "lavender", label: "라벤더", className: "bg-memo-lavender" },
]

const CATEGORIES = ["일상", "업무", "아이디어", "할 일", "독서", "기타"]

export function MemoEditor({ memo, onSave, onClose }: MemoEditorProps) {
  const [title, setTitle] = useState(memo.title)
  const [content, setContent] = useState(memo.content)
  const [color, setColor] = useState<MemoColor>(memo.color)
  const [category, setCategory] = useState(memo.category)
  const [showColors, setShowColors] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!memo.title && contentRef.current) {
      contentRef.current.focus()
    } else if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [memo.title])

  const handleSave = () => {
    onSave({
      ...memo,
      title,
      content,
      color,
      category,
      updatedAt: new Date(),
    })
    onClose()
  }

  const colorBgMap: Record<string, string> = {
    yellow: "bg-memo-yellow",
    peach: "bg-memo-peach",
    mint: "bg-memo-mint",
    sky: "bg-memo-sky",
    lavender: "bg-memo-lavender",
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg ${colorBgMap[color]} rounded-2xl shadow-2xl shadow-foreground/5 flex flex-col max-h-[85vh] border border-border/50`}>
        <div className="flex items-center justify-between p-4 border-b border-foreground/5">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowColors(!showColors)
                  setShowCategories(false)
                }}
                className="p-2 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="색상 선택"
              >
                <Palette className="w-5 h-5" />
              </button>
              {showColors && (
                <div className="absolute right-0 top-full mt-2 bg-card rounded-xl shadow-lg border border-border p-2 flex gap-1.5 z-10">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        setColor(c.value)
                        setShowColors(false)
                      }}
                      className={`w-7 h-7 rounded-full ${c.className} border-2 transition-all ${color === c.value ? "border-primary scale-110" : "border-transparent hover:scale-105"}`}
                      aria-label={c.label}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowCategories(!showCategories)
                  setShowColors(false)
                }}
                className="p-2 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="카테고리 선택"
              >
                <Tag className="w-5 h-5" />
              </button>
              {showCategories && (
                <div className="absolute right-0 top-full mt-2 bg-card rounded-xl shadow-lg border border-border p-1.5 z-10 min-w-28">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(category === cat ? "" : cat)
                        setShowCategories(false)
                      }}
                      className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${category === cat ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-foreground/5"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <Check className="w-4 h-4" />
              저장
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          <input
            ref={titleRef}
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-foreground text-lg font-semibold placeholder:text-muted-foreground/50 focus:outline-none w-full"
          />
          <textarea
            ref={contentRef}
            placeholder="메모를 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-transparent text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none w-full resize-none flex-1 min-h-[200px]"
          />
        </div>

        {category && (
          <div className="px-5 pb-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-foreground/5 text-xs font-medium text-muted-foreground">
              {category}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
