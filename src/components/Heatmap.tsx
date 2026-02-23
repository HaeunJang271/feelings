import { useState, useEffect } from 'react'
import { loadHeatmapGrid, getCurrentSlot, getDominantGroup, updateHeatmapCell } from '../lib/heatmap'
import type { EmotionQuote } from '../types'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const HOURS = ['00시', '06시', '12시', '18시']
const COLORS = ['#ef4444', '#eab308', '#22c55e', '#3b82f6']
const LABELS = ['불안 급등', '혼란', '행복 우세', '평온']

interface HeatmapProps {
  quotes: EmotionQuote[]
}

export function Heatmap({ quotes }: HeatmapProps) {
  const [grid, setGrid] = useState<number[][]>(() => loadHeatmapGrid())

  useEffect(() => {
    if (!quotes.length) return
    const { row, col } = getCurrentSlot()
    const group = getDominantGroup(quotes)
    setGrid((prev) => {
      const next = updateHeatmapCell(prev, row, col, group)
      return next
    })
  }, [quotes])

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem' }}>📊 시간대별 감정 지도</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        실시간 시세 기준 지배 감정이 셀에 반영됩니다.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 280 }}>
          <thead>
            <tr>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }} />
              {DAYS.map((d) => (
                <th key={d} style={{ padding: '0.25rem 0.5rem' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h, i) => (
              <tr key={h}>
                <td style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)' }}>{h}</td>
                {grid[i].map((v, j) => (
                  <td key={j} style={{ padding: '2px' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        backgroundColor: COLORS[v],
                      }}
                      title={`${HOURS[i]} ${DAYS[j]} ${LABELS[v]}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
        {COLORS.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: c }} />
            {LABELS[i]}
          </span>
        ))}
      </div>
    </div>
  )
}
