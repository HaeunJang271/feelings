import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { EmotionDef } from '../data/emotions'
import type { EmotionQuote } from '../types'

interface TradeModalProps {
  isOpen: boolean
  type: 'buy' | 'sell'
  def: EmotionDef
  quote: EmotionQuote
  userCoins: number
  holdingCoins: number
  onConfirm: (amount: number) => boolean
  onClose: () => void
}

export function TradeModal({
  isOpen,
  type,
  def,
  quote,
  userCoins,
  holdingCoins,
  onConfirm,
  onClose,
}: TradeModalProps) {
  const [amount, setAmount] = useState('')
  const max = type === 'buy' ? userCoins : holdingCoins
  const num = Math.min(max, Math.max(0, Math.floor(Number(amount) || 0)))

  const handleAllIn = () => setAmount(String(max))
  const handleConfirm = () => {
    if (num <= 0) return
    const ok = onConfirm(num)
    if (ok) {
      setAmount('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3>
            지금 네 기분은? — {def.emoji} {def.nameKr} {type === 'buy' ? '매수' : '매도'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>
            현재가: <strong style={{ color: 'var(--text)' }}>{quote.price.toFixed(1)}</strong> pt
            {' · '}
            오늘 변동:{' '}
            <span className={quote.trend === 'up' ? 'change up' : quote.trend === 'down' ? 'change down' : 'change flat'}>
              {quote.changePercent >= 0 ? '▲' : '▼'} {Math.abs(quote.changePercent)}%
            </span>
          </p>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
              {type === 'buy' ? '투자' : '매도'} 코인
            </label>
            <input
              type="number"
              min={0}
              max={max}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn-buy" onClick={handleAllIn} style={{ flex: 1 }}>
                올인 ({max.toLocaleString()})
              </button>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{ background: 'var(--bg-glass)', color: 'var(--text)' }}>
              취소
            </button>
            <button
              type="button"
              className={type === 'buy' ? 'btn-buy' : 'btn-sell'}
              onClick={handleConfirm}
              disabled={num <= 0}
              style={{ flex: 2 }}
            >
              {type === 'buy' ? '매수' : '매도'} ({num.toLocaleString()} 코인)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
