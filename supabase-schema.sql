-- 감정 거래소 리더보드 테이블 (Supabase SQL Editor에서 실행)
-- 1. Table 생성
create table if not exists public.leaderboard (
  user_id text primary key,
  nickname text not null,
  yield_percent numeric not null default 0,
  total_coins numeric not null default 0,
  note text,
  updated_at timestamptz not null default now()
);

-- 2. RLS 활성화 후 정책: 누구나 읽기, 누구나 삽입/업데이트 (anon 키로)
alter table public.leaderboard enable row level security;

drop policy if exists "Allow public read" on public.leaderboard;
create policy "Allow public read" on public.leaderboard for select using (true);

drop policy if exists "Allow public insert" on public.leaderboard;
create policy "Allow public insert" on public.leaderboard for insert with check (true);

drop policy if exists "Allow public update" on public.leaderboard;
create policy "Allow public update" on public.leaderboard for update using (true);

-- (upsert는 insert + update로 처리되므로 위 정책으로 충분)
