import { STORAGE_KEY } from '../data/emotions'
import type { UserState } from '../types'

export function loadUser(): UserState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserState
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
  }
}
