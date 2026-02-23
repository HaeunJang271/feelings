import { useState, useEffect, useCallback } from 'react'
import { createInitialQuotes, tickQuotes } from '../lib/marketEngine'
import { loadUser, saveUser, createNewUser } from '../lib/storage'
import { EMOTIONS } from '../data/emotions'
import type { EmotionQuote, UserState, TradeRecord, PortfolioHoldings } from '../types'

const TICK_MS = 2000

export function useEmotionMarket() {
  const [quotes, setQuotes] = useState<EmotionQuote[]>(() => createInitialQuotes())
  const [user, setUser] = useState<UserState | null>(() => loadUser())

  useEffect(() => {
    if (!user) return
    const investmentWeight: Record<string, number> = {}
    const total = Object.values(user.portfolio).reduce((s, h) => s + h.coins, 0) || 1
    Object.entries(user.portfolio).forEach(([id, h]) => {
      investmentWeight[id] = h.coins / total
    })
    const id = setInterval(() => {
      setQuotes((prev) => tickQuotes(prev, Object.keys(investmentWeight).length ? investmentWeight : undefined))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [user?.portfolio])

  const initUser = useCallback((nickname: string) => {
    const newUser = createNewUser(nickname)
    setUser(newUser)
    saveUser(newUser)
  }, [])

  const buy = useCallback(
    (emotionId: string, coins: number) => {
      if (!user || user.coins < coins || coins <= 0) return false
      const quote = quotes.find((q) => q.id === emotionId)
      if (!quote) return false
      const units = coins / quote.price
      const portfolio: PortfolioHoldings = { ...user.portfolio }
      const existing = portfolio[emotionId]
      if (existing) {
        const totalCoins = existing.coins + coins
        const totalUnits = existing.coins / (existing.avgPrice || quote.price) + units
        portfolio[emotionId] = { coins: totalCoins, avgPrice: totalCoins / totalUnits }
      } else {
        portfolio[emotionId] = { coins, avgPrice: quote.price }
      }
      const record: TradeRecord = {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        emotionId,
        type: 'buy',
        amount: coins,
        price: quote.price,
        timestamp: Date.now(),
      }
      const next: UserState = {
        ...user,
        coins: user.coins - coins,
        portfolio,
        history: [record, ...user.history],
      }
      setUser(next)
      saveUser(next)
      return true
    },
    [user, quotes]
  )

  const sell = useCallback(
    (emotionId: string, coinsToSell: number) => {
      if (!user) return false
      const hold = user.portfolio[emotionId]
      if (!hold || hold.coins <= 0) return false
      const quote = quotes.find((q) => q.id === emotionId)
      if (!quote) return false
      const sellCoins = Math.min(coinsToSell, hold.coins)
      const proceeds = (sellCoins / hold.avgPrice) * quote.price
      const newPortfolio = { ...user.portfolio }
      if (hold.coins - sellCoins <= 0) delete newPortfolio[emotionId]
      else newPortfolio[emotionId] = { coins: hold.coins - sellCoins, avgPrice: hold.avgPrice }
      const record: TradeRecord = {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        emotionId,
        type: 'sell',
        amount: sellCoins,
        price: quote.price,
        timestamp: Date.now(),
      }
      const next: UserState = {
        ...user,
        coins: user.coins + proceeds,
        portfolio: newPortfolio,
        history: [record, ...user.history],
      }
      setUser(next)
      saveUser(next)
      return true
    },
    [user, quotes]
  )

  const getEmotionDef = useCallback((id: string) => EMOTIONS.find((e) => e.id === id), [])

  return { quotes, user, initUser, buy, sell, getEmotionDef }
}
