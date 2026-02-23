import type { LeaderboardEntry } from '../types'

const KEY = 'emotion-exchange-leaderboard-v1'

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as LeaderboardEntry[]
    return list.filter((e) => !e.userId.startsWith('bot'))
  } catch {
    return []
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch (_) {}
}

export function updateLeaderboardEntry(
  entries: LeaderboardEntry[],
  userId: string,
  entry: Omit<LeaderboardEntry, 'updatedAt'>
): LeaderboardEntry[] {
  const now = Date.now()
  const newEntry: LeaderboardEntry = { ...entry, updatedAt: now }
  const filtered = entries.filter((e) => e.userId !== userId)
  const merged = [...filtered, newEntry].sort((a, b) => b.yieldPercent - a.yieldPercent)
  saveLeaderboard(merged)
  return merged
}
