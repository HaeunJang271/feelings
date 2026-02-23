export const LOTTO_PRICE = 100
export const LOTTO_MIN = 1
export const LOTTO_MAX = 45
export const LOTTO_PICKS = 6

export const LOTTO_PRIZES: Record<number, number> = {
  6: 100_000,
  5: 10_000,
  4: 1_000,
  3: 100,
}

export function drawWinningNumbers(): number[] {
  const arr: number[] = []
  while (arr.length < LOTTO_PICKS) {
    const n = LOTTO_MIN + Math.floor(Math.random() * (LOTTO_MAX - LOTTO_MIN + 1))
    if (!arr.includes(n)) arr.push(n)
  }
  return arr.sort((a, b) => a - b)
}

export function countMatch(picked: number[], winning: number[]): number {
  return picked.filter((n) => winning.includes(n)).length
}
