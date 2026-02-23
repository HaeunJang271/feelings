import { useState } from 'react'
import { LOTTO_PRICE, LOTTO_MIN, LOTTO_MAX, LOTTO_PICKS } from '../lib/lotto'

interface LottoProps {
  coins: number
  tickets: { id: string; numbers: number[]; boughtAt: number; matched?: number; prize?: number }[]
  onBuy: (numbers: number[]) => boolean
  onDraw: () => { winning: number[]; results: { numbers: number[]; matched?: number; prize?: number }[]; totalPrize: number } | null
}

export function Lotto({ coins, tickets, onBuy, onDraw }: LottoProps) {
  const [picks, setPicks] = useState<number[]>([])
  const [lastDraw, setLastDraw] = useState<{ winning: number[]; results: { numbers: number[]; matched?: number; prize?: number }[]; totalPrize: number } | null>(null)

  const canAdd = (n: number) => !picks.includes(n) && picks.length < LOTTO_PICKS
  const toggle = (n: number) => {
    if (picks.includes(n)) setPicks(picks.filter((p) => p !== n))
    else if (canAdd(n)) setPicks([...picks, n].sort((a, b) => a - b))
  }

  const handleBuy = () => {
    if (picks.length !== LOTTO_PICKS) return
    const ok = onBuy(picks)
    if (ok) setPicks([])
  }

  const handleDraw = () => {
    const result = onDraw()
    if (result) setLastDraw(result)
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem' }}>🎰 감정 복권</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        1장 {LOTTO_PRICE}코인 · 숫자 6개 선택
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>숫자 선택 (1~45 중 6개)</div>
        <div className="lotto-grid">
          {Array.from({ length: LOTTO_MAX - LOTTO_MIN + 1 }, (_, i) => LOTTO_MIN + i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              className={`lotto-num ${picks.includes(n) ? 'selected' : ''}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '0.5rem' }}>선택: [{picks.join(', ')}]</div>
      </div>
      <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
        당첨: 6개 100,000 / 5개 10,000 / 4개 1,000 / 3개 100코인
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn-buy" onClick={handleBuy} disabled={picks.length !== LOTTO_PICKS || coins < LOTTO_PRICE}>
          구매하기 ({LOTTO_PRICE}코인)
        </button>
        {tickets.length > 0 && (
          <button type="button" className="btn-buy" onClick={handleDraw}>
            추첨하기 ({tickets.length}장)
          </button>
        )}
      </div>
      {lastDraw && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
          <div>당첨 번호: [{lastDraw.winning.join(', ')}]</div>
          <div style={{ marginTop: '0.5rem' }}>총 당첨금: +{lastDraw.totalPrize.toLocaleString()}코인</div>
          {lastDraw.results.map((r, i) => (
            <div key={i}>내 번호 [{r.numbers.join(', ')}] — {r.matched}개 일치 {r.prize ? `+${r.prize}코인` : ''}</div>
          ))}
        </div>
      )}
    </div>
  )
}
