-- Supabase SQL Editor에서 실행하여 메모 테이블 생성
-- 사용자별 메모 저장을 위한 테이블

-- 메모 테이블 (auth.users와 연동)
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default '',
  content text not null default '',
  color text not null default 'yellow' check (color in ('yellow', 'peach', 'mint', 'sky', 'lavender')),
  category text not null default '',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS (Row Level Security) 활성화
alter table public.memos enable row level security;

-- 본인 메모만 조회/수정/삭제 가능
create policy "Users can view own memos"
  on public.memos for select
  using (auth.uid() = user_id);

create policy "Users can insert own memos"
  on public.memos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own memos"
  on public.memos for update
  using (auth.uid() = user_id);

create policy "Users can delete own memos"
  on public.memos for delete
  using (auth.uid() = user_id);

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger memos_updated_at
  before update on public.memos
  for each row
  execute function public.handle_updated_at();
