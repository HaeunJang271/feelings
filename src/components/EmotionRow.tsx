import { motion } from 'framer-motion'
import { MiniChart } from './MiniChart'
import type { EmotionQuote } from '../types'
import type { EmotionDef } from '../data/emotions'

interface EmotionRowProps {
  def: EmotionDef
  quote: EmotionQuote
  onBuy: () => void
  onSell: () => void
  hasHoldings: boolean
}

export function EmotionRow({ def, quote, onBuy, onSell, hasHoldings }: EmotionRowProps) {
  return (
    <motion.div
      className="emotion-row"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="emoji-name">
        <span>{def.emoji}</span>
        <span>{def.nameKr}</span>
      </div>
      <div className="mini-chart">
        <MiniChart history={quote.history} trend={quote.trend} />
      </div>
      <span className={`change ${quote.trend}`}>
        {quote.changePercent >= 0 ? '▲' : '▼'} {Math.abs(quote.changePercent)}%
      </span>
      <span className={`label ${quote.label}`}>{quote.label}</span>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <button type="button" className="btn-buy" onClick={onBuy}>
          매수
        </button>
        <button
          type="button"
          className="btn-sell"
          onClick={onSell}
          disabled={!hasHoldings}
        >
          매도
        </button>
      </div>
    </motion.div>
  )
}
