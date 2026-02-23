import { supabase, isSupabaseConfigured } from './supabase'
import type { LeaderboardEntry } from '../types'

const TABLE = 'leaderboard'

function rowToEntry(row: {
  user_id: string
  nickname: string
  yield_percent: number | string
  total_coins: number | string
  note: string | null
  updated_at: string
}): LeaderboardEntry {
  return {
    userId: row.user_id,
    nickname: row.nickname,
    yieldPercent: Number(row.yield_percent),
    totalCoins: Number(row.total_coins),
    note: row.note ?? undefined,
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select('user_id, nickname, yield_percent, total_coins, note, updated_at')
    .order('yield_percent', { ascending: false })
    .limit(100)
  if (error) {
    console.warn('Leaderboard fetch failed:', error.message)
    throw new Error(error.message)
  }
  return (data ?? []).map(rowToEntry)
}

export async function upsertLeaderboardEntry(entry: Omit<LeaderboardEntry, 'updatedAt'>): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false }
  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: entry.userId,
      nickname: entry.nickname,
      yield_percent: entry.yieldPercent,
      total_coins: entry.totalCoins,
      note: entry.note ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
  if (error) {
    console.warn('Leaderboard upsert failed:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export { isSupabaseConfigured }
