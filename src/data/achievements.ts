export interface AchievementDef {
  id: string
  name: string
  desc: string
  reward: string
  rewardCoins?: number
  icon: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_trade', name: '첫 거래', desc: '첫 매수/매도 완료', reward: '10코인', rewardCoins: 10, icon: '✅' },
  { id: 'profit_100', name: '100% 수익', desc: '한 종목에서 100% 이상 수익', reward: '50코인', rewardCoins: 50, icon: '📈' },
  { id: 'bankruptcy', name: '파산 경험', desc: '보유 코인 0이 된 적 있음', reward: '특별 칭호', icon: '💀' },
  { id: 'coin_10k', name: '10,000코인 달성', desc: '보유 코인 10,000 이상', reward: '100코인', rewardCoins: 100, icon: '🪙' },
  { id: 'legend_gacha', name: '레전드 가챠', desc: '가챠에서 레전드 등급 획득', reward: '가챠권 1장', icon: '🟠' },
  { id: 'club_first', name: '클럽 1위', desc: '리더보드 1위 달성', reward: '500코인', rewardCoins: 500, icon: '🏆' },
]
