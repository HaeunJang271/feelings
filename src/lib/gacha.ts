import type { GachaResult, GachaRarity } from '../types'

const GACHA_COST = 100
const PITY_LEGEND = 100

const RATES: { rarity: GachaRarity; chance: number; min: number; max: number; title?: string }[] = [
  { rarity: 'normal', chance: 0.7, min: 50, max: 200 },
  { rarity: 'rare', chance: 0.2, min: 500, max: 500 },
  { rarity: 'epic', chance: 0.08, min: 1000, max: 1000 },
  { rarity: 'legend', chance: 0.019, min: 5000, max: 5000 },
  { rarity: 'mythic', chance: 0.001, min: 50000, max: 50000, title: '신화의 감정 탐험가' },
]

export { GACHA_COST, PITY_LEGEND, RATES }

function getRandomInRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function rollGacha(pity: number): { result: GachaResult; newPity: number } {
  let newPity = pity + 1
  let useLegend = false
  if (newPity >= PITY_LEGEND) {
    useLegend = true
    newPity = 0
  }
  if (useLegend) {
    const legendRow = RATES.find((r) => r.rarity === 'legend')!
    const coins = getRandomInRange(legendRow.min, legendRow.max)
    return {
      result: { rarity: 'legend', coins },
      newPity,
    }
  }
  const r = Math.random()
  let acc = 0
  for (const row of RATES) {
    if (row.rarity === 'mythic') continue
    acc += row.chance
    if (r < acc) {
      const coins = row.min === row.max ? row.min : getRandomInRange(row.min, row.max)
      return { result: { rarity: row.rarity, coins, title: row.title }, newPity }
    }
  }
  const mythic = RATES[RATES.length - 1]
  return {
    result: { rarity: 'mythic', coins: mythic.min, title: mythic.title },
    newPity: 0,
  }
}

export function rollGacha10(pity: number): { results: GachaResult[]; newPity: number } {
  const results: GachaResult[] = []
  let p = pity
  for (let i = 0; i < 10; i++) {
    const { result, newPity } = rollGacha(p)
    results.push(result)
    p = newPity
  }
  return { results, newPity: p }
}
