import { useState, useEffect, useCallback } from 'react'
import { createInitialQuotes, tickQuotes } from '../lib/marketEngine'
import { loadUser, saveUser, createNewUser } from '../lib/storage'
import { EMOTIONS } from '../data/emotions'
import { rollGacha, rollGacha10, GACHA_COST } from '../lib/gacha'
import { todayStr, isYesterday, getStreakReward } from '../lib/attendance'
import { ACHIEVEMENTS } from '../data/achievements'
import { LOTTO_PRICE, LOTTO_PRIZES, drawWinningNumbers, countMatch } from '../lib/lotto'
import type { EmotionQuote, UserState, TradeRecord, PortfolioHoldings, LottoTicket } from '../types'

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

  const updateUser = useCallback((updater: (u: UserState) => UserState) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      saveUser(next)
      return next
    })
  }, [])

  const addCoins = useCallback(
    (amount: number) => updateUser((u) => ({ ...u, coins: u.coins + amount })),
    [updateUser]
  )

  const gachaPull = useCallback(
    (count: 1 | 10) => {
      if (!user) return null
      const useTickets = Math.min(user.gachaTickets ?? 0, count)
      const payCoins = GACHA_COST * count - useTickets * GACHA_COST
      if (payCoins > 0 && user.coins < payCoins) return null
      const pity = user.gachaPity ?? 0
      const results = count === 10 ? rollGacha10(pity) : (() => { const r = rollGacha(pity); return { results: [r.result], newPity: r.newPity } })()
      const totalCoins = results.results.reduce((s, r) => s + r.coins, 0)
      updateUser((u) => ({
        ...u,
        coins: u.coins - payCoins + totalCoins,
        gachaPity: results.newPity,
        gachaTickets: Math.max(0, (u.gachaTickets ?? 0) - useTickets),
      }))
      return results.results
    },
    [user, updateUser]
  )

  const attendanceCheck = useCallback(() => {
    if (!user) return { ok: false, reward: null }
    const today = todayStr()
    const checked = user.attendance?.checkedDates ?? []
    if (checked.includes(today)) return { ok: false, reward: null }
    const last = user.attendance?.lastDate
    let streak = user.attendance?.streak ?? 0
    if (!last || isYesterday(last)) streak += 1
    else streak = 1
    const reward = getStreakReward(streak)
    const checkedDates = [...checked, today]
    updateUser((u) => ({
      ...u,
      attendance: { lastDate: today, streak, checkedDates },
      ...(reward?.coins && { coins: u.coins + reward.coins }),
      ...(reward?.gachaTicket && { gachaTickets: (u.gachaTickets ?? 0) + 1 }),
    }))
    return { ok: true, reward: { streak, coins: reward?.coins, gachaTicket: reward?.gachaTicket, title: reward?.title } }
  }, [user, updateUser])

  const unlockAchievement = useCallback(
    (id: string) => {
      if (!user || user.achievementIds?.includes(id)) return
      const ach = ACHIEVEMENTS.find((a) => a.id === id)
      if (!ach?.rewardCoins) {
        updateUser((u) => ({ ...u, achievementIds: [...(u.achievementIds ?? []), id] }))
        return
      }
      updateUser((u) => ({
        ...u,
        achievementIds: [...(u.achievementIds ?? []), id],
        coins: u.coins + (ach.rewardCoins ?? 0),
      }))
    },
    [user, updateUser]
  )

  const buyLottoTicket = useCallback(
    (numbers: number[]) => {
      if (!user || numbers.length !== 6 || user.coins < LOTTO_PRICE) return false
      const ticket: LottoTicket = {
        id: `l-${Date.now()}`,
        numbers: [...numbers].sort((a, b) => a - b),
        boughtAt: Date.now(),
      }
      updateUser((u) => ({
        ...u,
        coins: u.coins - LOTTO_PRICE,
        lottoTickets: [...(u.lottoTickets ?? []), ticket],
      }))
      return true
    },
    [user, updateUser]
  )

  const drawLotto = useCallback(() => {
    if (!user?.lottoTickets?.length) return null
    const winning = drawWinningNumbers()
    const tickets = user.lottoTickets ?? []
    let totalPrize = 0
    const updated = tickets.map((t) => {
      const matched = countMatch(t.numbers, winning)
      const prize = LOTTO_PRIZES[matched] ?? 0
      totalPrize += prize
      return { ...t, drawId: `d-${Date.now()}`, matched, prize }
    })
    updateUser((u) => ({
      ...u,
      coins: u.coins + totalPrize,
      lottoTickets: [],
    }))
    return { winning, results: updated, totalPrize }
  }, [user, updateUser])

  return {
    quotes,
    user,
    initUser,
    buy,
    sell,
    getEmotionDef,
    addCoins,
    updateUser,
    gachaPull,
    attendanceCheck,
    unlockAchievement,
    buyLottoTicket,
    drawLotto,
  }
}
