import { createClient } from "@/lib/supabase/client"
import type { Memo, MemoColor } from "@/lib/memo-types"

interface MemoRow {
  id: string
  user_id: string
  title: string
  content: string
  color: string
  category: string
  pinned: boolean
  created_at: string
  updated_at: string
}

function rowToMemo(row: MemoRow): Memo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    color: row.color as MemoColor,
    category: row.category,
    pinned: row.pinned,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function fetchMemos(userId: string): Promise<Memo[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToMemo)
}

export async function insertMemo(userId: string, memo: Memo): Promise<Memo> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("memos")
    .insert({
      id: memo.id,
      user_id: userId,
      title: memo.title,
      content: memo.content,
      color: memo.color,
      category: memo.category,
      pinned: memo.pinned,
    })
    .select()
    .single()

  if (error) throw error
  return rowToMemo(data)
}

export async function updateMemo(userId: string, memo: Memo): Promise<Memo> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("memos")
    .update({
      title: memo.title,
      content: memo.content,
      color: memo.color,
      category: memo.category,
      pinned: memo.pinned,
      updated_at: memo.updatedAt.toISOString(),
    })
    .eq("id", memo.id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error
  return rowToMemo(data)
}

export async function deleteMemo(userId: string, memoId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("memos")
    .delete()
    .eq("id", memoId)
    .eq("user_id", userId)

  if (error) throw error
}
