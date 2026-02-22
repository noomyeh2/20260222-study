"use client"

import { Bookmark, Trash2, Pin, PinOff } from "lucide-react"
import type { Memo } from "@/lib/memo-types"

interface MemoCardProps {
  memo: Memo
  onSelect: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

const colorMap: Record<string, string> = {
  yellow: "bg-memo-yellow",
  peach: "bg-memo-peach",
  mint: "bg-memo-mint",
  sky: "bg-memo-sky",
  lavender: "bg-memo-lavender",
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
}

export function MemoCard({ memo, onSelect, onTogglePin, onDelete }: MemoCardProps) {
  const bgColor = colorMap[memo.color] || "bg-card"

  return (
    <article
      onClick={() => onSelect(memo.id)}
      className={`group relative ${bgColor} rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-border/50`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(memo.id)
        }
      }}
    >
      {memo.pinned && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Bookmark className="w-3.5 h-3.5 text-primary fill-primary" />
        </div>
      )}

      {memo.title && (
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 pr-6 line-clamp-2 text-balance">
          {memo.title}
        </h3>
      )}

      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-4">
        {memo.content || "빈 메모"}
      </p>

      {memo.category && (
        <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-foreground/5 text-xs font-medium text-muted-foreground">
          {memo.category}
        </span>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-foreground/5">
        <time className="text-[11px] text-muted-foreground/70" dateTime={memo.updatedAt.toISOString()}>
          {formatDate(memo.updatedAt)}
        </time>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin(memo.id)
            }}
            className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={memo.pinned ? "고정 해제" : "고정"}
          >
            {memo.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(memo.id)
            }}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
