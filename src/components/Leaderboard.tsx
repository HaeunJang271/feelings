import { useState, useEffect } from 'react'
import { loadLeaderboard, updateLeaderboardEntry } from '../lib/leaderboard'
import type { EmotionQuote } from '../types'
import type { LeaderboardEntry, UserState } from '../types'

interface LeaderboardProps {
  user: UserState
  quotes: EmotionQuote[]
}

function getYieldAndCoins(user: UserState, quotes: EmotionQuote[]): { yieldPercent: number; totalCoins: number } {
  const portfolioSum = Object.entries(user.portfolio).reduce((sum, [emotionId, hold]) => {
    const q = quotes.find((r) => r.id === emotionId)
    const value = q ? (hold.coins / hold.avgPrice) * q.price : hold.coins
    return sum + value
  }, 0)
  const totalCoins = user.coins + portfolioSum
  const yieldPercent = ((totalCoins - 1000) / 1000) * 100
  return { yieldPercent, totalCoins }
}

export function Leaderboard({ user, quotes }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => loadLeaderboard())
  const userId = `user-${user.joinedAt}`

  const { yieldPercent, totalCoins } = getYieldAndCoins(user, quotes)

  useEffect(() => {
    const current = loadLeaderboard()
    const updated = updateLeaderboardEntry(current, userId, {
      userId,
      nickname: user.nickname,
      yieldPercent,
      totalCoins,
      note: user.history.length > 0 ? '감정 거래 중' : undefined,
    })
    setEntries(updated)
  }, [userId, user.nickname, user.history.length, yieldPercent, totalCoins])

  const sorted = [...entries].sort((a, b) => b.yieldPercent - a.yieldPercent)

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>🏆 오늘의 감정 투자 고수</h3>
      <ol className="leaderboard">
        {sorted.map((e, idx) => (
          <li key={e.userId} style={{ opacity: e.userId === userId ? 1 : 0.9 }}>
            <span>
              <strong>{idx + 1}. {e.nickname}</strong>
              {e.note && <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e.note}</span>}
            </span>
            <span style={{ color: 'var(--up)', fontWeight: 700 }}>
              {e.yieldPercent >= 0 ? '+' : ''}{e.yieldPercent.toFixed(0)}%
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
