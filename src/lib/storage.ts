import { STORAGE_KEY } from '../data/emotions'
import type { UserState, AttendanceState } from '../types'

export function loadUser(): UserState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const u = JSON.parse(raw) as UserState
    u.gachaPity = u.gachaPity ?? 0
    u.gachaTickets = u.gachaTickets ?? 0
    u.achievementIds = u.achievementIds ?? []
    u.lottoTickets = u.lottoTickets ?? []
    if (u.attendance) {
      const att = u.attendance as AttendanceState & { checkedDates?: string[] }
      if (!Array.isArray(att.checkedDates)) {
        u.attendance = { ...att, checkedDates: att.lastDate ? [att.lastDate] : [] }
      }
    }
    return u
  } catch {
    return null
  }
}

export function saveUser(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (_) {}
}

export function createNewUser(nickname: string): UserState {
  return {
    coins: 1000,
    portfolio: {},
    history: [],
    nickname: nickname || '익명의 투자자',
    joinedAt: Date.now(),
    gachaPity: 0,
    gachaTickets: 0,
    achievementIds: [],
    lottoTickets: [],
  }
}
