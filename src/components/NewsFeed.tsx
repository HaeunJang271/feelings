import { useMemo } from 'react'
import type { EmotionQuote } from '../types'
import { EMOTIONS } from '../data/emotions'

interface NewsFeedProps {
  quotes: EmotionQuote[]
}

export function NewsFeed({ quotes }: NewsFeedProps) {
  const items = useMemo(() => {
    const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent)
    const top = sorted[0]
    const bottom = sorted[sorted.length - 1]
    const topDef = top && EMOTIONS.find((e) => e.id === top.id)
    const bottomDef = bottom && EMOTIONS.find((e) => e.id === bottom.id)
    return [
      top && top.changePercent > 20 && {
        id: '1',
        type: 'flash' as const,
        title: `"${topDef?.nameKr}" ${top.changePercent}% 급등!`,
        emotionId: top.id,
        timestamp: Date.now(),
      },
      bottom && bottom.changePercent < -15 && {
        id: '2',
        type: 'warning' as const,
        title: `"${bottomDef?.nameKr}" 지수 급락... ${bottom.changePercent}%`,
        emotionId: bottom.id,
        timestamp: Date.now(),
      },
      {
        id: '3',
        type: 'headline' as const,
        title: '오늘의 감정 시장 요약',
        timestamp: Date.now(),
      },
    ].filter(Boolean) as { id: string; type: 'flash' | 'headline' | 'warning'; title: string; emotionId?: string; timestamp: number }[]
  }, [quotes])

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>📰 감정 시장 속보</h3>
      <div>
        {items.map((n) => (
          <div key={n.id} className={`news-item ${n.type}`}>
            {n.type === 'flash' && '🔔 '}
            {n.type === 'warning' && '⚠️ '}
            {n.title}
          </div>
        ))}
      </div>
    </div>
  )
}
