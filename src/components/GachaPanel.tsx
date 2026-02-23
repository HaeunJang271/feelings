import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GACHA_COST, PITY_LEGEND, RATES } from '../lib/gacha'
import type { GachaResult } from '../types'

const RARITY_LABEL: Record<string, string> = {
  normal: '⚪ 일반',
  rare: '🔵 레어',
  epic: '🟣 에픽',
  legend: '🟠 레전드',
  mythic: '✨ 신화',
}

interface GachaPanelProps {
  coins: number
  gachaTickets: number
  gachaPity: number
  onPull: (count: 1 | 10) => GachaResult[] | null
  onLegend?: () => void
}

export function GachaPanel({ coins, gachaTickets, gachaPity, onPull, onLegend }: GachaPanelProps) {
  const [results, setResults] = useState<GachaResult[] | null>(null)
  const cost1 = Math.max(0, GACHA_COST - (gachaTickets >= 1 ? GACHA_COST : 0))
  const cost10 = Math.max(0, 10 * GACHA_COST - Math.min(gachaTickets, 10) * GACHA_COST)

  const handlePull = (count: 1 | 10) => {
    const r = onPull(count)
    if (r) {
      setResults(r)
      if (r.some((x) => x.rarity === 'legend' || x.rarity === 'mythic')) onLegend?.()
    }
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>🎁 미스터리 감정 박스</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
        100코인으로 랜덤 감정 뽑기! 가챠권 {gachaTickets}장 보유
      </p>
      <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>확률</div>
        {RATES.map((row) => (
          <div key={row.rarity} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{RARITY_LABEL[row.rarity]}</span>
            <span>{(row.chance * 100).toFixed(row.rarity === 'mythic' ? 1 : 0)}% — {row.min.toLocaleString()}~{row.max.toLocaleString()}코인</span>
          </div>
        ))}
        <div style={{ marginTop: '0.5rem', color: 'var(--accent)' }}>천장: {PITY_LEGEND}회 뽑으면 레전드 확정! (현재 {gachaPity}회)</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-buy"
          onClick={() => handlePull(1)}
          disabled={coins < cost1 && gachaTickets < 1}
        >
          단차 뽑기 {cost1 > 0 ? `(${cost1}코인)` : '(가챠권)'}
        </button>
        <button
          type="button"
          className="btn-buy"
          onClick={() => handlePull(10)}
          disabled={coins < cost10 && gachaTickets < 10}
        >
          10연차 뽑기 {cost10 > 0 ? `(${cost10}코인)` : '(가챠권)'}
        </button>
      </div>

      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}
          >
            <div style={{ marginBottom: '0.5rem', fontWeight: 700 }}>🎉 뽑기 결과</div>
            {results.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span>{RARITY_LABEL[r.rarity] ?? r.rarity}</span>
                <span style={{ color: 'var(--up-bright)' }}>+{r.coins.toLocaleString()}코인</span>
                {r.title && <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>{r.title}</span>}
              </div>
            ))}
            <button type="button" onClick={() => setResults(null)} style={{ marginTop: '0.5rem', background: 'var(--bg-glass)', color: 'var(--text)' }}>
              닫기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
