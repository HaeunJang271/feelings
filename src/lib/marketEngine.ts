// 가격 시뮬레이션: (투자자 비율 × 변동성) + 랜덤

import { EMOTIONS } from '../data/emotions'
import type { EmotionQuote } from '../types'

const HISTORY_LEN = 30
const BASE_PRICE = 100
const VOLATILITY = 0.02
const TREND_STRENGTH = 0.3

function randomWalk(prev: number): number {
  const r = (Math.random() - 0.5) * 2
  return prev * (1 + r * VOLATILITY)
}

function getTrendLabel(changePercent: number): EmotionQuote['label'] {
  if (changePercent >= 50) return '급등'
  if (changePercent >= 5) return '상승'
  if (changePercent <= -50) return '급락'
  if (changePercent <= -5) return '하락'
  return '안정'
}

function getTrend(changePercent: number): EmotionQuote['trend'] {
  if (changePercent > 0) return 'up'
  if (changePercent < 0) return 'down'
  return 'flat'
}

export function createInitialQuotes(): EmotionQuote[] {
  return EMOTIONS.map((e) => {
    const price = BASE_PRICE + Math.random() * 80
    const history = Array(HISTORY_LEN).fill(price)
    return {
      id: e.id,
      price: Math.round(price * 10) / 10,
      changePercent: 0,
      history,
      trend: 'flat',
      label: '안정',
    }
  })
}

export function tickQuotes(
  prev: EmotionQuote[],
  investmentWeight?: Record<string, number>
): EmotionQuote[] {
  return prev.map((q) => {
    const base = q.price
    let next = randomWalk(base)
    if (investmentWeight && investmentWeight[q.id] !== undefined) {
      const w = investmentWeight[q.id]
      next = next * (1 + (w - 0.5) * TREND_STRENGTH)
    }
    const newPrice = Math.max(20, Math.min(500, next))
    const newHistory = [...q.history.slice(1), newPrice]
    const first = newHistory[0]
    const changePercent = first ? ((newPrice - first) / first) * 100 : 0
    return {
      ...q,
      price: Math.round(newPrice * 10) / 10,
      changePercent: Math.round(changePercent * 10) / 10,
      history: newHistory,
      trend: getTrend(changePercent),
      label: getTrendLabel(changePercent),
    }
  })
}
