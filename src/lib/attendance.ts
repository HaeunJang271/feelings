export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isYesterday(dateStr: string): boolean {
  const d = parseDateStr(dateStr)
  const y = new Date()
  y.setDate(y.getDate() - 1)
  return d.getFullYear() === y.getFullYear() && d.getMonth() === y.getMonth() && d.getDate() === y.getDate()
}

export function getStreakReward(streak: number): { coins: number; gachaTicket?: number; title?: string } | null {
  if (streak >= 30) return { coins: 5000, title: '레전드 출석왕' }
  if (streak >= 7) return { coins: 500, gachaTicket: 1 }
  if (streak >= 3) return { coins: 100 }
  return null
}
