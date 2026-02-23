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

export interface UserState {
  coins: number
  portfolio: PortfolioHoldings
  history: TradeRecord[]
  nickname: string
  joinedAt: number
}

export interface NewsItem {
  id: string
  type: 'flash' | 'headline' | 'warning'
  title: string
  emotionId?: string
  timestamp: number
}
