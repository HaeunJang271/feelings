import { ACHIEVEMENTS } from '../data/achievements'
import type { UserState } from '../types'

interface AchievementsProps {
  user: UserState
  totalAchievements: number
}

export function Achievements({ user, totalAchievements }: AchievementsProps) {
  const completed = new Set(user.achievementIds ?? [])

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem' }}>🏅 업적 달성</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        진행도: {completed.size} / {totalAchievements}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {ACHIEVEMENTS.map((a) => (
          <li
            key={a.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--border)',
              opacity: completed.has(a.id) ? 1 : 0.6,
            }}
          >
            <span>{completed.has(a.id) ? '✅' : '⬜'}</span>
            <span>{a.icon}</span>
            <div>
              <strong>{a.name}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.desc} — {a.reward}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
