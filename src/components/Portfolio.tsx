import { useMemo } from 'react'
import { EMOTIONS } from '../data/emotions'
import type { UserState } from '../types'
import type { EmotionQuote } from '../types'

interface PortfolioProps {
  user: UserState
  quotes: EmotionQuote[]
}

export function Portfolio({ user, quotes }: PortfolioProps) {
  const holdingsWithQuote = useMemo(() => {
    return Object.entries(user.portfolio).map(([emotionId, hold]) => {
      const def = EMOTIONS.find((e) => e.id === emotionId)
      const quote = quotes.find((q) => q.id === emotionId)
      const currentValue = quote ? (hold.coins / hold.avgPrice) * quote.price : hold.coins
      const yieldPercent = quote ? ((currentValue - hold.coins) / hold.coins) * 100 : 0
      return { emotionId, hold, def, quote, currentValue, yieldPercent }
    })
  }, [user.portfolio, quotes])

  const totalValue = useMemo(() => {
    const inCoins = user.coins
    const inHoldings = holdingsWithQuote.reduce((s, h) => s + h.currentValue, 0)
    return inCoins + inHoldings
  }, [user.coins, holdingsWithQuote])

  const recentHistory = user.history.slice(0, 10)

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>📊 내 감정 포트폴리오</h3>
      {user.history.length > 0 && user.history.length <= 3 && (
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--accent)' }}>
          🏅 첫 투자 완료!
        </p>
      )}
      <p style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>
        보유 코인: <strong style={{ color: 'var(--up-bright)' }}>{Math.floor(user.coins).toLocaleString()}</strong>
        {' · '}
        평가총액: <strong>{Math.floor(totalValue).toLocaleString()}</strong> 코인
      </p>
      <ul className="portfolio-list">
        {holdingsWithQuote.map(({ emotionId, hold, def, yieldPercent }) => (
          <li key={emotionId}>
            <span>
              {def?.emoji} {def?.nameKr}
            </span>
            <span>
              {Math.floor(hold.coins).toLocaleString()} 코인
              <span className={yieldPercent >= 0 ? 'change up' : 'change down'} style={{ marginLeft: '0.5rem' }}>
                ({yieldPercent >= 0 ? '+' : ''}{yieldPercent.toFixed(1)}%)
              </span>
            </span>
          </li>
        ))}
        {holdingsWithQuote.length === 0 && (
          <li style={{ color: 'var(--text-muted)' }}>보유 종목이 없습니다. 메인에서 감정을 매수해보세요!</li>
        )}
      </ul>
      <h4 style={{ margin: '1rem 0 0.5rem', fontSize: '0.95rem' }}>과거 거래 내역</h4>
      <ul className="history-list">
        {recentHistory.map((t) => {
          const def = EMOTIONS.find((e) => e.id === t.emotionId)
          const time = new Date(t.timestamp).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          return (
            <li key={t.id}>
              <span className={t.type}>{t.type === 'buy' ? '매수' : '매도'}</span>
              {' '}{def?.emoji} {def?.nameKr} {t.amount.toLocaleString()}코인 @ {t.price.toFixed(1)} · {time}
            </li>
          )
        })}
        {recentHistory.length === 0 && <li style={{ color: 'var(--text-muted)' }}>거래 내역이 없습니다.</li>}
      </ul>
    </div>
  )
}
