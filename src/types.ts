// 감정 시장·거래 타입

export interface EmotionQuote {
  id: string
  price: number
  changePercent: number
  history: number[]
  trend: 'up' | 'down' | 'flat'
  label: '급등' | '상승' | '안정' | '하락' | '급락'
}

export interface PortfolioHoldings {
  [emotionId: string]: { coins: number; avgPrice: number }
}

export interface TradeRecord {
  id: string
  emotionId: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: number
}

export type GachaRarity = 'normal' | 'rare' | 'epic' | 'legend' | 'mythic'
export interface GachaResult {
  rarity: GachaRarity
  coins: number
  title?: string
}

export interface AttendanceState {
  lastDate: string // YYYY-MM-DD
  streak: number
  checkedDates: string[] // YYYY-MM-DD 출석한 날만
}

export interface LottoTicket {
  id: string
  numbers: number[]
  boughtAt: number
  drawId?: string
  matched?: number
  prize?: number
}

export interface UserState {
  coins: number
  portfolio: PortfolioHoldings
  history: TradeRecord[]
  nickname: string
  joinedAt: number
  gachaPity?: number
  gachaTickets?: number
  attendance?: AttendanceState
  achievementIds?: string[]
  lottoTickets?: LottoTicket[]
}

export interface LeaderboardEntry {
  userId: string
  nickname: string
  yieldPercent: number
  totalCoins: number
  note?: string
  updatedAt: number
}

export interface NewsItem {
  id: string
  type: 'flash' | 'headline' | 'warning'
  title: string
  emotionId?: string
  timestamp: number
}
