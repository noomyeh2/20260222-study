export type MemoColor = "yellow" | "peach" | "mint" | "sky" | "lavender"

export interface Memo {
  id: string
  title: string
  content: string
  color: MemoColor
  category: string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}
