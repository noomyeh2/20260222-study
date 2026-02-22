"use client"

import type { Memo } from "@/lib/memo-types"
import { MemoCard } from "@/components/memo-card"
import { FileText } from "lucide-react"

interface MemoGridProps {
  memos: Memo[]
  onSelect: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

export function MemoGrid({ memos, onSelect, onTogglePin, onDelete }: MemoGridProps) {
  const pinnedMemos = memos.filter((m) => m.pinned)
  const otherMemos = memos.filter((m) => !m.pinned)

  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-foreground font-medium mb-1">메모가 없습니다</h3>
        <p className="text-muted-foreground text-sm">
          {'새로운 메모를 추가해 보세요!'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {pinnedMemos.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            고정된 메모
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                onSelect={onSelect}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {otherMemos.length > 0 && (
        <section>
          {pinnedMemos.length > 0 && (
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              다른 메모
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                onSelect={onSelect}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
