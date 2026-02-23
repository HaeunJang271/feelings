// 4(시간대) x 7(요일) 그리드. 값 0=불안, 1=혼란, 2=행복, 3=평온
const KEY = 'emotion-exchange-heatmap-v1'

const EMOTION_TO_GROUP: Record<string, number> = {
  anxiety: 0,
  fear: 0,
  sadness: 0,
  irritation: 0,
  confusion: 1,
  numbness: 1,
  mixed: 1,
  happiness: 2,
  excitement: 2,
  passion: 2,
  pride: 2,
  peace: 3,
}

export function loadHeatmapGrid(): number[][] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyGrid()
    const parsed = JSON.parse(raw) as number[][]
    if (!Array.isArray(parsed) || parsed.length !== 4) return emptyGrid()
    return parsed.map((row) => (Array.isArray(row) && row.length === 7 ? row : Array(7).fill(3)))
  } catch {
    return emptyGrid()
  }
}

function emptyGrid(): number[][] {
  return [
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
  ]
}

export function saveHeatmapGrid(grid: number[][]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(grid))
  } catch (_) {}
}

export function getCurrentSlot(): { row: number; col: number } {
  const d = new Date()
  const hour = d.getHours()
  const row = hour < 6 ? 0 : hour < 12 ? 1 : hour < 18 ? 2 : 3
  const col = (d.getDay() + 6) % 7 // 0=월, 6=일
  return { row, col }
}

export function getDominantGroup(quotes: { id: string; changePercent: number }[]): number {
  if (!quotes.length) return 3
  const top = quotes.reduce((a, b) => (Math.abs(b.changePercent) > Math.abs(a.changePercent) ? b : a))
  return EMOTION_TO_GROUP[top.id] ?? 3
}

export function updateHeatmapCell(grid: number[][], row: number, col: number, value: number): number[][] {
  const next = grid.map((r, i) => (i === row ? r.map((v, j) => (j === col ? value : v)) : r))
  saveHeatmapGrid(next)
  return next
}
